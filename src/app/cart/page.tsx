
// CartPage.tsx
'use client'

import { useEffect } from 'react'
import { Trash2, Plus, Minus, ShoppingBag, Loader2, ArrowLeft, Leaf, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/src/stores/cartStore'
import { useAuthStore } from '@/src/stores/authStore'

import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import { useRouter } from 'next/navigation'


export default function CartPage() {
  const { items, loading, fetchCart, updateQuantity, removeItem, getCartTotal, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchCart()
  }, [isAuthenticated])

  const total = getCartTotal()
  const shippingFee = total >= 5000 ? 0 : 1500
  const finalTotal = total + shippingFee

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your cart...</p>
          </div>
        </div>
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50 py-16">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-16 h-16 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 text-lg">Discover our amazing health products and start shopping!</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-emerald-600" />
                <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
              </div>
              {items.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      clearCart()
                    }
                  }}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  <X className="w-4 h-4" />
                  Clear Cart
                </button>
              )}
            </div>
            <p className="text-gray-600">Review your items and proceed to checkout</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl overflow-hidden flex-shrink-0">
                      {item.products?.image_url ? (
                        <Image
                          src={item.products.image_url}
                          alt={item.products.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-emerald-300" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-4">
                          <Link 
                            href={`/products/${item.products?.id}`}
                            className="font-bold text-lg text-gray-900 hover:text-emerald-600 transition-colors line-clamp-2"
                          >
                            {item.products?.name}
                          </Link>
                          <p className="text-emerald-600 text-sm font-semibold mt-1">
                            {item.products?.categories?.name}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-bold text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.products?.stock || 0)}
                            className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            ₦{(item.products?.price || 0).toLocaleString()} each
                          </p>
                          <p className="text-xl font-bold text-emerald-600">
                            ₦{((item.products?.price || 0) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {item.quantity >= (item.products?.stock || 0) && (
                        <p className="text-xs text-orange-600 mt-2 font-medium">
                          Maximum available quantity reached
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border-2 border-emerald-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span className="font-semibold">₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      <span className="font-semibold">₦{shippingFee.toLocaleString()}</span>
                    )}
                  </div>
                  {total >= 5000 ? (
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <p className="text-emerald-700 text-sm font-semibold flex items-center gap-2">
                        🎉 You've qualified for free shipping!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <p className="text-orange-700 text-sm font-semibold">
                        Add ₦{(5000 - total).toLocaleString()} more for free shipping
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-emerald-600">₦{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-white text-center py-4 rounded-xl font-bold text-lg mb-4 transition-all shadow-lg hover:shadow-xl"
                  style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 w-full text-center text-emerald-600 py-3 font-semibold hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}