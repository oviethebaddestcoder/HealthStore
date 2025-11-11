// lib/api/auth.ts
import apiClient from './client'
import { setToken, clearToken } from '../../lib/utils/auth'

export interface RegisterData {
  email: string
  password: string
  full_name: string
  phone: string
}

export interface LoginData {
  email: string
  password: string
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data)
    if (response.data.token) setToken(response.data.token)
    return response.data
  },

  login: async (data: LoginData) => {
    const response = await apiClient.post('/auth/login', data)
    if (response.data.token) setToken(response.data.token)
    return response.data
  },

  logout: () => {
    clearToken()
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data.user
  },

  updateProfile: async (data: { full_name?: string; phone?: string; address?: any }) => {
    const response = await apiClient.put('/auth/profile', data)
    return response.data
  },

  verifyEmail: async (token: string) => {
    const response = await apiClient.post('/auth/verify-email', { token })
    return response.data
  },

  resendVerification: async (email: string) => {
    const response = await apiClient.post('/auth/resend-verification', { email })
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post('/auth/reset-password', { token, newPassword })
    return response.data
  },
}
