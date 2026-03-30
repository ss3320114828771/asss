'use client'

import React, { useState } from 'react'
import Image from 'next/image'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from 'next/link'
import Button from '@/components/ui/button'
import { Product } from '@/types/product'

interface ProductDetailsProps {
  product: Product
  onAddToCart: () => void
}

export default function ProductDetails({ product, onAddToCart }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description')

  const handleAddToCart = () => {
    setIsLoading(true)
    onAddToCart()
    setTimeout(() => setIsLoading(false), 500)
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  const totalPrice = product.price * quantity

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
        {/* Product Image Section */}
        <div className="space-y-4">
          <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {!imageError ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className="text-6xl mb-2">🛍️</span>
                <p className="text-gray-500">Image not available</p>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery (Optional) */}
          <div className="flex gap-2 justify-center">
            {[product.image, product.image, product.image].map((img, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all">
                <Image
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                In Stock
              </span>
              <span>✓ Free Shipping</span>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-b py-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-gray-500 line-through text-sm">
                {formatPrice(product.price * 1.2)}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                Save 20%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Price includes all taxes and shipping
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Quantity:</label>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xl transition"
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-2">
                Total: {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex-1 py-3 text-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🛒 Add to Cart
                </span>
              )}
            </Button>
            
            <button className="px-4 py-3 rounded-lg border-2 border-gray-300 hover:border-red-500 hover:text-red-500 transition-all duration-300">
              ❤️
            </button>
          </div>

          {/* Secure Checkout Message */}
          <div className="bg-gray-50 rounded-lg p-3 text-center text-sm text-gray-600">
            <span className="mr-2">🔒</span>
            Secure checkout · 30-day return policy · 24/7 support
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="border-t">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'description'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'shipping'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Shipping
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
              <p className="text-gray-700 leading-relaxed">
                This high-quality product is carefully crafted to meet your needs. 
                Made with premium materials and attention to detail, it ensures 
                durability and satisfaction for years to come.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-blue-800 mb-2">✨ Key Features:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Premium quality material</li>
                  <li>Elegant and durable design</li>
                  <li>Perfect for daily use</li>
                  <li>Satisfaction guaranteed</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Product ID</p>
                  <p className="font-semibold">{product.id}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold">Islamic Products</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Material</p>
                  <p className="font-semibold">Premium Quality</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Warranty</p>
                  <p className="font-semibold">1 Year</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-semibold">0.5 kg</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Origin</p>
                  <p className="font-semibold">Pakistan</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Free Shipping</h4>
                  <p className="text-gray-600">Free delivery on all orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Delivery Time</h4>
                  <p className="text-gray-600">3-5 business days for domestic orders</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔄</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Easy Returns</h4>
                  <p className="text-gray-600">30-day return policy with full refund</p>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-800">
                  📦 Orders placed before 2 PM are shipped same day!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}