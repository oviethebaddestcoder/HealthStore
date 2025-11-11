'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useAuthStore } from '@/src/stores/authStore'
import { setToken } from '@/src/lib/utils/auth'
import { authApi } from '@/src/lib/api/auth'

export default function GoogleAuthSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuthStore()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Completing sign in...')

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        const token = searchParams.get('token')
        
        if (!token) {
          setStatus('error')
          setMessage('No authentication token received')
          setTimeout(() => router.push('/login'), 2000)
          return
        }

        // Store the token
        setToken(token)

        // Fetch user data
        const user = await authApi.getCurrentUser()
        
        // Update auth store
        setUser(user)

        setStatus('success')
        setMessage('Sign in successful! Redirecting...')

        // Redirect based on user type
        setTimeout(() => {
          if (user.is_admin) {
            router.push('/admin/dashboard')
          } else {
            router.push('/products')
          }
        }, 1500)

      } catch (error) {
        console.error('Google auth error:', error)
        setStatus('error')
        setMessage('Authentication failed. Please try again.')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleGoogleAuth()
  }, [searchParams, router, setUser])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {status === 'processing' && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Signing you in</h2>
            <p className="text-gray-600 text-lg">
              {message}
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100 animate-in zoom-in-95 duration-500">
            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome! 🎉</h2>
            <p className="text-gray-600 text-lg">
              {message}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100 animate-in zoom-in-95 duration-500">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Oops!</h2>
            <p className="text-gray-600 text-lg mb-6">
              {message}
            </p>
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}