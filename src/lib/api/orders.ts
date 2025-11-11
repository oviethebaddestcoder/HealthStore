import apiClient from './client'

export interface CreateOrderData {
  state: string
  city: string
  email: string

  discount_code?: string
  phone: string
  address: {
    street: string
    
  }
  payment_method: 'credit_card' | 'paypal' | 'cash_on_delivery'
  items: Array<{
    product_id: string
    quantity: number
  }>
}

export const ordersApi = {
  createOrder: async (data: CreateOrderData) => {
    const response = await apiClient.post('/orders/create', data)
    return response.data
  },

  getOrders: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get(`/orders?page=${page}&limit=${limit}`)
    return response.data
  },

  getOrder: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`)
    return response.data.order
  },
}
