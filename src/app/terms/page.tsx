'use client'

import { Shield, FileText, Lock, Eye, Users, Cookie } from 'lucide-react'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'

export default function TermsPrivacyPage() {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Terms of Service",
      content: [
        {
          subtitle: "1. Acceptance of Terms",
          text: "By accessing and using Health Excellence services, you accept and agree to be bound by the terms and provision of this agreement."
        },
        {
          subtitle: "2. Use License",
          text: "Permission is granted to temporarily use Health Excellence services for personal, non-commercial transitory viewing only."
        },
        {
          subtitle: "3. Account Responsibilities",
          text: "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer."
        },
        {
          subtitle: "4. Product Information",
          text: "We strive to display accurate product information, but we don't warrant that product descriptions are accurate, complete, or error-free."
        },
        {
          subtitle: "5. Pricing and Payments",
          text: "All prices are subject to change without notice. We reserve the right to discontinue any product at any time."
        }
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy Policy",
      content: [
        {
          subtitle: "1. Information We Collect",
          text: "We collect personal information you provide such as name, email, and shipping address. We also automatically collect device and usage information."
        },
        {
          subtitle: "2. How We Use Your Information",
          text: "We use your information to process orders, improve our services, communicate with you, and personalize your experience."
        },
        {
          subtitle: "3. Data Protection",
          text: "We implement security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure."
        },
        {
          subtitle: "4. Cookies and Tracking",
          text: "We use cookies and similar tracking technologies to track activity on our service and hold certain information."
        },
        {
          subtitle: "5. Your Rights",
          text: "You have the right to access, correct, or delete your personal data. You can also object to processing of your personal data."
        }
      ]
    }
  ]

  const quickLinks = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Data Security",
      description: "Learn about our security measures"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Your Privacy",
      description: "Understand your privacy rights"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "User Rights",
      description: "Know your data protection rights"
    },
    {
      icon: <Cookie className="w-5 h-5" />,
      title: "Cookie Policy",
      description: "How we use cookies and tracking"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-800 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Terms & Privacy</h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto">
            Your trust is important to us. Learn about our terms of service and privacy practices.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Quick Links */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={`#${link.title.toLowerCase().replace(' ', '-')}`}
                  className="bg-white rounded-xl shadow-md border border-emerald-100 p-4 sm:p-6 text-center hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 inline-flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                    {link.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{link.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{link.description}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Terms and Privacy Sections */}
          <div className="space-y-12">
            {sections.map((section, sectionIndex) => (
              <section key={sectionIndex} className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 sm:px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-full text-emerald-600">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{section.title}</h2>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-6 sm:p-8">
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-emerald-700 mb-3">
                          {item.subtitle}
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-gray-800 rounded-2xl border border-emerald-200 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">Need More Information?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
                <p className="text-white mb-4">
                  Have questions about our terms or privacy policy? We're here to help.
                </p>
                <div className="space-y-2">
                  <p className="text-white font-semibold">070 8006 1271</p>
                  <p className="text-white font-semibold break-words">
                    Healthexcellence62@gmail.com
                  </p>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Policy Updates</h3>
                <p className="text-white mb-4">
                  We may update these terms and policies periodically. Check back for the latest version.
                </p>
                <p className="text-sm text-white">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}