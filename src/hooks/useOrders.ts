import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ordersApi, CreateOrderData } from '../lib/api/orders'

/**
 * Fetch paginated list of orders.
 * Automatically refetches when user changes or pagination changes.
 */
export const useOrders = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['orders', page, limit],
    queryFn: async () => {
      const res = await ordersApi.getOrders(page, limit)
      return res
    },
    staleTime: 1000 * 60 * 2, // ✅ Cache for 2 minutes
    retry: false, // ✅ Prevent auto-retries on 401
  })
}

/**
 * Fetch a single order by ID.
 */
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await ordersApi.getOrder(id)
      return res
    },
    enabled: !!id, // ✅ Only fetch if ID exists
    retry: false,
  })
}

/**
 * Create a new order.
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const res = await ordersApi.createOrder(data)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('✅ Order created successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.message ||
        '❌ Failed to create order'
      toast.error(message)
    },
  })
}
