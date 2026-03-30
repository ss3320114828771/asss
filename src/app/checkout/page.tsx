'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from 'next/link'
import Image from 'next/image'
import { getCart, clearCart, getCartTotal } from '@/lib/cart'
import { getCurrentUser, isAuthenticated } from '@/lib/auth'
import Button from '@/components/ui/button'

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

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    // Load cart data
    const items = getCart()
    if (items.length === 0) {
      router.push('/cart')
      return
    }

    setCartItems(items)
    setTotal(getCartTotal())

    // Load user data
    const user = getCurrentUser()
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }))
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateShippingInfo = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode']
    for (const field of required) {
      if (!formData[field as keyof FormData]) {
        alert(`Please fill in ${field}`)
        return false
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address')
      return false
    }

    const phoneRegex = /^[0-9+\-\s]{10,}$/
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid phone number')
      return false
    }

    return true
  }

  const validatePaymentInfo = () => {
    const required = ['cardNumber', 'cardName', 'expiryDate', 'cvv']
    for (const field of required) {
      if (!formData[field as keyof FormData]) {
        alert(`Please fill in ${field}`)
        return false
      }
    }

    const cardNumberRegex = /^[0-9]{16}$/
    if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
      alert('Please enter a valid 16-digit card number')
      return false
    }

    const cvvRegex = /^[0-9]{3,4}$/
    if (!cvvRegex.test(formData.cvv)) {
      alert('Please enter a valid CVV')
      return false
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!expiryRegex.test(formData.expiryDate)) {
      alert('Please enter a valid expiry date (MM/YY)')
      return false
    }

    return true
  }

  const handleNextStep = () => {
    if (step === 1 && validateShippingInfo()) {
      setStep(2)
    } else if (step === 2 && validatePaymentInfo()) {
      placeOrder()
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const placeOrder = async () => {
    setLoading(true)
    
    try {
      const user = getCurrentUser()
      if (!user) {
        alert('Please login to place order')
        router.push('/login')
        return
      }

      const orderData = {
        userId: user.id,
        total: total,
        items: cartItems,
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        }
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        clearCart()
        alert('Order placed successfully!')
        router.push('/orders')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Checkout Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <div className="flex-1 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <p className="text-sm text-gray-600">Shipping</p>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300">
              <div className={`h-full bg-blue-600 transition-all duration-300 ${
                step >= 2 ? 'w-full' : 'w-0'
              }`}></div>
            </div>
            <div className="flex-1 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <p className="text-sm text-gray-600">Payment</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP / Postal Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pakistan">Pakistan</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="Name on card"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-800">
                        🔒 Your payment information is secure and encrypted
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4 mt-8">
                {step === 2 && (
                  <Button
                    variant="secondary"
                    onClick={handlePrevStep}
                    className="px-8"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNextStep}
                  loading={loading}
                  className="flex-1"
                >
                  {step === 1 ? 'Continue to Payment' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="max-h-64 overflow-y-auto mb-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secure Badges */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-center gap-4 text-2xl mb-3">
                  <span>💳</span>
                  <span>🏦</span>
                  <span>📱</span>
                  <span>🔒</span>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Secure transaction • SSL encrypted • PCI compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}