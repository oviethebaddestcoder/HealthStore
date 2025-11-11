'use client'

import { useState, useMemo } from 'react'
import { Loader2, ShoppingBag, Search } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import { formatCurrency } from '@/src/lib/utils'
import { useOrders } from '@/src/hooks/useOrders'

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useOrders(1, 50) // fetch more for search/filter
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredOrders = useMemo(() => {
    if (!ordersData?.orders) return []
    return ordersData.orders.filter((order: any) => {
      const matchesSearch =
        order.id.includes(search) ||
        order.order_items.some((item: any) =>
          item.product_name.toLowerCase().includes(search.toLowerCase())
        )
      const matchesStatus =
        statusFilter === 'all' || order.payment_status === statusFilter || order.order_status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [ordersData, search, statusFilter])

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </>
    )
  }

  if (!ordersData?.orders || ordersData.orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary mb-8">My Orders</h1>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center bg-white rounded-xl shadow px-4 py-2 flex-1">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by Order ID or Product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-none focus:ring-0 outline-none text-gray-700"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white rounded-xl shadow px-4 py-2 text-gray-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="success">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 && (
              <p className="text-center text-gray-500">No orders match your search/filter</p>
            )}

            {filteredOrders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.payment_status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : order.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      Payment: {order.payment_status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.order_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.order_status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.order_status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2 mb-4">
                    {order.order_items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product_name} x{item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Fee ({order.state})</span>
                      <span>{order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Delivery Address:</span>{' '}
                      {order.address}, {order.city}, {order.state}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    
    </>
  )
}
