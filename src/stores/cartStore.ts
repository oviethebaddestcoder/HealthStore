import { create } from 'zustand'
import { cartApi } from '../lib/api/cart'
import { CartItem } from '../types'
import toast from 'react-hot-toast'

interface CartState {
  items: CartItem[]
  loading: boolean
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    try {
      set({ loading: true })
      const cart = await cartApi.getCart()
      set({ items: cart, loading: false })
    } catch (error: any) {
      set({ loading: false })
      console.error('Fetch cart error:', error)
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      await cartApi.addToCart(productId, quantity)
      await get().fetchCart()
      toast.success('Added to cart!')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to add to cart'
      toast.error(message)
      throw error
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    try {
      if (quantity === 0) {
        await get().removeItem(cartItemId)
        return
      }
      
      await cartApi.updateCartItem(cartItemId, quantity)
      
      set((state) => ({
        items: state.items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        ),
      }))
      
      toast.success('Cart updated')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update cart'
      toast.error(message)
      throw error
    }
  },

  removeItem: async (cartItemId) => {
    try {
      await cartApi.removeFromCart(cartItemId)
      set((state) => ({
        items: state.items.filter((item) => item.id !== cartItemId),
      }))
      toast.success('Item removed')
    } catch (error: any) {
      toast.error('Failed to remove item')
      throw error
    }
  },

  clearCart: async () => {
    try {
      await cartApi.clearCart()
      set({ items: [] })
    } catch (error) {
      console.error('Clear cart error:', error)
    }
  },

  getCartTotal: () => {
    return get().items.reduce((total, item) => {
      return total + (item.products?.price || 0) * item.quantity
    }, 0)
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0)
  },
}))
