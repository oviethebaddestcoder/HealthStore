'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingCart, User, Menu, X, LogOut, Package, Leaf, ChevronDown, Home, ShoppingBag, Info } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, initialized, signOut } = useAuthStore()
  const { getItemCount, fetchCart, items } = useCartStore()
  const router = useRouter()
  
  const cartItemCount = getItemCount()

  const promotionalMessages = [
    
    "💚 Your health is our priority - Shop with confidence",
    "⭐ Premium quality healthcare products",
    "📞 Need help? Call us: +234 70 8006 1271",
    "⚡ Fast delivery across Nigeria"
  ]

  useEffect(() => {
    if (!initialized) return
    if (!isAuthenticated) return
    fetchCart()
  }, [initialized, isAuthenticated, fetchCart])

  useEffect(() => {
    // Ensures count updates when cart changes
  }, [items])

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
    setMobileMenuOpen(false)
    router.push('/')
  }

  return (
    <>
      {/* Moving Text Announcement Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 overflow-hidden shadow-lg">
        <div className="animate-marquee whitespace-nowrap">
          {promotionalMessages.map((message, index) => (
            <span key={index} className="mx-8 text-sm font-medium">
              {message}
            </span>
          ))}
        </div>
      </div>

      <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-2xl group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-700 shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                  Health
                </span>
                <span className="text-lg font-bold text-gray-600 leading-tight -mt-1">
                  Excellence
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-700 font-semibold transition-all hover:bg-gray-50 hover:text-gray-900 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </Link>
              <Link 
                href="/products" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-700 font-semibold transition-all hover:bg-gray-50 hover:text-gray-900 group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Products</span>
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-700 font-semibold transition-all hover:bg-gray-50 hover:text-gray-900 group"
              >
                <Info className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>About</span>
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/orders" 
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-700 font-semibold transition-all hover:bg-gray-50 hover:text-gray-900 group"
                >
                  <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>My Orders</span>
                </Link>
              )}
              {user?.is_admin && (
                <Link 
                  href="/admin/dashboard" 
                  className="px-4 py-2.5 rounded-xl bg-gray-900 text-white font-semibold transition-all hover:bg-gray-800 shadow-md hover:shadow-lg"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Cart */}
              <Link 
                href={isAuthenticated ? "/cart" : "/login"}
                className="relative p-3 rounded-xl transition-all hover:bg-gray-50 group"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform" />
                {isAuthenticated && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartItemCount}
                  </span>
                )}
                {!isAuthenticated && (
                  <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    0
                  </span>
                )}
              </Link>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all hover:bg-gray-50 border-2 border-transparent hover:border-gray-200"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      Hi, {user?.full_name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 z-50 overflow-hidden">
                        <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-b-2 border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-gray-900 to-gray-700 shadow-md">
                              <User className="w-7 h-7 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-gray-900 truncate text-lg">{user?.full_name}</p>
                              <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                          >
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setShowUserMenu(false)}
                            className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                          >
                            Order History
                          </Link>
                          <Link
                            href="/cart"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                          >
                            Shopping Cart
                            {cartItemCount > 0 && (
                              <span className="text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full font-bold">
                                {cartItemCount}
                              </span>
                            )}
                          </Link>
                        </div>
                        <div className="border-t-2 border-gray-100 p-2">
                          <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all font-bold shadow-md"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="font-bold text-gray-700 hover:text-gray-900 transition-colors px-4 py-2.5 rounded-xl hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-xl font-bold hover:scale-105 transform"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Right Side */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Cart Icon - Mobile */}
              <Link 
                href={isAuthenticated ? "/cart" : "/login"}
                className="relative p-2.5 rounded-xl transition-all hover:bg-gray-50"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {isAuthenticated && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                    {cartItemCount}
                  </span>
                )}
                {!isAuthenticated && (
                  <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    0
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl transition-all hover:bg-gray-50"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t-2 border-gray-100 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col space-y-2">
                {isAuthenticated && (
                  <div className="px-4 py-4 mb-3 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 shadow-md">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{user?.full_name}</p>
                        <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  href="/"
                  className="flex items-center gap-3 text-gray-700 transition-all py-3 px-4 rounded-xl font-bold hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/products"
                  className="flex items-center gap-3 text-gray-700 transition-all py-3 px-4 rounded-xl font-bold hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Products</span>
                </Link>

                <Link
                  href="/about"
                  className="flex items-center gap-3 text-gray-700 transition-all py-3 px-4 rounded-xl font-bold hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info className="w-5 h-5" />
                  <span>About</span>
                </Link>

                <Link
                  href={isAuthenticated ? "/cart" : "/login"}
                  className="flex items-center justify-between text-gray-700 transition-all py-3 px-4 rounded-xl font-bold hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5" />
                    View Cart
                  </span>
                  {isAuthenticated && cartItemCount > 0 && (
                    <span className="bg-gray-900 text-white text-xs rounded-full px-2.5 py-1 font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 text-gray-700 transition-all py-3 px-4 rounded-xl font-bold hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="w-5 h-5" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 text-gray-700 transition-all py-3 px-4 rounded-xl font-bold hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>
                  </>
                )}

                {user?.is_admin && (
                  <Link
                    href="/admin/dashboard"
                    className="text-gray-700 transition-all py-3 px-4 rounded-xl font-bold hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="pt-3 border-t-2 border-gray-100 mt-2">
                  {isAuthenticated ? (
                    <button
                      onClick={handleSignOut}
                      className="w-full text-white px-4 py-3.5 rounded-xl transition-all font-bold flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/login"
                        className="text-gray-700 py-3 px-4 text-center font-bold hover:bg-gray-50 rounded-xl transition-all border-2 border-gray-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-3 rounded-xl transition-all text-center font-bold shadow-lg hover:shadow-xl"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: inline-block;
        }
      `}</style>
    </>
  )
}