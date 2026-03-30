'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
  onQuickView?: () => void
}

export default function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = () => {
    setIsLoading(true)
    if (onAddToCart) {
      onAddToCart()
    }
    setTimeout(() => setIsLoading(false), 500)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
            <span className="text-5xl">🛍️</span>
          </div>
        )}
        
        {/* Sale Badge (Optional) */}
        {/* {product.sale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            SALE
          </div>
        )} */}
        
        {/* Price Badge */}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform transition-transform duration-300 group-hover:scale-105">
          {formatPrice(product.price)}
        </div>
        
        {/* Quick View Button */}
        {onQuickView && isHovered && (
          <button
            onClick={onQuickView}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              Quick View
            </span>
          </button>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 mt-2 text-sm line-clamp-2">
          {product.description}
        </p>
        
        {/* Rating Stars (Optional) */}
        {/* <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div> */}
        
        {/* Add to Cart Button */}
        <div className="mt-4">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 btn-glow disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
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
          </button>
        </div>
      </div>
    </div>
  )
}