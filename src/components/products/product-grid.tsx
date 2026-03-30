/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useMemo } from 'react'
import ProductCard from './product-card'
import { Product } from '@/types/product'

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  loading?: boolean
  emptyMessage?: string
  showFilters?: boolean
  onSortChange?: (sort: string) => void
  onFilterChange?: (filter: string) => void
}

export default function ProductGrid({ 
  products, 
  onAddToCart, 
  loading = false,
  emptyMessage = "No products found",
  showFilters = false,
  onSortChange,
  onFilterChange
}: ProductGridProps) {
  
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterPrice, setFilterPrice] = useState<string>('all')

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products]
    
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      default:
        return sorted
    }
  }, [products, sortBy])

  // Filter products by price
  const filteredProducts = useMemo(() => {
    if (filterPrice === 'all') return sortedProducts
    
    const [min, max] = filterPrice.split('-').map(Number)
    return sortedProducts.filter(p => p.price >= min && p.price <= max)
  }, [sortedProducts, filterPrice])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    if (onSortChange) onSortChange(value)
  }

  const handleFilterChange = (value: string) => {
    setFilterPrice(value)
    if (onFilterChange) onFilterChange(value)
  }

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-600">
          Try adjusting your search or filter to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              aria-label="List view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold">{products.length}</span> products
          </div>
        </div>

        <div className="flex gap-3">
          {/* Price Filter */}
          {showFilters && (
            <select
              value={filterPrice}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Prices</option>
              <option value="0-25">Under $25</option>
              <option value="25-50">$25 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-999">$100+</option>
            </select>
          )}

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart(product)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4 flex gap-4 hover:shadow-lg transition">
              <div className="relative w-24 h-24 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg'
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold text-blue-600">${product.price}</span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}