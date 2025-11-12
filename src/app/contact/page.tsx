'use client'

import { Phone, Mail, Clock } from 'lucide-react'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Phone",
      details: "070 8006 1271",
      description: "Mon-Fri from 8am to 6pm"
    },
    {
      icon: <Mail className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Email",
      details: "Healthexcellence62@gmail.com",
      description: "We reply within 24 hours"
    },
    {
      icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Hours",
      details: "24/7 Customer Support",
      description: "Chat and email support always available"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Contact Us</h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto">
            Get in touch with us through phone or email. We're here to help!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {contactInfo.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 sm:p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 inline-flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-emerald-600 font-semibold text-lg sm:text-xl mb-2 break-words">
                  {item.details}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Quick Contact Emphasis */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Quick Contact</h2>
              <p className="text-gray-600 text-lg sm:text-xl mb-6 max-w-2xl mx-auto">
                Prefer to call or email directly? Here are our main contact details:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
                <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="bg-emerald-600 p-2 rounded-full">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Call Us</h3>
                  </div>
                  <p className="text-emerald-700 font-semibold text-lg sm:text-xl">070 8006 1271</p>
                  <p className="text-gray-600 text-sm mt-2">Available Mon-Fri, 8am-6pm</p>
                </div>
                
                <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="bg-emerald-600 p-2 rounded-full">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Email Us</h3>
                  </div>
                  <p className="text-emerald-700 font-semibold text-lg sm:text-xl break-words">
                    Healthexcellence62@gmail.com
                  </p>
                  <p className="text-gray-600 text-sm mt-2">Response within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <div className="mt-8 sm:mt-12 bg-emerald-50 rounded-2xl border border-emerald-200 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">Quick Help</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <a href="/returns" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200">
                Returns & Refunds
              </a>
              <a href="/shipping" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200">
                Shipping Information
              </a>
              <a href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200">
                Product Questions
              </a>
              <a href="/account" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200">
                Account Issues
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}