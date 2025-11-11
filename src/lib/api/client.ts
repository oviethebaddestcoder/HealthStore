// lib/api/client.ts
import axios from 'axios'
import { getToken, clearToken, setToken } from '../../lib/utils/auth'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Request interceptor: attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Response interceptor: handle 401 gracefully
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // optional: try refresh token endpoint later
        clearToken()
        if (typeof window !== 'undefined') window.location.href = '/login'
      } catch {
        clearToken()
        if (typeof window !== 'undefined') window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
