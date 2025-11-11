'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, Leaf, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/src/stores/authStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  
  const { signIn, loading } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async () => {
    setError('')
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    const result = await signIn(email, password)
  
    if (result.error) {
      setError(result.error)
    } else {
      setShowToast(true)
      const { user } = useAuthStore.getState()
      
      setTimeout(() => {
        router.push(user?.is_admin ? '/admin/dashboard' : '/products')
      }, 2000)
    }
  }

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }

  return (
    <div className="min-h-screen flex">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 sm:top-8 right-4 sm:right-8 z-50 animate-in slide-in-from-top duration-500">
          <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-2xl flex items-center space-x-3 min-w-[280px] sm:min-w-[320px]">
            <div className="bg-emerald-100 p-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-emerald-900">Login Successful!</p>
              <p className="text-sm text-emerald-600">Redirecting to your account...</p>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&h=1600&fit=crop')"
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-teal-700/20 to-gray-900/80"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Leaf className="w-7 h-7 text-emerald-400" />
            </div>
            <span className="text-2xl font-black">HealthExcellence</span>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl font-black leading-tight">
                Find Your Perfect<br />
                Health Solution
              </h1>
              <p className="text-xl text-gray-300 max-w-md leading-relaxed">
                Premium wellness products are now just few clicks away - fast, easy, reliable.
              </p>
            </div>

            {/* Carousel Dots */}
            <div className="flex gap-2">
              <div className="w-12 h-1.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
            </div>
          </div>

          {/* Bottom Stats/Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-400">10K+</div>
              <div className="text-sm text-gray-400 mt-1">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-400">500+</div>
              <div className="text-sm text-gray-400 mt-1">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-400">24/7</div>
              <div className="text-sm text-gray-400 mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-gray-900">HealthExcellence</span>
          </div>

          {/* Header with Sign Up Button */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-gray-900">
                  Welcome Back 
                </h2>
              </div>
              <Link
                href="/register"
                className="hidden sm:block px-6 py-2.5 border-2 border-gray-900 text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all text-sm whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
            {/* Mobile Sign Up Button */}
            <Link
              href="/register"
              className="sm:hidden w-full flex items-center justify-center px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-all text-sm"
            >
              Sign Up
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-5 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900 font-medium"
                placeholder="health@safemail.com"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900 font-medium pr-12"
                  placeholder="••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-300 text-gray-900 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-sm font-semibold text-gray-700">Remember Me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg min-h-[50px] sm:min-h-[56px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-semibold">Instant Login</span>
            </div>
          </div>

          {/* Social Login Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link - Mobile Only */}
          <div className="text-center sm:hidden">
            <p className="text-gray-600 text-sm font-medium">
              Don't have any account?{' '}
              <Link 
                href="/register" 
                className="text-gray-900 font-bold hover:text-emerald-600 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}