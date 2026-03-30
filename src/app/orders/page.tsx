'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser, isAuthenticated } from '@/lib/auth'
import Button from '@/components/ui/button'

interface OrderItem {
  product: {
    id: string
    name: string
    price: number
    image: string
    description: string
  }
  quantity: number
}

interface Order {
  id: string
  userId: string
  total: number
  items: OrderItem[] | string
  createdAt: string
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

interface CartItem {
  product: OrderItem['product']
  quantity: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const router = useRouter()

  const getOrderStatus = (createdAt: string) => {
    const orderDate = new Date(createdAt)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff < 1) return 'processing'
    if (daysDiff < 3) return 'shipped'
    return 'delivered'
  }

  const fetchOrders = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) return

    try {
      const response = await fetch(`/api/orders?userId=${user.id}`)
      const data = await response.json()
      
      // Parse items if they're stored as JSON strings
      const parsedOrders = data.map((order: Order) => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
        status: order.status || getOrderStatus(order.createdAt)
      }))
      
      setOrders(parsedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    
    fetchOrders()
  }, [router, fetchOrders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'processing':
        return '⚙️'
      case 'shipped':
        return '🚚'
      case 'delivered':
        return '✅'
      case 'cancelled':
        return '❌'
      default:
        return '📦'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  const handleTrackOrder = (orderId: string) => {
    // In a real app, this would open tracking details
    alert(`Tracking information for order #${orderId.slice(0, 8)} will be available soon.`)
  }

  const handleReorder = (order: Order) => {
    // Add all items from order to cart
    const items = Array.isArray(order.items) ? order.items : []
    const currentCart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
    
    items.forEach(item => {
      const existingItem = currentCart.find((i: CartItem) => i.product.id === item.product.id)
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        currentCart.push({ product: item.product, quantity: item.quantity })
      }
    })
    
    localStorage.setItem('cart', JSON.stringify(currentCart))
    alert('Items added to cart!')
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</h1>
          <p className="text-gray-600 mb-8">
            You haven&apos;t placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link href="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">View and track all your orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-semibold text-gray-800">{order.id.slice(0, 12)}...</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placed on</p>
                    <p className="font-semibold text-gray-800">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status || 'pending')}`}>
                      {getStatusIcon(order.status || 'pending')}
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {Array.isArray(order.items) && order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🛍️</span>
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.product.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={() => handleTrackOrder(order.id)}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold transition"
                  >
                    Track Order
                  </button>
                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Reorder
                  </button>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Statistics */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-2">📦</div>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
            <p className="text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-2xl font-bold text-gray-800">
              {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
            </p>
            <p className="text-gray-600">Total Spent</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-2">🚚</div>
            <p className="text-2xl font-bold text-gray-800">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
            <p className="text-gray-600">Delivered Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-2xl font-bold text-gray-800">
              {orders.length > 0 ? Math.floor(orders.reduce((sum, o) => sum + o.total, 0) / orders.length) : 0}
            </p>
            <p className="text-gray-600">Average Order Value</p>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link href="/products">
            <Button variant="secondary">Continue Shopping</Button>
          </Link>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono font-semibold">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status || 'pending')}`}>
                    {getStatusIcon(selectedOrder.status || 'pending')}
                    {selectedOrder.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 'Processing'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold">Credit Card</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
                <div className="space-y-3">
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-blue-600">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleTrackOrder(selectedOrder.id)}
                  className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  Track Order
                </button>
                <button
                  onClick={() => {
                    handleReorder(selectedOrder)
                    setSelectedOrder(null)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Reorder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}