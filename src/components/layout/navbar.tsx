/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated, removeCurrentUser, getCurrentUser } from '@/lib/auth'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Get auth state
    const loggedIn = isAuthenticated()
    const user = getCurrentUser()
    
    // Update state
    setIsLoggedIn(loggedIn)
    if (user) {
      setUserEmail(user.email)
    }
    
    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    removeCurrentUser()
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    setIsLoggedIn(false)
    setUserEmail('')
    setIsMenuOpen(false)
    router.push('/')
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/products', label: 'Products', icon: '🛍️' },
    { href: '/about', label: 'About', icon: '📖' },
    { href: '/contact', label: 'Contact', icon: '📧' },
    { href: '/directions', label: 'Directions', icon: '📍' },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gradient-to-r from-purple-700 to-blue-700 shadow-lg' 
        : 'bg-gradient-to-r from-purple-600 to-blue-600'
    } text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold glow-text hover:scale-105 transition-transform duration-300"
          >
            🕌 Islamic Store
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-white/20 text-white font-semibold'
                    : 'hover:bg-white/10 hover:scale-105'
                }`}
              >
                <span className="mr-1">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {isLoggedIn && (
              <>
                <Link
                  href="/cart"
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/cart')
                      ? 'bg-white/20 text-white font-semibold'
                      : 'hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  🛒 Cart
                </Link>
                <Link
                  href="/orders"
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/orders')
                      ? 'bg-white/20 text-white font-semibold'
                      : 'hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  📦 Orders
                </Link>
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/admin')
                      ? 'bg-white/20 text-white font-semibold'
                      : 'hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  👑 Admin
                </Link>
              </>
            )}
            
            {isLoggedIn ? (
              <div className="ml-4 flex items-center space-x-3">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  👤 {userEmail.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="ml-4 flex space-x-2">
                <Link
                  href="/login"
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {isLoggedIn && (
              <>
                <Link
                  href="/cart"
                  className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🛒 Cart
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📦 Orders
                </Link>
                <Link
                  href="/admin"
                  className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  👑 Admin
                </Link>
              </>
            )}
            
            {isLoggedIn ? (
              <div className="px-4 py-3 border-t border-white/20 mt-2">
                <p className="text-sm mb-2">👤 Logged in as:</p>
                <p className="text-sm font-semibold mb-3">{userEmail}</p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-4 py-3 border-t border-white/20 mt-2 space-y-2">
                <Link
                  href="/login"
                  className="block text-center bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-center bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}