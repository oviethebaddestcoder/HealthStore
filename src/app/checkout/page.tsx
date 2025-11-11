'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, MapPin, CreditCard, ShoppingCart, Truck, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/src/stores/cartStore'
import { useAuthStore } from '@/src/stores/authStore'
import { useCreateOrder } from '@/src/hooks/useOrders'
import { formatCurrency } from '@/src/lib/utils'
import { nigerianStates, calculateDeliveryFee } from '@/src/lib/utils/states'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import { CheckoutFormData } from '@/src/types'

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>


export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const createOrderMutation = useCreateOrder()

  const [formData, setFormData] = useState<CheckoutFormData>({
    state: '',
    city: '',
    address: '',
    phone: '',
    discountCode: '',
  })
  
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const subtotal = getCartTotal()
  const deliveryFee = formData.state ? calculateDeliveryFee(formData.state) : 0
  const total = subtotal + deliveryFee

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout')
      return
    }
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [isAuthenticated, items, router])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required'
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else {
      const phoneRegex = /^(\+234|0)[789]\d{9}$/
      const cleanPhone = formData.phone.replace(/\s/g, '')
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Enter a valid Nigerian phone number'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  if (!user) {
    alert('User not found. Please log in again.')
    return
  }

  setProcessing(true)

  try {
    const orderResponse = await createOrderMutation.mutateAsync({
      address: {
        street: formData.address,
   
      },
      phone: formData.phone,
      discount_code: formData.discountCode || undefined,
      email: user.email,
      state: formData.state, // Keep this if still required
      city: formData.city,
      payment_method: 'credit_card',
      items: []
    })

    clearCart()
    window.location.href = orderResponse.payment.authorization_url

  } catch (error: any) {
    console.error('Checkout error:', error)
    const errorMessage = error?.response?.data?.error || 'Failed to process order. Please try again.'
    alert(errorMessage)
    
    if (errorMessage.includes('stock')) {
      router.push('/cart')
    }
  } finally {
    setProcessing(false)
  }
}

  const handleInputChange = (field: keyof CheckoutFormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white py-16">
          <div className="container mx-auto px-4 max-w-md text-center">
            <div className="bg-gray-50 rounded-lg p-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6">Add some items to proceed with checkout</p>
              <button 
                onClick={() => router.push('/products')}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user?.full_name || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div id="phone">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="08012345678"
                    className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <div id="state">
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select state</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-1">{errors.state}</p>
                    )}
                  </div>

                  <div id="city">
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter your city"
                      className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div id="address">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="House number, street, landmark"
                      rows={3}
                      className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code</label>
                    <input
                      type="text"
                      value={formData.discountCode}
                      onChange={(e) => handleInputChange('discountCode', e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800 mb-1">Delivery Information</p>
                    <p className="text-green-700">Lagos: ₦3,500 • Nearby: ₦5,000 • Others: ₦6,000</p>
                    <p className="text-green-700">2-5 business days delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:pl-8">
              <div className="border border-gray-200 rounded-lg p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 py-2 border-b border-gray-100">
                      <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                        {item.products?.image_url && (
                          <img 
                            src={item.products.image_url} 
                            alt={item.products.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {item.products?.name}
                        </p>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₦{((item.products?.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">
                      {formData.state ? `₦${deliveryFee.toLocaleString()}` : '—'}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleSubmit}
                  disabled={processing || !formData.state}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay Now
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">Secure payment powered by Paystack</p>
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