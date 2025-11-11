import apiClient from './client'

export interface InitializePaymentData {
  order_id: string
  email: string
  amount: number
}

export const paymentApi = {
  initializePayment: async (data: InitializePaymentData) => {
    const response = await apiClient.post('/payment/initialize', data)
    return response.data
  },

  verifyPayment: async (reference: string) => {
    const response = await apiClient.get(`/payment/verify/${reference}`)
    return response.data
  },
}
