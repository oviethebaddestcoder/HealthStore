// src/lib/api/admin.ts

import apiClient from './client'

export const adminApi = {
  // Dashboard
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard')
    return response.data.stats
  },

  // Create product with image - FIXED for FormData
  createProduct: async (formData: FormData) => {
    console.log('API: Creating product with FormData...')
    console.log('API: FormData object ready with image and product details')

    const response = await apiClient.post('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    console.log('API: Product created successfully', response.data)
    return response.data
  },

  // Update product with image - FIXED for FormData
  updateProduct: async (id: string, formData: FormData) => {
    console.log(`API: Updating product ${id} with FormData...`)
    
    // Log FormData contents (TypeScript safe)
    const entries = Array.from(formData.entries())
    entries.forEach(([key, value]) => {
      console.log(`API FormData - ${key}:`, value instanceof File ? `${value.name} (${value.type}, ${value.size} bytes)` : value)
    })

    const response = await apiClient.put(`/admin/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    console.log('API: Product updated successfully', response.data)
    return response.data
  },

  // Delete product
  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/admin/products/${id}`)
    return response.data
  },

  // Orders
  getAdminOrders: async (page: number = 1, limit: number = 20, status?: string) => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString() 
    })
    if (status) params.append('status', status)
    
    const response = await apiClient.get(`/admin/orders?${params.toString()}`)
    return response.data
  },

  updateOrderStatus: async (id: string, order_status: string) => {
    const response = await apiClient.put(`/admin/orders/${id}/status`, { order_status })
    return response.data
  },
}