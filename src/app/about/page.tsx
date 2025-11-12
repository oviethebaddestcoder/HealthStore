'use client'

import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import { Shield, Heart, Users, Award, Target, Leaf, Sparkles, TrendingUp, CheckCircle, Star, Globe, Building, Users2, TargetIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Supplements",
      description: "Highly effective health supplements backed by scientific research and proven results.",
      color: "from-green-500 to-emerald-500",
      delay: "0"
    },
    {
      icon: <Users2 className="w-8 h-8" />,
      title: "Entrepreneur Creation",
      description: "Creating wealth through health by empowering entrepreneurs across Africa.",
      color: "from-emerald-500 to-teal-500",
      delay: "100"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Operating in multiple African countries plus the United States with expanding footprint.",
      color: "from-teal-500 to-cyan-500",
      delay: "200"
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "African Women Owned",
      description: "First major African women-owned network marketing company in the world.",
      color: "from-cyan-500 to-green-500",
      delay: "300"
    }
  ]

  const stats = [
    { number: "10,000+", label: "Entrepreneurs Empowered", icon: <Users className="w-6 h-6" />, suffix: "" },
    { number: "5+", label: "African Countries", icon: <Globe className="w-6 h-6" />, suffix: "" },
    { number: "16+", label: "Years Experience", icon: <TrendingUp className="w-6 h-6" />, suffix: "" },
    { number: "2020", label: "Founded", icon: <TargetIcon className="w-6 h-6" />, suffix: "" }
  ]

  const values = [
    "Highly Effective Health Supplements",
    "Entrepreneurship Development",
    "Wealth Creation Through Health",
    "African Empowerment",
    "Women Leadership",
    "Global African Success Story"
  ]

  const leadership = [
    {
      name: "Nneka Nwarueze",
      role: "Co-Founder & CEO",
      bio: "16+ years experience in network marketing, evolved from Swissgarde franchisee to Healthgarde founder",
      achievement: "Pioneering African women entrepreneur"
    },
    {
      name: "Lovelyn Bassey",
      role: "Co-Founder & Partner",
      bio: "Driving force behind Healthgarde's expansion and entrepreneurial development",
      achievement: "Next-generation business leader"
    }
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-800">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-green-100 mb-6 border border-white/20">
            <Leaf className="w-5 h-5" />
            <span className="text-sm font-semibold">Creating Wealth Through Health Since 2020</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            About <span className="text-green-200">Healthgarde</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed mb-8">
            A leading Health and Wellness company creating entrepreneurs through network marketing 
            and providing highly effective health supplements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-green-50">
                Explore Products
              </button>
            </Link>
      
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-current text-gray-100"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-current text-gray-100"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-current text-gray-100"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-1 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-100 hover:shadow-3xl transition-shadow duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center group hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600 group-hover:shadow-lg group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-gray-700 font-semibold text-sm uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full text-green-700 mb-6 border border-green-200">
                <Target className="w-5 h-5" />
                <span className="text-sm font-bold tracking-wide">OUR MISSION</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6 leading-tight">
                Creating <span className="text-green-600">Wealth Through Health</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Healthgarde International is a leading Health and Wellness company with two focuses: 
                providing highly effective health supplements and creating entrepreneurs through network marketing. 
                We aim to create wealth through health.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                With our Head Office in Lagos, Healthgarde is currently in several African countries 
                plus the United States and continues to make strides to expand its footprint across Africa and the world.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-700 group hover:text-green-700 transition-colors">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-1 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gray-800 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white/20 p-3 rounded-2xl">
                      <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                  </div>
                  <ul className="space-y-4 text-green-50">
                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-green-200" />
                      <span>Develop Africans and bring Africans out of poverty</span>
                    </li>
                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-green-200" />
                      <span>Change not only single lives but entire families</span>
                    </li>
                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-green-200" />
                      <span>Impact current and future generations</span>
                    </li>
                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-green-200" />
                      <span>Promote physical & financial wellness across Africa</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full text-green-700 mb-4 border border-green-200">
              <Users className="w-5 h-5" />
              <span className="text-sm font-bold tracking-wide">FOUNDERS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4">Pioneering African Women Leaders</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Meet the visionary women behind Africa's first major women-owned network marketing company.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((leader, index) => (
              <div key={index} className="group text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {leader.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">{leader.name}</h3>
                <div className="text-green-600 font-semibold mb-3">{leader.role}</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">{leader.bio}</p>
                <div className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full inline-block">
                  {leader.achievement}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-green-700 mb-4 border border-green-200 shadow-sm">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold tracking-wide">WHY HEALTHGARDE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4">What Makes Us Unique</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Combining health excellence with entrepreneurial empowerment across Africa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-2xl bg-white p-6 border-2 border-green-100 hover:border-green-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-3">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed text-sm">{feature.description}</p>
                
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Globe className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our African Success Story</h2>
            <div className="text-lg md:text-xl space-y-6 leading-relaxed text-green-50">
              <p>
                <strong>Nneka Nwarueze</strong> evolved from being franchisees of a South African Network 
                marketing company (Swissgarde) for over 16 years to launching Healthgarde in 2020 in 
                partnership with her daughter <strong>Lovelyn Bassey</strong> and the support of other amazing women.
              </p>
              <p>
                Healthgarde is not only an African company, but also the <strong>1st major African Women owned 
                network marketing company in the world</strong>; reaching and changing many lives. A true African success story.
              </p>
              <p>
                We firmly believe in developing Africans and bringing Africans out of poverty. 
                Changing not only a single life but an entire family, its current generation and generations to come.
              </p>
            </div>
            
            <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <p className="text-2xl font-bold mb-2 italic">"This business is not measured by how much money you make, but by how many people you help and how many lives you change."</p>
              <p className="text-green-200">– Robert T. Kiyosaki</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-white to-green-50 border-t border-green-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">Ready to Transform Lives With Us?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join our mission to create wealth through health and empower communities across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700">
                Shop Products
              </button>
            </Link>
          
          </div>
        </div>
      </section>

      <Footer />
      
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .animate-float {
          animation: float 7s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}