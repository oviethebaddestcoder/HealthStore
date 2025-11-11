'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, ShoppingBag, MapPin, CreditCard, Calendar, AlertCircle, RefreshCw } from 'lucide-react'
import Navbar from '@/src/components/layout/Navbar'
import { formatCurrency } from '@/src/lib/utils'
import { ordersApi } from '@/src/lib/api/orders'
import { useAuthStore } from '@/src/stores/authStore'
import Link from 'next/link'

export default function OrderDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryingPayment, setRetryingPayment] = useState(false)
  const [retryError, setRetryError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = Array.isArray(id) ? id[0] : id
        const data = await ordersApi.getOrder(orderId)
        setOrder(data)
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch order')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchOrder()
  }, [id])

  const handleRetryPayment = async () => {
    if (!user?.email) {
      setRetryError('User email not found')
      return
    }

    setRetryingPayment(true)
    setRetryError('')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/retry-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: user.email })
      })

      const data = await response.json()

      if (response.ok && data.payment?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.payment.authorization_url
      } else {
        setRetryError(data.error || 'Failed to initialize payment')
      }
    } catch (err: any) {
      setRetryError(err?.message || 'Failed to retry payment')
    } finally {
      setRetryingPayment(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <ShoppingBag className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">Order Not Found</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            {error || 'This order does not exist or you may not have permission to view it.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/orders')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition text-sm md:text-base"
            >
              Back to Orders
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition text-sm md:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    )
  }

  // Determine if retry payment should be shown
  const showRetryPayment = order.payment_status !== 'success' && order.payment_status !== 'processing'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="container mx-auto px-3 md:px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 px-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/orders" className="hover:text-primary">My Orders</Link>
            <span>/</span>
            <span className="text-gray-900 truncate">Order #{order.id.slice(-8)}</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-2">
            <h1 className="text-2xl md:text-4xl font-bold text-primary mb-4 md:mb-0">
              Order Details
            </h1>
            
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                order.payment_status === 'success'
                  ? 'bg-green-100 text-green-800'
                  : order.payment_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                Payment: {order.payment_status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                order.order_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : order.order_status === 'shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : order.order_status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {order.order_status}
              </span>
            </div>
          </div>

          {/* Retry Payment Alert */}
          {showRetryPayment && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 mx-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1 text-sm md:text-base">Payment Incomplete</h3>
                  <p className="text-yellow-700 text-xs md:text-sm mb-3">
                    Your order payment was not completed. Please retry to complete your purchase.
                  </p>
                  {retryError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
                      <p className="text-red-700 text-xs md:text-sm">{retryError}</p>
                    </div>
                  )}
                  <button
                    onClick={handleRetryPayment}
                    disabled={retryingPayment}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {retryingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Retry Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Order Summary - Main Column */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Order Info Card */}
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Order Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs md:text-sm">Order ID</p>
                    <p className="font-mono text-gray-800 text-sm md:text-base truncate">{order.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs md:text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Order Date
                    </p>
                    <p className="text-gray-800 text-sm md:text-base">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-4 md:mt-6 border-t pt-4 md:pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Order Items</h3>
                  <div className="space-y-3">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm md:text-base truncate">
                            {item.product_name}
                          </p>
                          <p className="text-gray-600 text-xs md:text-sm">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-sm md:text-base whitespace-nowrap ml-2">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="mt-4 md:mt-6 border-t pt-4 md:pt-6 space-y-2">
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className={order.delivery_fee === 0 ? 'text-green-600 font-semibold' : ''}>
                      {order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg md:text-xl font-bold border-t pt-2 md:pt-3">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Shipping & Payment Info */}
            <div className="space-y-4 md:space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm md:text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                  Shipping Address
                </h3>
                <div className="text-xs md:text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-800 text-sm md:text-base">
                    {order.shipping_address?.full_name || order.full_name || 'N/A'}
                  </p>
                  <p className="break-words">
                    {order.shipping_address?.address || order.address || 'N/A'}
                  </p>
                  <p>
                    {order.shipping_address?.city || order.city || 'N/A'}, {order.shipping_address?.state || order.state || 'N/A'}
                  </p>
                  {(order.shipping_address?.phone || order.phone) && (
                    <p className="mt-2">
                      Phone: {order.shipping_address?.phone || order.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm md:text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                  Payment Information
                </h3>
                <div className="text-xs md:text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span className="font-mono text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                      {order.payment_reference || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span>Paystack</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.payment_status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : order.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Order Actions</h3>
                <div className="space-y-2">
                  {showRetryPayment && (
                    <button
                      onClick={handleRetryPayment}
                      disabled={retryingPayment}
                      className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {retryingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Retry Payment</span>
                        </>
                      )}
                    </button>
                  )}
                  <Link
                    href="/orders"
                    className="block w-full text-center bg-gray-100 text-gray-800 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition text-sm md:text-base"
                  >
                    Back to Orders
                  </Link>
                  <button
                    onClick={() => router.push('/contact')}
                    className="block w-full text-center bg-primary text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-dark transition text-sm md:text-base"
                  >
                    Contact Support
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