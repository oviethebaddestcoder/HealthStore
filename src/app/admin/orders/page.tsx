'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  ShoppingCart, Loader2, LogOut, Leaf, ChevronLeft, ChevronRight,
  Package, Clock, CheckCircle, XCircle, Truck, Eye, ArrowLeft, Filter, X
} from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/src/stores/authStore'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/src/lib/api'

function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
      <div className={`pointer-events-auto animate-in zoom-in-95 duration-300 ${
        type === 'success' 
          ? 'bg-white border-2 border-emerald-500 shadow-2xl' 
          : 'bg-white border-2 border-red-500 shadow-2xl'
      } rounded-2xl p-6 max-w-md mx-4`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full flex-shrink-0 ${
            type === 'success' ? 'bg-emerald-100' : 'bg-red-100'
          }`}>
            {type === 'success' ? (
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <p className={`font-bold text-lg mb-1 ${
              type === 'success' ? 'text-emerald-900' : 'text-red-900'
            }`}>
              {type === 'success' ? 'Success!' : 'Error'}
            </p>
            <p className={`text-sm ${
              type === 'success' ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {message}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminOrders() {
  const { user, isAuthenticated, initialized, signOut } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  
  const limit = 20

  useEffect(() => {
    if (!initialized) return
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }
    if (!user.is_admin) {
      router.push('/products')
      return
    }
  }, [isAuthenticated, user, initialized, router])

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', currentPage, statusFilter],
    queryFn: () => adminApi.getAdminOrders(currentPage, limit, statusFilter),
    enabled: !!user?.is_admin,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      setToast({ message: 'Order status updated successfully!', type: 'success' })
      setShowModal(false)
    },
    onError: (error: any) => {
      setToast({ 
        message: error.response?.data?.error || 'Failed to update order status', 
        type: 'error' 
      })
    }
  })

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleUpdateStatus = (newStatus: string) => {
    if (selectedOrder && confirm(`Change order status to "${newStatus}"?`)) {
      updateStatusMutation.mutate({ id: selectedOrder.id, status: newStatus })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-600" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Package className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!initialized || !isAuthenticated || !user?.is_admin) return null

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    )
  }

  const orders = ordersData?.orders || []
  const pagination = ordersData?.pagination || {}

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Admin Header */}
      <header className="bg-white shadow-lg border-b-2 border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-lg group-hover:shadow-xl transition-all">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-tight">Admin Panel</span>
                <span className="text-xs text-gray-500 leading-tight -mt-0.5">Orders Management</span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 lg:py-10">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 group font-medium"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Orders Management</h1>
            <p className="text-gray-600">
              View and manage customer orders • <span className="font-semibold text-emerald-600">{pagination.total || 0}</span> total orders
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="mb-4 lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters */}
          <div className={`bg-white rounded-2xl shadow-lg p-4 lg:p-6 mb-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <label className="block text-sm font-bold text-gray-700 mb-3 lg:mb-0 lg:inline-block lg:mr-4">Filter by Status:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 lg:gap-3">
              <button
                onClick={() => { setStatusFilter(''); setShowFilters(false); }}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                  statusFilter === '' 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => { setStatusFilter('pending'); setShowFilters(false); }}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                  statusFilter === 'pending' 
                    ? 'bg-yellow-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => { setStatusFilter('shipped'); setShowFilters(false); }}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                  statusFilter === 'shipped' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => { setStatusFilter('delivered'); setShowFilters(false); }}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                  statusFilter === 'delivered' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => { setStatusFilter('cancelled'); setShowFilters(false); }}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all text-sm col-span-2 sm:col-span-1 ${
                  statusFilter === 'cancelled' 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-bold text-gray-900">#{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{order.users?.full_name}</p>
                          <p className="text-xs text-gray-500">{order.users?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-emerald-600">
                          ₦{parseFloat(order.total).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(order.order_status)}`}>
                          {getStatusIcon(order.order_status)}
                          <span className="capitalize">{order.order_status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all text-sm font-semibold shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {orders.length === 0 && (
              <div className="text-center py-16">
                <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold">No orders found</p>
                <p className="text-gray-500 text-sm mt-2">Orders will appear here once customers place them</p>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">ORDER ID</p>
                    <p className="text-sm font-mono font-bold text-gray-900">#{order.id.slice(0, 8)}</p>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(order.order_status)}`}>
                    {getStatusIcon(order.order_status)}
                    <span className="capitalize">{order.order_status}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">CUSTOMER</p>
                    <p className="text-sm font-bold text-gray-900">{order.users?.full_name}</p>
                    <p className="text-xs text-gray-600">{order.users?.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">TOTAL</p>
                      <p className="text-lg font-bold text-emerald-600">
                        ₦{parseFloat(order.total).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">PAYMENT</p>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">DATE</p>
                    <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewOrder(order)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold mb-2">No orders found</p>
                <p className="text-gray-500 text-sm">Orders will appear here once customers place them</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl bg-white border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl">
                <span className="text-sm font-semibold text-gray-700">
                  Page <span className="text-emerald-600">{currentPage}</span> of {pagination.totalPages}
                </span>
              </div>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className="p-3 rounded-xl bg-white border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl my-8 shadow-2xl">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 md:px-8 py-5 flex justify-between items-center rounded-t-3xl z-10">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Order Details</h2>
                <p className="text-sm text-gray-500 mt-1">Order ID: <span className="font-mono font-bold">#{selectedOrder.id.slice(0, 8)}</span></p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Customer Info */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 md:p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">NAME</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.users?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">EMAIL</p>
                    <p className="font-semibold text-gray-900 break-all">{selectedOrder.users?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">PHONE</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.phone || selectedOrder.users?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">LOCATION</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.city}, {selectedOrder.state}</p>
                  </div>
                  {selectedOrder.address && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-bold text-gray-500 mb-1">ADDRESS</p>
                      <p className="font-semibold text-gray-900">{selectedOrder.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-start bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 mb-1">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity} × ₦{parseFloat(item.price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <p className="font-bold text-emerald-600 text-lg ml-4">
                        ₦{(parseFloat(item.price) * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-emerald-50 rounded-2xl p-5 md:p-6 border-2 border-emerald-200">
                <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">₦{parseFloat(selectedOrder.subtotal).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Delivery Fee</span>
                    <span className="font-bold">₦{parseFloat(selectedOrder.delivery_fee).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {selectedOrder.discount_code && (
                    <div className="flex justify-between text-green-600">
                      <span className="font-medium">Discount ({selectedOrder.discount_code})</span>
                      <span className="font-bold">Applied</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl md:text-2xl font-bold text-gray-900 pt-3 border-t-2 border-emerald-300">
                    <span>Total</span>
                    <span className="text-emerald-600">₦{parseFloat(selectedOrder.total).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Update Order Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdateStatus('pending')}
                    disabled={selectedOrder.order_status === 'pending' || updateStatusMutation.isPending}
                    className="px-4 py-3.5 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  >
                    Mark as Pending
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('shipped')}
                    disabled={selectedOrder.order_status === 'shipped' || updateStatusMutation.isPending}
                    className="px-4 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  >
                    Mark as Shipped
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('delivered')}
                    disabled={selectedOrder.order_status === 'delivered' || updateStatusMutation.isPending}
                    className="px-4 py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  >
                    Mark as Delivered
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('cancelled')}
                    disabled={selectedOrder.order_status === 'cancelled' || updateStatusMutation.isPending}
                    className="px-4 py-3.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 px-6 md:px-8 py-5 rounded-b-3xl">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-6 py-3.5 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}