'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, Loader2, Heart, Star, ArrowLeft, Check, Truck, Shield, Package } from 'lucide-react'
import { productsApi } from '@/src/lib/api/products'  
import toast from 'react-hot-toast'
import { useCartStore } from '@/src/stores/cartStore'
import { useAuthStore } from '@/src/stores/authStore'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'

interface Product {
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
  categories: any
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const router = useRouter()
  const { addToCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await productsApi.getProduct(params.id)
      setProduct(data)
      
    } catch (err) {
      
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  // Function to handle image URLs properly
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return null
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) return imageUrl
    
    // If it's a relative path, construct full URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      router.push('/login')
      return
    }

    if (!product || product.stock === 0) {
      toast.error('Product is out of stock')
      return
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`)
      return
    }

    try {
      setAdding(true)
      await addToCart(product.id, quantity)
    
    } catch (error) {
    
      toast.error('Failed to add item to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </div>
      </>
    )
  }

  const imageUrl = getImageUrl(product.image_url)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-green-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-green-600 font-medium truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Product Image */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                {imageUrl && !imageError ? (
                  <>
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                      </div>
                    )}
                    
                    {/* Use img tag for better compatibility */}
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                      onLoad={() => {
                        
                        setImageLoading(false)
                      }}
                      onError={(e) => {
                        
                        setImageError(true)
                        setImageLoading(false)
                      }}
                    />
                  </>
                ) : (
                  // Fallback when no image or image error
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                    <ShoppingCart className="w-16 h-16 mb-2" />
                    <span className="text-sm">No Image Available</span>
                  </div>
                )}
                
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm z-10"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                    <span className="bg-gray-500 text-white px-3 py-2 rounded-lg font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <p className="text-green-600 text-sm font-medium mb-2">
                  {product.categories?.name || 'Health Product'}
                </p>
                
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.5) · 128 reviews</span>
                </div>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="text-orange-600 text-sm font-medium bg-orange-50 px-2 py-1 rounded">
                      Only {product.stock} left
                    </span>
                  )}
                </div>

                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-medium ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.stock > 0 ? (
                    <>
                      <Check className="w-4 h-4" />
                      In Stock ({product.stock} available)
                    </>
                  ) : (
                    'Out of Stock'
                  )}
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Authentic</p>
                </div>
                <div className="text-center">
                  <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Easy Returns</p>
                </div>
              </div>

              {product.stock > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-medium text-gray-900 w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {adding ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              )}

              <Link
                href="/products"
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex overflow-x-auto border-b border-gray-200 mb-8 scrollbar-hide">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'description'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('benefits')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'benefits'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Benefits
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'usage'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Usage
              </button>
              <button
                onClick={() => setActiveTab('precautions')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'precautions'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Precautions
              </button>
            </div>

            <div className="prose prose-gray max-w-none">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                  <p className="text-gray-700 leading-relaxed">{product.info || 'No description available.'}</p>
                </div>
              )}

              {activeTab === 'benefits' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Benefits</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.benefits || 'No benefits information available.'}
                  </p>
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Direction for Use</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.direction || 'No usage instructions available.'}
                  </p>
                </div>
              )}

              {activeTab === 'precautions' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Precautions</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.precaution || 'No precautions information available.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-50 rounded-lg p-6 mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-gray-600 text-sm">On orders above ₦5,000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Fast Delivery</p>
                  <p className="text-gray-600 text-sm">2-3 days in Lagos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Easy Returns</p>
                  <p className="text-gray-600 text-sm">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}