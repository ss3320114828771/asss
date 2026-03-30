'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/products/product-grid'
import { Product } from '@/types/product'
import { addToCart } from '@/lib/cart'
import Link from 'next/link'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12
  })

  const currentSearch = searchParams.get('search') || ''
  const currentSort = searchParams.get('sort') || 'newest'
  const currentPage = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSearch, currentSort, currentPage])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (currentSearch) params.set('search', currentSearch)
      if (currentSort !== 'newest') params.set('sort', currentSort)
      params.set('page', currentPage.toString())
      
      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()
      
      setProducts(data.products || data)
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 12
      })
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    alert('Product added to cart!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-lg opacity-90">
            Discover our collection of high-quality Islamic products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <form action="/products" method="GET">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="search"
                      defaultValue={currentSearch}
                      placeholder="Search..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Go
                    </button>
                  </div>
                </form>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
                <div className="space-y-2">
                  <Link href="/products" className="block text-gray-600 hover:text-blue-600">
                    All Products
                  </Link>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Sort by</h3>
                <select
                  value={currentSort}
                  onChange={(e) => {
                    const url = new URL(window.location.href)
                    if (e.target.value !== 'newest') {
                      url.searchParams.set('sort', e.target.value)
                    } else {
                      url.searchParams.delete('sort')
                    }
                    window.location.href = url.toString()
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{products.length}</span> of{' '}
                <span className="font-semibold">{pagination.totalItems}</span> products
              </p>
            </div>

            <ProductGrid 
              products={products} 
              onAddToCart={handleAddToCart}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}