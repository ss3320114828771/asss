'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, getCurrentUser, removeCurrentUser } from '@/lib/auth'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    // Get user data
    const currentUser = getCurrentUser()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(currentUser)

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [router])

  const handleLogout = () => {
    removeCurrentUser()
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    router.push('/')
  }

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/orders', label: 'My Orders', icon: '📦' },
    { href: '/profile', label: 'Profile Settings', icon: '👤' },
    { href: '/addresses', label: 'Addresses', icon: '📍' },
    { href: '/wishlist', label: 'Wishlist', icon: '❤️' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  const adminMenuItems = [
    { href: '/admin', label: 'Admin Panel', icon: '👑' },
    { href: '/admin/products', label: 'Manage Products', icon: '🛍️' },
    { href: '/admin/orders', label: 'Manage Orders', icon: '📋' },
    { href: '/admin/users', label: 'Manage Users', icon: '👥' },
  ]

  const isAdmin = user?.email === 'admin@ecommerce.com'

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true
    if (path !== '/dashboard' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm fixed top-0 left-0 right-0 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Dashboard</span>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🕌</div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Islamic Store</h2>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Main Menu
              </p>
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {isActive(item.href) && (
                  <div className="ml-auto w-1 h-6 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}

            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="px-4 mt-6 mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Admin Panel
                  </p>
                </div>
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
            <div className="mt-4 pt-4 border-t text-center">
              <p className="text-xs text-gray-400">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'ml-0'
        } pt-14 md:pt-0`}
      >
        {/* Top Bar */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              {/* Desktop sidebar toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden md:block p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                {menuItems.find(item => isActive(item.href))?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isAdmin ? 'Administrator' : 'Customer'}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}