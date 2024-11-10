'use client'
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/assets/bird-logo (1).webp"
                alt="ISeedP"
                width={70}
                height={100}
                className="cursor-pointer"
              />
              <div className="hidden md:flex ml-10 space-x-8">
                <Link href="/discover" className="text-gray-600 hover:text-gray-900">
                  Discover
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                  How It Works
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-[#18181B] text-white px-4 py-2 rounded-md hover:bg-black transition-colors"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold text-[#18181B] mb-6 leading-[1.1]">
              Crowdfunding for the
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#0052CC]">
                {' '}collective{' '}
              </span>
              future
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join a community of changemakers and bring your revolutionary ideas to life through the power of collective funding.
            </p>

            <div className="flex justify-center gap-4">
              <Link 
                href="/discover" 
                className="inline-block bg-[#18181B] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-black transition-colors"
              >
                Explore Projects
              </Link>
              <Link 
                href="/auth/signup" 
                className="inline-block border-2 border-[#18181B] text-[#18181B] px-8 py-3 rounded-md text-lg font-medium hover:bg-[#18181B] hover:text-white transition-colors"
              >
                Start a Project
              </Link>
            </div>
          </motion.div>
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <h3 className="text-4xl font-bold text-[#18181B] mb-2">$2.5M+</h3>
              <p className="text-gray-600">Total Funds Raised</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-[#18181B] mb-2">1,200+</h3>
              <p className="text-gray-600">Successful Projects</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-[#18181B] mb-2">50K+</h3>
              <p className="text-gray-600">Community Members</p>
            </div>
          </motion.div>

          {/* Video Showcase Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-32 text-center"
          >
            <h2 className="text-3xl font-bold mb-6">See It In Action</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Watch how easy it is to create and fund projects on MarxistRaise
            </p>
            
            <div className="relative max-w-5xl mx-auto">
              <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                >
                  <source 
                    src="/assets/screenrun-11-10-2024-11-45-16.mp4" 
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Optional: Decorative elements */}
              <div className="absolute -z-10 -top-8 -left-8 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-8 -right-8 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl" />
            </div>
            
            {/* Optional: Key Features Below Video */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Easy Setup</h3>
                <p className="text-gray-600">Create your project in minutes with our intuitive interface</p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Secure Funding</h3>
                <p className="text-gray-600">Built on ICP blockchain for transparent and secure transactions</p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
                <p className="text-gray-600">Connect with supporters who believe in your vision</p>
              </div>
            </div>
          </motion.div>

          {/* How It Works Section */}
          <div className="mt-32 text-center">
            <h2 className="text-3xl font-bold mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="relative">
                <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#0066FF]">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Create Your Project</h3>
                <p className="text-gray-600">Share your vision and set your funding goals with our easy-to-use platform.</p>
              </div>
              <div className="relative">
                <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#0066FF]">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Build Support</h3>
                <p className="text-gray-600">Connect with our community of supporters who share your values and vision.</p>
              </div>
              <div className="relative">
                <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#0066FF]">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Make It Happen</h3>
                <p className="text-gray-600">Receive funding and turn your revolutionary ideas into reality.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}