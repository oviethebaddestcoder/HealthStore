'use client'

import Navbar from '@/src/components/layout/Navbar'
import { Shield, Heart, Users, Award, Target, Leaf } from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trusted Quality",
      description: "All our products undergo rigorous quality testing and are sourced from reputable manufacturers."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health First",
      description: "Your wellbeing is our priority. We carefully select products that promote genuine health benefits."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Team",
      description: "Our team includes healthcare professionals and nutritionists to guide product selection."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Award Winning",
      description: "Recognized for excellence in customer service and product quality in the health industry."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "500+", label: "Quality Products" },
    { number: "5+", label: "Years Experience" },
    { number: "24/7", label: "Customer Support" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Health Excellence</h1>
          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in health and wellness journey. We're committed to providing 
            premium quality health products that make a real difference in your life.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                At Health Excellence, we believe that everyone deserves access to high-quality 
                health products that genuinely improve wellbeing. Our mission is to curate the 
                finest selection of supplements, vitamins, and wellness products backed by 
                scientific research and customer testimonials.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We work directly with trusted manufacturers and conduct thorough quality 
                checks to ensure every product meets our strict standards for purity, 
                potency, and effectiveness.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-emerald-100">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We stand out in the health industry through our unwavering commitment to quality and customer care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-emerald-50 border border-emerald-100 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Leaf className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="text-lg text-gray-700 space-y-4 leading-relaxed">
              <p>
                Founded in 2019, Health Excellence began as a small family business with a simple 
                goal: to provide genuine, effective health products in a market saturated with 
                questionable supplements.
              </p>
              <p>
                What started as a passion project has grown into a trusted brand serving thousands 
                of customers nationwide. We've maintained our core values while expanding our 
                product range to include the latest advancements in health and wellness.
              </p>
              <p>
                Today, we're proud to be your reliable partner in health, offering carefully 
                curated products that we would confidently recommend to our own families.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}