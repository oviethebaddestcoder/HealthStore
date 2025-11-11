import apiClient from './client'

export const cartApi = {
  getCart: async () => {
    const response = await apiClient.get('/cart')
    return response.data.cart
  },

  addToCart: async (product_id: string, quantity: number = 1) => {
    const response = await apiClient.post('/cart/add', { product_id, quantity })
    return response.data
  },

  updateCartItem: async (id: string, quantity: number) => {
    const response = await apiClient.put(`/cart/update/${id}`, { quantity })
    return response.data
  },

  removeFromCart: async (id: string) => {
    const response = await apiClient.delete(`/cart/remove/${id}`)
    return response.data
  },

  clearCart: async () => {
    const response = await apiClient.delete('/cart/clear')
    return response.data
  },
}
