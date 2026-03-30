'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound, useRouter } from 'next/navigation'
import ProductDetails from '@/components/products/product-details'
import { Product } from '@/types/product'
import { addToCart } from '@/lib/cart'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchProduct()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          notFound()
        }
        throw new Error('Failed to fetch product')
      }
      
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      alert('Product added to cart!')
      router.push('/cart')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/products">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-blue-600 transition">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
            </li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-blue-600 transition">
                Products
              </Link>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
            </li>
            <li>
              <span className="text-gray-800 font-semibold line-clamp-1 max-w-[200px]">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <ProductDetails 
          product={product} 
          onAddToCart={handleAddToCart}
        />

        {/* Product Recommendations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* You can add related products here */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-5xl mb-3">✨</div>
              <p className="text-gray-500">More recommendations coming soon</p>
            </div>
          </div>
        </div>

        {/* Recently Viewed Section (Optional) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Your recently viewed items will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'