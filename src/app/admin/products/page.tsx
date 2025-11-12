'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Package, Plus, Edit, Trash2, Loader2, AlertCircle, 
  LogOut, Leaf, Search, X, Upload, ImageIcon, ArrowLeft,
  CheckCircle, XCircle
} from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/src/stores/authStore'
import { useRouter } from 'next/navigation'
import { adminApi, productsApi } from '@/src/lib/api'
import Image from 'next/image'

// Toast Component
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 duration-300">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-2 ${
        type === 'success' 
          ? 'bg-white border-emerald-200' 
          : 'bg-white border-red-200'
      }`}>
        <div className={`p-2 rounded-full ${
          type === 'success' ? 'bg-emerald-100' : 'bg-red-100'
        }`}>
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div>
          <p className={`font-semibold ${
            type === 'success' ? 'text-emerald-900' : 'text-red-900'
          }`}>
            {type === 'success' ? 'Success!' : 'Error'}
          </p>
          <p className={`text-sm ${
            type === 'success' ? 'text-emerald-700' : 'text-red-700'
          }`}>
            {message}
          </p>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const { user, isAuthenticated, initialized, signOut } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    info: '',
    benefits: '',
    direction: '',
    precaution: '',
    category_id: '',
    price: '',
    stock: ''
  })

  // Hardcoded categories from database
  const categories = [
    { id: '0223cd97-3a4e-4e05-94b1-0eb7cbb3ac05', name: 'Weight Loss' },
    { id: '1db536a0-ab7c-411c-bcc6-a2d1efdd47e2', name: 'Body Range' },
    { id: '6071fda1-37b7-4ae1-ba35-7443570ff5dc', name: 'Immune Booster' },
    { id: '67aad94d-ad3b-46df-934a-9b492ed4964a', name: 'High Blood Pressure' },
    { id: '7ffbbb9a-a450-4dd4-a4c3-5a0a5ff145fc', name: 'Tea Range' },
    { id: 'a36c1466-ed5b-4fc9-867f-c196092df867', name: 'Female Fertility' },
    { id: 'e7145a07-00f8-4e78-8906-da5a166561c8', name: 'Skin Problem' },
    { id: 'f8351765-5e42-4f74-9a11-539381c22cdb', name: 'Diabetes' }
  ]

  // RBAC Protection
  useEffect(() => {
    if (!initialized) return
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }
    if (!user.is_admin) {
      router.push('/products')
      return
    }
  }, [isAuthenticated, user, initialized, router])

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts(),
    enabled: !!user?.is_admin,
  })

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => adminApi.createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      handleCloseModal()
      setToast({ message: 'Product created successfully!', type: 'success' })
    },
    onError: (error: any) => {
      setToast({ 
        message: error.response?.data?.error || 'Failed to create product', 
        type: 'error' 
      })
    }
  })

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string, formData: FormData }) => 
      adminApi.updateProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      handleCloseModal()
      setToast({ message: 'Product updated successfully!', type: 'success' })
    },
    onError: (error: any) => {
      setToast({ 
        message: error.response?.data?.error || 'Failed to update product', 
        type: 'error' 
      })
    }
  })

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      setToast({ message: 'Product deleted successfully!', type: 'success' })
    },
    onError: (error: any) => {
      setToast({ 
        message: error.response?.data?.error || 'Failed to delete product', 
        type: 'error' 
      })
    }
  })

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        info: product.info || '',
        benefits: product.benefits || '',
        direction: product.direction || '',
        precaution: product.precaution || '',
        category_id: product.category_id,
        price: product.price.toString(),
        stock: product.stock.toString()
      })
      // Set existing image as preview
      setImagePreview(product.image_url || '')
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        info: '',
        benefits: '',
        direction: '',
        precaution: '',
        category_id: '',
        price: '',
        stock: ''
      })
      setImagePreview('')
    }
    setImageFile(null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setImageFile(null)
    setImagePreview('')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitFormData = new FormData()
    submitFormData.append('name', formData.name)
    submitFormData.append('info', formData.info)
    submitFormData.append('benefits', formData.benefits)
    submitFormData.append('direction', formData.direction)
    submitFormData.append('precaution', formData.precaution)
    submitFormData.append('category_id', formData.category_id)
    submitFormData.append('price', formData.price)
    submitFormData.append('stock', formData.stock)
    
    if (imageFile) {
      submitFormData.append('image', imageFile)
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, formData: submitFormData })
    } else {
      createMutation.mutate(submitFormData)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteMutation.mutate(id)
    }
  }

  const filteredProducts = productsData?.products?.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (!initialized || !isAuthenticated || !user?.is_admin) return null

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Admin Header */}
      <header className="bg-white shadow-lg border-b-2 border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-tight">Admin Panel</span>
                <span className="text-xs text-gray-500 leading-tight -mt-0.5">Products Management</span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-6 lg:py-10">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          {/* Back Button & Header */}
          <div className="mb-8">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Products Management
                </h1>
                <p className="text-gray-600">
                  Manage your product catalog • <span className="font-semibold text-emerald-600">{filteredProducts.length}</span> products
                </p>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add New Product
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm hover:shadow-md text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product: any) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200">
                <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-20 h-20 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      product.stock > 0 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                        : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {product.info || 'No description available'}
                  </p>
                  
                  <div className="flex items-baseline justify-between mb-5 pb-5 border-b border-gray-100">
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                        ₦{parseFloat(product.price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Category: {categories.find(c => c.id === product.category_id)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first product'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add Product
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-100 px-8 py-6 flex justify-between items-center rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingProduct ? 'Update product information' : 'Fill in the details below'}
                </p>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Product Image</label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {imagePreview && (
                    <div className="relative w-full sm:w-40 h-40 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <label className="flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group">
                    <Upload className="w-10 h-10 text-gray-400 mb-3 group-hover:text-emerald-600 transition-colors" />
                    <span className="text-sm font-semibold text-gray-700 mb-1">Click to upload image</span>
                    <span className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Info</label>
                  <textarea
                    rows={3}
                    value={formData.info}
                    onChange={(e) => setFormData({ ...formData, info: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                    placeholder="Brief description of the product"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Benefits</label>
                  <textarea
                    rows={3}
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                    placeholder="List product benefits"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Directions</label>
                  <textarea
                    rows={3}
                    value={formData.direction}
                    onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                    placeholder="How to use the product"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Precautions</label>
                  <textarea
                    rows={3}
                    value={formData.precaution}
                    onChange={(e) => setFormData({ ...formData, precaution: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                    placeholder="Safety precautions and warnings"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1  text-black px-6 py-3.5 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                > 
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {editingProduct ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    editingProduct ? 'Update Product' : 'Create Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}