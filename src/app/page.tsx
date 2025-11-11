'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Shield, Truck, ArrowRight, Star, Heart, ShoppingCart, Package, Award, Clock, Users, CheckCircle } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { productsApi } from '../lib/api/products'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

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
function HeroSection() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
                Your Health,
                <span className="text-green-600 block font-normal">Our Priority</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                Premium healthcare products delivered to your doorstep. 
                100% authentic and trusted nationwide.
              </p>
            </div>

            {/* Stats - Minimal */}
            <div className="flex gap-8 text-center">
              <div>
                <div className="text-2xl font-normal text-gray-900">500+</div>
                <div className="text-sm text-gray-500">Products</div>
              </div>
              <div>
                <div className="text-2xl font-normal text-gray-900">10K+</div>
                <div className="text-sm text-gray-500">Customers</div>
              </div>
              <div>
                <div className="text-2xl font-normal text-gray-900">24/7</div>
                <div className="text-sm text-gray-500">Support</div>
              </div>
            </div>

            {/* CTA Buttons - Clean */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Now
              </Link>
              
              <Link 
                href="#categories"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-green-400 hover:text-green-700 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>

          {/* Right Image - Minimal */}
          <div className="hidden lg:block">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src="/images/hero/hero.jpg" 
                alt="Healthcare Products"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addToCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }

    try {
      setAddingToCart(true)
      await addToCart(product.id, 1)
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add item to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {product.image_url && !imageError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`} />
        </button>

        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">
          {product.categories?.name || 'Health'}
        </p>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight hover:text-green-600 transition-colors">
          <Link href={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs text-gray-500">(128)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-xs text-amber-600 ml-2 font-medium">Only {product.stock} left!</span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            {addingToCart ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatsSection() {
  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: Users },
    { number: '500+', label: 'Quality Products', icon: Package },
    { number: '5+', label: 'Years Experience', icon: Award },
    { number: '24/7', label: 'Customer Support', icon: Clock }
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Health Excellence?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of customers for our commitment to quality, authenticity, and exceptional service.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular Customer",
      content: "The quality of products is exceptional! I've been using their immune boosters for 6 months and haven't been sick once.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Fitness Enthusiast",
      content: "Fast delivery and genuine products. Their wellness supplements have helped me maintain my fitness goals effectively.",
      rating: 5
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      role: "Nutritionist",
      content: "As a nutritionist, I recommend Health Excellence to my clients. Their products are pure and effective.",
      rating: 5
    }
  ]

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">Don't just take our word for it - hear from our satisfied customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-green-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productsApi.getProducts({ limit: 8, page: 1 })
      setProducts(data.products || [])
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    {
      id: 1,
      name: "Immune Boosters",
      description: "Strengthen your body's natural defenses",
      href: "/products?category=immune",
      icon: Shield
    },
    {
      id: 2,
      name: "Skin Care",
      description: "Nourish and protect your skin naturally",
      href: "/products?category=skin",
      icon: Award
    },
    {
      id: 3,
      name: "Wellness",
      description: "Complete wellness solutions for you",
      href: "/products?category=wellness",
      icon: CheckCircle
    }
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <HeroSection />

        {/* Features */}
        <div className="border-y border-gray-200">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                  <p className="text-gray-600 text-sm">Above ₦5,000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">100% Authentic</h3>
                  <p className="text-gray-600 text-sm">Quality Guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Best Prices</h3>
                  <p className="text-gray-600 text-sm">Great Savings</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                  <p className="text-gray-600 text-sm">30-Day Policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <StatsSection />
{/* Minimal Categories Section */}
<div id="categories" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Product Categories</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Find exactly what you need with our organized health categories
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {categories.map((category) => {
        const IconComponent = category.icon
        return (
          <Link 
            key={category.id}
            href={category.href}
            className="group bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300 p-8 text-center block"
          >
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
              <IconComponent className="w-10 h-10 text-green-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
              {category.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {category.description}
            </p>
            
            <span className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm">
              Browse Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        )
      })}
    </div>
  </div>
</div>

        {/* Best Selling Products */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Best Selling Products</h2>
                <p className="text-gray-600">Discover our most popular health essentials</p>
              </div>
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Trending Products */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Products</h2>
                <p className="text-gray-600">What's popular right now</p>
              </div>
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        

        {/* CTA Section */}
        <div className="bg-gray-900 py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Improve Your Health?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Health Excellence for their wellness needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center gap-2 border border-gray-300 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}