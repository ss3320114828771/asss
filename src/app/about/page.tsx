import React from 'react'
// Link is not used, so we remove it

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-xl text-gray-600">Your trusted Islamic store for quality products</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We strive to provide high-quality products that align with Islamic values while ensuring customer satisfaction and excellent service.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the leading online store for Islamic products, serving customers worldwide with integrity and excellence.
            </p>
          </div>
        </div>

        {/* Importance of Health Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-16 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Importance of Health in Islam</h2>
          <p className="text-gray-600 leading-relaxed">
            Islam emphasizes the importance of maintaining good health. The Prophet Muhammad (peace be upon him) said: 
            <em className="block mt-2 italic text-gray-700">
              &quot;A strong believer is better and more beloved to Allah than a weak believer, while there is good in both.&quot;
            </em> 
            (Sahih Muslim). We believe that physical well-being is essential for spiritual growth and fulfilling our duties as Muslims. 
            Therefore, we encourage our customers to maintain a healthy lifestyle through balanced nutrition, regular exercise, and proper rest.
          </p>
        </div>

        {/* Why Choose Us */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">All products are carefully selected for quality and authenticity</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive prices with regular discounts and offers</p>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Store Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><strong>Owner:</strong> Hafiz Sajid Syed</p>
              <p className="text-gray-600"><strong>Phone:</strong> 03084491993</p>
              <p className="text-gray-600"><strong>Email:</strong> sajidsyedhafizsajidsyed@gmail.com</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Address:</strong> Village Adlana, Tehsil Bhawana, District Chiniot</p>
            </div>
          </div>
        </div>

        {/* Islamic Blessing */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        </div>
      </div>
    </div>
  )
}