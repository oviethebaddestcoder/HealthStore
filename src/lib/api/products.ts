import apiClient from './client'

export interface ProductFilters {
  category?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const productsApi = {
  getProducts: async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams()
    
    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

    const response = await apiClient.get(`/products?${params.toString()}`)
    return response.data
  },

  getProduct: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`)
    return response.data.product
  },

  getCategories: async () => {
    const response = await apiClient.get('/products/categories/all')
    return response.data.categories
  },
}
