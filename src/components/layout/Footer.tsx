'use client'

import Link from 'next/link'
import { Leaf, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Health Excellence
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Your trusted partner for premium health products and wellness solutions.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Shipping
                </Link>
              </li>
            
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-600 text-sm">
                <Phone className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                +234 70 8006 1271
              </li>
              <li className="flex items-start gap-2 text-gray-600 text-sm">
                <Mail className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Healthexcellence62@gmail.com
              </li>
              <li className="flex items-start gap-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Health Excellence. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-gray-500 hover:text-green-600 transition-colors text-sm">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-green-600 transition-colors text-sm">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}