'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, Loader2, Mail, AlertCircle, Leaf } from 'lucide-react'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('Verification token is missing')
    }
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Email verified successfully!')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Verification failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred during verification')
    }
  }

  const handleResendVerification = async () => {
    setResendLoading(true)
    setResendSuccess(false)
    
    const email = prompt('Please enter your email address:')
    
    if (!email) {
      setResendLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendSuccess(true)
        setMessage('Verification email sent! Please check your inbox.')
      } else {
        alert(data.error || 'Failed to resend verification email')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600 rounded-2xl flex items-center justify-center">
            <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-gray-900">HealthExcel</span>
        </div>

        {/* Content */}
        <div className="text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-spin" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Verifying Your Email</h2>
              <p className="text-sm sm:text-base text-gray-600">Please wait while we verify your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Email Verified!</h2>
              <p className="text-sm sm:text-base text-gray-600">{message}</p>
              <p className="text-xs sm:text-sm text-gray-500">Redirecting to login page...</p>
              
              <Link
                href="/login"
                className="inline-block mt-6 bg-gray-900 text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all text-sm sm:text-base"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Verification Failed</h2>
              <p className="text-sm sm:text-base text-gray-600">{message}</p>
              
              {resendSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4">
                  <p className="text-xs sm:text-sm text-emerald-700 font-medium">
                    Verification email sent! Please check your inbox.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="bg-emerald-600 text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base min-h-[50px]"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Resend Verification Email</span>
                    </>
                  )}
                </button>

                <Link
                  href="/login"
                  className="inline-block bg-gray-100 text-gray-900 px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm sm:text-base"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}