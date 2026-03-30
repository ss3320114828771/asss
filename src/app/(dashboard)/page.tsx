'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
}

interface Stats {
  totalOrders: number
  totalSpent: number
  wishlistCount: number
  recentOrders: Order[]
}

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const user = getCurrentUser()
      if (!user) return

      // Fetch orders
      const ordersResponse = await fetch(`/api/orders?userId=${user.id}`)
      const orders = await ordersResponse.json()
      
      // Calculate stats
      const totalOrders = orders.length
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total, 0)
      const recentOrders = orders.slice(0, 5)
      
      // Get wishlist from localStorage
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      const wishlistCount = wishlist.length
      
      setStats({
        totalOrders,
        totalSpent,
        wishlistCount,
        recentOrders
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.email?.split('@')[0] || 'Customer'}!
        </h1>
        <p className="text-blue-100">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">📦</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
          </div>
          <h3 className="text-gray-600 font-medium">Total Orders</h3>
          <Link 
            href="/orders" 
            className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
          >
            View all orders →
          </Link>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">💰</div>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(stats.totalSpent)}
            </div>
          </div>
          <h3 className="text-gray-600 font-medium">Total Spent</h3>
          <p className="text-sm text-gray-500 mt-2">Lifetime purchases</p>
        </div>

        {/* Wishlist */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">❤️</div>
            <div className="text-2xl font-bold text-pink-600">{stats.wishlistCount}</div>
          </div>
          <h3 className="text-gray-600 font-medium">Wishlist Items</h3>
          <Link 
            href="/wishlist" 
            className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
          >
            View wishlist →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link
            href="/products"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="text-2xl mb-2">🛍️</span>
            <span className="text-sm font-medium text-gray-700">Shop Now</span>
          </Link>
          <Link
            href="/orders"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="text-2xl mb-2">📦</span>
            <span className="text-sm font-medium text-gray-700">Track Order</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="text-2xl mb-2">👤</span>
            <span className="text-sm font-medium text-gray-700">Edit Profile</span>
          </Link>
          <Link
            href="/settings"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="text-2xl mb-2">⚙️</span>
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          {stats.recentOrders.length > 0 && (
            <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          )}
        </div>

        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-b-0">
                    <td className="py-3 text-sm font-mono">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 text-sm font-semibold text-gray-800">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status || 'processing')}`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link 
                        href={`/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-gray-500 mb-4">No orders yet</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-800">
                {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-medium text-gray-800">
                {user?.email === 'admin@ecommerce.com' ? 'Administrator' : 'Customer'}
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700"
          >
            Edit Profile →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Have questions about your orders or account? We&apos;re here to help!
            </p>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="block text-blue-600 hover:text-blue-700"
              >
                📧 Contact Support
              </Link>
              <Link
                href="/faq"
                className="block text-blue-600 hover:text-blue-700"
              >
                📖 Visit FAQ
              </Link>
              <a
                href="tel:03084491993"
                className="block text-blue-600 hover:text-blue-700"
              >
                📞 Call Us: 03084491993
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Islamic Blessing */}
      <div className="text-center pt-4">
        <p className="text-xs text-gray-400">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
      </div>
    </div>
  )
}