'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/src/components/layout/Navbar'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Edit2, 
  Save, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Calendar,
  Package,
  ShoppingBag,
  LogOut,
  Key
} from 'lucide-react'
import { useAuthStore } from '@/src/stores/authStore'
import { authApi } from '@/src/lib/api/auth'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, initialized, fetchProfile, signOut } = useAuthStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push('/login')
    }
  }, [initialized, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      const addressString = typeof user.address === 'string' 
        ? user.address 
        : user.address?.address_line || ''
      
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        address: addressString
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      setError('Full name is required')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      await authApi.updateProfile(formData)
      await fetchProfile()
      setUpdateSuccess(true)
      setIsEditing(false)
      
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      const addressString = typeof user.address === 'string'
        ? user.address
        : user.address?.address_line || ''

      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        address: addressString
      })
    }
    setIsEditing(false)
    setError('')
  }

  const handleLogout = () => {
    signOut()
    router.push('/login')
  }

  if (!initialized || !user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your account information and settings
            </p>
          </div>

          {/* Success Message */}
          {updateSuccess && (
            <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center space-x-2 mb-6 animate-in slide-in-from-top">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">Profile updated successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">{error}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Main Profile Card - Takes 8 columns on large screens */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                {/* Edit/Save Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                  
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl transition-all font-medium text-sm sm:text-base ${
                          isEditing 
                            ? 'border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900 bg-white' 
                            : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed font-medium text-sm sm:text-base"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 ml-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl transition-all font-medium text-sm sm:text-base ${
                          isEditing 
                            ? 'border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900 bg-white' 
                            : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                        }`}
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                        className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl transition-all font-medium resize-none text-sm sm:text-base ${
                          isEditing 
                            ? 'border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900 bg-white' 
                            : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                        }`}
                        placeholder="Enter your full delivery address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Takes 4 columns on large screens */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6">
              {/* Account Status Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Account Status
                </h3>
                
                <div className="space-y-3">
                  {/* Verification Status */}
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-700">Email Verified</span>
                    </div>
                    {user.is_verified ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Active</span>
                    ) : (
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Pending</span>
                    )}
                  </div>

                  {/* Admin Status */}
                  {user.is_admin && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-700">Admin Access</span>
                      </div>
                      <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Admin</span>
                    </div>
                  )}

                  {/* Auth Provider */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-700">Sign-in Method</span>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full capitalize">
                      {user.auth_provider || 'Email'}
                    </span>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-700">Member Since</span>
                    </div>
                    <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                      {new Date(user.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base sm:text-lg">
                  <Lock className="w-5 h-5 text-gray-600" />
                  Security
                </h3>

                {user.auth_provider === 'google' ? (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-700 font-medium">
                      You signed in with Google. Password management is handled by your Google account.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      Update your password to keep your account secure
                    </p>
                    
                    <Link
                      href="/forgot-password"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-sm"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </Link>
                  </>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 text-white">
                <h3 className="font-bold mb-4 text-base sm:text-lg">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/orders"
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all font-semibold shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5" />
                      <span className="text-sm sm:text-base">My Orders</span>
                    </div>
                    <span className="text-xl">→</span>
                  </Link>
                  
                  <Link
                    href="/products"
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all font-semibold shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5" />
                      <span className="text-sm sm:text-base">Continue Shopping</span>
                    </div>
                    <span className="text-xl">→</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-red-500/90 hover:bg-red-600 rounded-xl transition-all font-semibold shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm sm:text-base">Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}