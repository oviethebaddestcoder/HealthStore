'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, ShoppingBag, MapPin, CreditCard, Calendar, AlertCircle, RefreshCw, Package, Truck, CheckCircle2, Clock, Phone, Mail, ChevronLeft, Download } from 'lucide-react'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import { formatCurrency } from '@/src/lib/utils'
import { ordersApi } from '@/src/lib/api/orders'
import { useAuthStore } from '@/src/stores/authStore'
import Link from 'next/link'
import Image from 'next/image'

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

  const getStatusColor = (status: string) => {
    const colors: any = {
      success: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'processing':
        return <Package className="w-5 h-5" />
      case 'shipped':
        return <Truck className="w-5 h-5" />
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-emerald-50 px-4">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
              <Package className="w-8 h-8 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-600 font-medium">Loading order details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-emerald-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || 'This order does not exist or you may not have permission to view it.'}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/orders')}
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
              >
                Back to Orders
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const showRetryPayment = order.payment_status !== 'success' && order.payment_status !== 'processing'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Back Button */}
          <button
            onClick={() => router.push('/orders')}
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Orders</span>
          </button>

          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border-2 border-emerald-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-3 rounded-xl">
                    {getOrderStatusIcon(order.order_status)}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
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
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${getStatusColor(order.payment_status)} flex items-center gap-2`}>
                  <CreditCard className="w-4 h-4" />
                  {order.payment_status}
                </span>
                <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${getStatusColor(order.order_status)} flex items-center gap-2`}>
                  {getOrderStatusIcon(order.order_status)}
                  {order.order_status}
                </span>
              </div>
            </div>
          </div>

          {/* Retry Payment Alert */}
          {showRetryPayment && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-900 mb-2 text-lg">Payment Incomplete</h3>
                  <p className="text-yellow-800 text-sm mb-4">
                    Your order payment was not completed. Please retry to complete your purchase and we'll process your order immediately.
                  </p>
                  {retryError && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4">
                      <p className="text-red-700 text-sm font-medium">{retryError}</p>
                    </div>
                  )}
                  <button
                    onClick={handleRetryPayment}
                    disabled={retryingPayment}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {retryingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        <span>Complete Payment Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                  Order Items
                </h2>
                
                <div className="space-y-4">
                  {order.order_items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:shadow-md transition">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.product_name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        ) : (
                          <Package className="w-10 h-10 text-emerald-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1">{item.product_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {formatCurrency(item.price)} × {item.quantity}
                          </span>
                          <span className="font-bold text-emerald-600 text-lg">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Delivery Fee</span>
                    <span className={`font-semibold ${order.delivery_fee === 0 ? 'text-emerald-600' : ''}`}>
                      {order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}
                    </span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span className="font-medium">Discount</span>
                      <span className="font-semibold">-{formatCurrency(order.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold border-t-2 pt-3">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  Delivery Address
                </h3>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 space-y-2">
                  <p className="font-bold text-gray-900">
                    {order.shipping_address?.full_name || order.full_name || user?.full_name || 'N/A'}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {(() => {
                      const address = order.shipping_address?.address || order.address
                      if (!address || address === 'N/A') return 'N/A'
                      
                      // If address is a JSON string, parse it
                      if (typeof address === 'string' && address.startsWith('{')) {
                        try {
                          const parsed = JSON.parse(address)
                          return parsed.street || address
                        } catch {
                          return address
                        }
                      }
                      
                      // If address is already an object
                      if (typeof address === 'object' && address.street) {
                        return address.street
                      }
                      
                      return address
                    })()}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {order.city || 'N/A'}, {order.state || 'N/A'}
                  </p>
                  {order.phone && (
                    <div className="pt-2 border-t border-emerald-200 mt-3">
                      <p className="text-gray-700 text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        {order.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  Payment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm font-medium">Reference</span>
                    <span className="font-mono text-xs text-gray-900 bg-white px-2 py-1 rounded">
                      {order.payment_reference ? order.payment_reference.slice(-10) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm font-medium">Method</span>
                    <span className="font-semibold text-gray-900">Paystack</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm font-medium">Status</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-100">
                <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  {showRetryPayment && (
                    <button
                      onClick={handleRetryPayment}
                      disabled={retryingPayment}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {retryingPayment ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5" />
                          <span>Retry Payment</span>
                        </>
                      )}
                    </button>
                  )}
                  <Link
                    href="/contact"
                    className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-bold hover:shadow-lg transition"
                  >
                    Contact Support
                  </Link>
                  <Link
                    href="/products"
                    className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}