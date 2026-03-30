import prisma from '@/lib/db'  // Fixed import
import Link from 'next/link'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image'
import ProductGrid from '@/components/products/product-grid'
import { Metadata } from 'next'
import Button from '@/components/ui/button'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Islamic Store - Quality Islamic Products',
  description: 'Shop high-quality Islamic products including prayer mats, Quran, books, perfumes, and more. Free shipping on orders over $50.',
  keywords: 'islamic store, prayer mat, quran, islamic books, muslim products',
  openGraph: {
    title: 'Islamic Store - Quality Islamic Products',
    description: 'Shop high-quality Islamic products online',
    images: ['/og-image.jpg'],
  },
}

// Generate star positions at build time instead of during render
const generateStars = () => {
  const stars = []
  for (let i = 0; i < 50; i++) {
    stars.push({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    })
  }
  return stars
}

// Pre-generate stars at build time
const stars = generateStars()

// Fetch featured products
async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 8,
      orderBy: {
        createdAt: 'desc'
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

// Fetch categories for the category section
const categories = [
  { name: 'Prayer Mats', icon: '🕌', href: '/products?category=prayer-mats', color: 'from-green-500 to-emerald-500' },
  { name: 'Quran & Books', icon: '📖', href: '/products?category=books', color: 'from-blue-500 to-indigo-500' },
  { name: 'Perfumes', icon: '🌸', href: '/products?category=perfumes', color: 'from-purple-500 to-pink-500' },
  { name: 'Home Decor', icon: '🏠', href: '/products?category=decor', color: 'from-orange-500 to-red-500' },
  { name: 'Gifts', icon: '🎁', href: '/products?category=gifts', color: 'from-yellow-500 to-orange-500' },
  { name: 'Accessories', icon: '💍', href: '/products?category=accessories', color: 'from-cyan-500 to-blue-500' },
]

// Testimonials
const testimonials = [
  {
    name: 'Ahmed Khan',
    role: 'Regular Customer',
    text: 'Excellent quality products! The prayer mat I ordered is beautiful and durable. Highly recommended!',
    rating: 5,
    image: '/avatar1.jpg'
  },
  {
    name: 'Fatima Zahra',
    role: 'First Time Buyer',
    text: 'Great customer service and fast delivery. The Quran I received was in perfect condition. JazakAllah khair!',
    rating: 5,
    image: '/avatar2.jpg'
  },
  {
    name: 'Omar Hussain',
    role: 'Business Owner',
    text: 'I purchase all my Islamic products from here. Consistent quality and reasonable prices.',
    rating: 5,
    image: '/avatar3.jpg'
  },
]

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white overflow-hidden">
        {/* Animated background stars - using pre-generated stars */}
        <div className="absolute inset-0 overflow-hidden">
          {stars.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                left: `${star.left}%`,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 glow-text">
                Welcome to Islamic Store
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Discover authentic Islamic products that enrich your spiritual journey. Quality items at affordable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/products">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex gap-6 justify-center md:justify-start">
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm opacity-80">Happy Customers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">100+</p>
                  <p className="text-sm opacity-80">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm opacity-80">5-Star Reviews</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="relative h-80 w-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-8">
                  <div className="text-center">
                    <span className="text-8xl">🕌</span>
                    <p className="mt-4 text-lg font-semibold">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best Islamic products with exceptional service and quality
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">All products are carefully selected and inspected for quality</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on all orders over $50</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy for your peace of mind</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most popular and highly recommended products
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <ProductGrid 
              products={featuredProducts} 
              onAddToCart={() => {}} 
              loading={false}
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No products available yet. Check back soon!</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you&apos;re looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${category.color} p-6 text-center text-white hover:scale-105 transition-transform duration-300`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Join thousands of satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">&quot;{testimonial.text}&quot;</p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 opacity-90">Discover quality Islamic products at affordable prices</p>
          <Link href="/products">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Islamic Blessing */}
      <div className="bg-gray-900 text-white py-4 text-center">
        <p className="text-sm opacity-75">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        <p className="text-xs opacity-50 mt-1">May Allah bless your shopping experience</p>
      </div>
    </div>
  )
}