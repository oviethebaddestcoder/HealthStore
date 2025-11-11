// store/authStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authApi } from '../lib/api/auth'
import { setToken, clearToken, getToken } from '../lib/utils/auth'
import { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  initialized: boolean
  hydrated: boolean // ✅ ensures persist hydration
  setUser: (user: User | null) => void
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => Promise<{ error?: string }>
  signOut: () => void
  checkAuth: () => Promise<void>
  initializeAuth: () => Promise<void>
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<{ error?: string }>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      initialized: false,
      hydrated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // 🔐 SIGN IN
      signIn: async (email, password) => {
        try {
          set({ loading: true })
          const response = await authApi.login({ email, password })
          if (response.token) setToken(response.token)

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          })

          return {}
        } catch (error: any) {
          set({ loading: false })
          return { error: error.response?.data?.error || 'Login failed' }
        }
      },

      // 🧾 SIGN UP
      signUp: async (email, password, fullName, phone) => {
        try {
          set({ loading: true })
          const response = await authApi.register({
            email,
            password,
            full_name: fullName,
            phone,
          })
          if (response.token) setToken(response.token)

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          })

          return {}
        } catch (error: any) {
          set({ loading: false })
          return { error: error.response?.data?.error || 'Registration failed' }
        }
      },

      // 🚪 SIGN OUT
      signOut: () => {
        clearToken()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          initialized: true,
        })
      },

      // ✅ CHECK AUTH
      checkAuth: async () => {
        try {
          const token = getToken()
          if (!token) throw new Error('No token')
          const user = await authApi.getCurrentUser()
          set({
            user,
            token,
            isAuthenticated: true,
            initialized: true,
          })
        } catch {
          clearToken()
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            initialized: true,
          })
        }
      },

      // 👤 FETCH PROFILE
      fetchProfile: async () => {
        try {
          const user = await authApi.getCurrentUser()
          set({ user, isAuthenticated: true })
        } catch {
          clearToken()
          set({ user: null, isAuthenticated: false })
        }
      },

      // 🛠️ UPDATE PROFILE
      updateProfile: async (data) => {
        try {
          const response = await authApi.updateProfile(data)
          set({ user: response.user })
          return {}
        } catch (error: any) {
          return {
            error: error.response?.data?.error || 'Profile update failed',
          }
        }
      },

      // 🚀 Initialize after hydration
      initializeAuth: async () => {
        const { hydrated, initialized } = get()
        if (!hydrated || initialized) return // wait until localStorage is loaded

        const token = getToken()
        if (!token) {
          set({ initialized: true })
          return
        }

        try {
          const user = await authApi.getCurrentUser()
          set({
            user,
            token,
            isAuthenticated: true,
            initialized: true,
          })
        } catch {
          clearToken()
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            initialized: true,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // ✅ Called after persist data is loaded
        if (state) {
          state.hydrated = true
          // kick off auth init once data is ready
          state.initializeAuth()
        }
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        initialized: state.initialized,
      }),
    }
  )
)

