/* eslint-disable react-hooks/immutability */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getCart, removeFromCart, updateQuantity, getCartTotal, clearCart } from '@/lib/cart'
import { isAuthenticated } from '@/lib/auth'
import Button from '@/components/ui/button'
import Modal from '@/components/ui/modal'

interface CartItem {
  product: {
    id: string
    name: string
    price: number
    image: string
    description: string
  }
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [showClearModal, setShowClearModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const items = getCart()
    setCartItems(items)
    setTotal(getCartTotal())
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
    loadCart()
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setUpdatingId(productId)
    updateQuantity(productId, quantity)
    setTimeout(() => {
      loadCart()
      setUpdatingId(null)
    }, 100)
  }

  const handleClearCart = () => {
    clearCart()
    loadCart()
    setShowClearModal(false)
  }

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(total * 0.1)
      alert('Promo code applied! 10% discount added.')
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(total * 0.2)
      alert('Promo code applied! 20% discount added.')
    } else if (promoCode) {
      alert('Invalid promo code')
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      alert('Please login to proceed with checkout')
      router.push('/login')
      return
    }
    
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }
    
    router.push('/checkout')
  }

  const finalTotal = total - discount

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link href="/products">
              <Button size="lg" className="px-8">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Shopping Cart
            <span className="text-lg font-normal text-gray-500 ml-2">
              ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
            </span>
          </h1>
          <button
            onClick={() => setShowClearModal(true)}
            className="text-red-600 hover:text-red-700 transition-colors duration-300"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder.jpg'
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600">Quantity:</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={updatingId === item.product.id}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {updatingId === item.product.id ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={updatingId === item.product.id}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          Subtotal: {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-red-600 hover:text-red-700 transition text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="SAVE10 or SAVE20"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                fullWidth
                size="lg"
                className="mb-3"
              >
                Proceed to Checkout
              </Button>

              <Link href="/products">
                <button className="w-full text-center text-blue-600 hover:text-blue-700 transition text-sm">
                  ← Continue Shopping
                </button>
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-500 text-center mb-2">
                  Secure Payment Methods
                </p>
                <div className="flex justify-center gap-3 text-2xl">
                  <span>💳</span>
                  <span>🏦</span>
                  <span>📱</span>
                  <span>💵</span>
                  <span>🪙</span>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  🔒 100% Secure Payment Processing
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                  ✅ 30-Day Money-Back Guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear Cart"
        size="sm"
      >
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 mb-6">
            Are you sure you want to clear your entire cart? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => setShowClearModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleClearCart}
            >
              Yes, Clear Cart
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}