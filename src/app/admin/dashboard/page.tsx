'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Package, Users, ShoppingCart, DollarSign, Loader2, AlertCircle, TrendingUp, Clock, LogOut, Leaf } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/src/stores/authStore'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/src/lib/api'
import { formatCurrency } from '@/src/lib/utils'

export default function AdminDashboard() {
  const { user, isAuthenticated, initialized, signOut } = useAuthStore()
  const router = useRouter()

  // ✅ Enhanced RBAC Protection
  useEffect(() => {
    // Wait for auth to initialize
    if (!initialized) return

    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    // Redirect if not admin
    if (!user.is_admin) {
      router.push('/products')
      return
    }
  }, [isAuthenticated, user, initialized, router])

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(),
    enabled: !!user?.is_admin, // Only fetch if user is admin
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  // Show loading during auth initialization
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authorized
  if (!isAuthenticated || !user?.is_admin) {
    return null
  }

  // Show loading while fetching dashboard data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-6">There was an error loading the dashboard data.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Simple Admin Header with Logout */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gray-900">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-tight">
                  Admin Panel
                </span>
                <span className="text-xs text-gray-600 leading-tight -mt-1">
                  HealthExcellence Management
                </span>
              </div>
            </Link>

            {/* Admin Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600">
                  Welcome back, <span className="font-semibold text-emerald-600">{user.full_name}</span>
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/products"
                className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Package className="w-5 h-5" />
                Manage Products
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" />
                View Orders
              </Link>
           
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Total Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                  <div className="flex items-center text-green-600 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>This month</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Total Orders</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {stats?.totalOrders || 0}
                  </p>
                  <div className="flex items-center text-blue-600 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{stats?.pendingOrders || 0} pending</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Products */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Total Products</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {stats?.totalProducts || 0}
                  </p>
                  <div className="text-purple-600 text-xs">
                    <span>In catalog</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {stats?.totalUsers || 0}
                  </p>
                  <div className="text-orange-600 text-xs">
                    <span>Registered customers</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Pending Orders Alert */}
          {stats?.pendingOrders > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 mb-8 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-yellow-200 rounded-full">
                    <AlertCircle className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 mb-1">
                      Pending Orders Require Attention
                    </h3>
                    <p className="text-yellow-800">
                      You have <span className="font-bold">{stats.pendingOrders}</span> pending order
                      {stats.pendingOrders > 1 ? 's' : ''} waiting to be processed
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/orders"
                  className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  View Orders →
                </Link>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/admin/products"
                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 text-center transform hover:scale-105"
              >
                <div className="p-4 bg-yellow-500 rounded-full inline-block mb-4 group-hover:bg-yellow-600 transition-colors">
                  <Package className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-emerald-700">
                  Manage Products
                </h3>
                <p className="text-sm text-gray-600">
                  Add, edit or delete products from your catalog
                </p>
              </Link>

              <Link
                href="/admin/orders"
                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center transform hover:scale-105"
              >
                <div className="p-4 bg-blue-100 rounded-full inline-block mb-4 group-hover:bg-blue-200 transition-colors">
                  <ShoppingCart className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-700">
                  View Orders
                </h3>
                <p className="text-sm text-gray-600">
                  Process and track customer orders
                </p>
              </Link>

            </div>
          </div>
        </div>
      </main>
    </>
  )
}