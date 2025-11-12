export interface Product {
  id: string
  name: string
  info: string
  benefits: string
  direction: string
  precaution: string
  category_id: string
  price: number
  stock: number
  image_url: string
  created_at: string
  categories?: Category
}

export interface Category {
  id: string
  name: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  products?: Product
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  user_id: string
  order_items: OrderItem[]
  subtotal: number
  delivery_fee: number
  discount_code?: string
  total: number
  state: string
  city: string
  payment_status: 'pending' | 'success' | 'failed'
  payment_reference: string
  order_status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
}

export interface User {
  auth_provider: string
  id: string
  email: string
  full_name: string
  phone: string
  is_admin: boolean
  is_verified: boolean
  address?: {
    state: string
    city: string
    address_line: string
  }
  created_at: string
}

export interface Discount {
  id: string
  code: string
  percentage: number
  valid_until: string
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalUsers: number
  pendingOrders: number
}


export interface CheckoutFormData {
  state: string
  city: string
  address: string
  phone: string
  discountCode: string
}

export interface FormErrors {
  state?: string
  city?: string
  address?: string
  phone?: string
}