'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')

  useEffect(() => {
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/orders')
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
          <p className="text-gray-700 text-lg">Payment Successful!</p>
          <p className="text-gray-500 text-sm">Reference: {reference?.slice(0, 10)}...</p>
        </div>
        <div className="flex items-center justify-center mt-4">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-2 text-gray-500">Redirecting to your orders...</span>
        </div>
      </div>
    </div>
  )
}
