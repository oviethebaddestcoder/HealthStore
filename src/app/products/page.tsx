'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Search, ShoppingCart, Heart, Star, ChevronDown, Filter,
  Grid, List, ChevronLeft, ChevronRight, Loader2, X
} from 'lucide-react'

import toast from 'react-hot-toast'
import { productsApi } from '@/src/lib/api/products'
import { useCartStore } from '@/src/stores/cartStore'
import { useAuthStore } from '@/src/stores/authStore'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  image_url: string
  category_id: string
  categories?: {
    name: string
  }
}

// Categories data
const categories = [
  { id: '1', name: 'All Categories' },
  { id: '0223cd97-3a4e-4e05-94b1-0eb7cbb3ac05', name: 'Weight Loss' },
  { id: '1db536a0-ab7c-411c-bcc6-a2d1efdd47e2', name: 'Body Range' },
  { id: '6071fda1-37b7-4ae1-ba35-7443570ff5dc', name: 'Immune Booster' },
  { id: '67aad94d-ad3b-46df-934a-9b492ed4964a', name: 'Blood Pressure' },
  { id: '7ffbbb9a-a450-4dd4-a4c3-5a0a5ff145fc', name: 'Tea Range' },
  { id: 'a36c1466-ed5b-4fc9-867f-c196092df867', name: 'Female Fertility' },
  { id: 'e7145a07-00f8-4e78-8906-da5a166561c8', name: 'Skin Care' },
  { id: 'f8351765-5e42-4f74-9a11-539381c22cdb', name: 'Diabetes' }
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('1')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [search, selectedCategory, sortBy, page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const categoryId = selectedCategory === '1' ? '' : selectedCategory
      
      const data = await productsApi.getProducts({
        search,
        category: categoryId,
        page,
        limit: 12
      })
      console.log('Fetched products:', data.products)
      setProducts(data.products || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      console.error('Error fetching products:', err)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('1')
    setPage(1)
  }

  // Function to handle image URLs properly
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return null
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) return imageUrl
    
    // If it's a relative path, construct full URL
    // Adjust the base URL according to your API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const [isLiked, setIsLiked] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const { addToCart } = useCartStore()
    const { isAuthenticated } = useAuthStore()
    const router = useRouter()

    const handleAddToCart = async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!isAuthenticated) {
        toast.error('Please login to add items to cart')
        router.push('/login')
        return
      }

      try {
        setAdding(true)
        await addToCart(product.id, 1)
        toast.success('Added to cart')
      } catch (error) {
        toast.error('Failed to add item to cart')
      } finally {
        setAdding(false)
      }
    }

    const imageUrl = getImageUrl(product.image_url)

    return (
      <div 
        className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all relative flex flex-col h-full"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        <Link href={`/products/${product.id}`} className="block flex-1 flex flex-col">
          {/* Image Container - Fixed Height */}
          <div className="relative h-64 bg-gray-50 rounded-t-lg overflow-hidden flex-shrink-0">
            {imageUrl ? (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  </div>
                )}
                
                {/* Image with fixed aspect ratio */}
                <img
                  src={imageUrl}
                  alt={product.name}
                  className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => {
                    console.log('Image loaded successfully:', imageUrl)
                    setImageLoading(false)
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', imageUrl)
                    setImageError(true)
                    setImageLoading(false)
                  }}
                />
              </>
            ) : (
              // Fallback when no image URL
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                <ShoppingCart className="w-12 h-12 mb-2" />
                <span className="text-xs">No Image</span>
              </div>
            )}
            
            {/* Fallback for image error */}
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                <ShoppingCart className="w-12 h-12 mb-2" />
                <span className="text-xs">Image Not Available</span>
              </div>
            )}
            
            {/* View Details Overlay */}
            {showDetails && !imageLoading && !imageError && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300">
                <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm">
                  View Details
                </span>
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsLiked(!isLiked)
                toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist')
              }}
              className="absolute top-2 right-2 bg-white p-1.5 rounded hover:bg-gray-50 z-10 shadow-sm"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                <span className="bg-gray-500 text-white px-2 py-1 rounded text-sm">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Content Container - Consistent Height */}
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-gray-500 text-xs mb-1 uppercase tracking-wide">
              {product.categories?.name || 'Health'}
            </p>
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm leading-tight hover:text-green-600 transition-colors flex-1">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-gray-500 ml-1">(128)</span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-lg font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-2 rounded transition-colors hover:scale-105 transform duration-200"
              >
                {adding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  const ProductListItem = ({ product }: { product: Product }) => {
    const [isLiked, setIsLiked] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const { addToCart } = useCartStore()
    const { isAuthenticated } = useAuthStore()
    const router = useRouter()

    const handleAddToCart = async () => {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart')
        router.push('/login')
        return
      }

      try {
        setAdding(true)
        await addToCart(product.id, 1)
        toast.success('Added to cart')
      } catch (error) {
        toast.error('Failed to add item to cart')
      } finally {
        setAdding(false)
      }
    }

    const imageUrl = getImageUrl(product.image_url)

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <Link href={`/products/${product.id}`} className="flex-shrink-0 relative group">
            {/* Fixed size image container for list view */}
            <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
              {imageUrl ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    </div>
                  )}
                  
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageError(true)
                      setImageLoading(false)
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                  <ShoppingCart className="w-6 h-6 mb-1" />
                  <span className="text-xs">No Image</span>
                </div>
              )}
              
              {/* Fallback for image error */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                  <ShoppingCart className="w-6 h-6 mb-1" />
                  <span className="text-xs">No Image</span>
                </div>
              )}

              {/* View Details Overlay for List View */}
              {!imageLoading && !imageError && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <span className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-medium">
                    View
                  </span>
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0 flex flex-col">
            <p className="text-gray-500 text-xs mb-1 uppercase tracking-wide">
              {product.categories?.name || 'Health'}
            </p>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-medium text-gray-900 mb-2 hover:text-green-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-gray-500 ml-1">(128)</span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-xl font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/products/${product.id}`}
                  className="border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:border-green-500 hover:text-green-600 transition-colors"
                >
                  View Details
                </Link>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || adding}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm transition-colors"
                >
                  {adding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-2 hover:bg-gray-50 rounded transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Health Products</h1>
            <p className="text-gray-600">Discover our range of premium health products</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="sm:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort and View */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="created_at">Sort by Newest</option>
              </select>

              <div className="flex bg-white border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(search || selectedCategory !== '1') && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-600">Active filters:</span>
              {search && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                  Search: "{search}"
                  <button onClick={() => setSearch('')} className="hover:text-green-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== '1' && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('1')} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse flex flex-col h-full">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mt-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-4">
                Showing {products.length} products
                {selectedCategory !== '1' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                {search && ` for "${search}"`}
              </div>

              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                {products.map((product) =>
                  viewMode === 'grid' ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <ProductListItem key={product.id} product={product} />
                  )
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded text-sm ${
                          page === pageNum
                            ? 'bg-green-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}