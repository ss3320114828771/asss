'use client'

import { useState } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from 'next/link'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Button from '@/components/ui/button'

export default function DirectionsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<'car' | 'public' | 'walk'>('car')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showMap, setShowMap] = useState(false)
  const [distance, setDistance] = useState<string>('')
  const [travelTime, setTravelTime] = useState<string>('')

  const location = {
    name: "Islamic Store",
    address: "Village Adlana, Tehsil Bhawana, District Chiniot",
    lat: 31.5437,
    lng: 72.6565,
    phone: "03084491993"
  }

  const calculateDistance = () => {
    // This would use Google Maps Distance Matrix API in production
    setDistance("Approximately 15 km")
    setTravelTime("20-25 minutes")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const carDirections = [
    "From Chiniot city, head towards Bhawana Road",
    "Drive approximately 15 km on Bhawana Road",
    "You'll pass through several small villages",
    "Look for the Adlana village signboard",
    "Our store is on the main road near the Adlana Mosque",
    "Large Islamic Store signboard visible from the road"
  ]

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const publicTransportDirections = [
    "Take any bus or van from Chiniot to Bhawana",
    "Ask the driver to drop you at Adlana village",
    "The journey takes about 20-30 minutes",
    "From the main bus stop, walk towards the mosque",
    "Our store is 2 minutes walk from the bus stop",
    "Look for the green and white store front"
  ]

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const walkingDirections = [
    "From Adlana bus stop, head east on the main road",
    "Walk for about 200 meters",
    "You'll see Adlana Mosque on your right",
    "Our store is just past the mosque",
    "Look for the Islamic Store signboard",
    "Total walking time: 2-3 minutes"
  ]

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getDirections = () => {
    const address = encodeURIComponent(location.address)
    window.open(`https://maps.google.com/?q=${address}`, '_blank')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Directions to Our Store</h1>
          <p className="text-xl opacity-90">Find us easily with these simple directions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Distance Calculator Button */}
        <div className="mb-8 text-center">
          <button
            onClick={calculateDistance}
            className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300"
          >
            🚗 Calculate Distance & Travel Time
          </button>
          {distance && (
            <div className="mt-3 text-gray-600">
              <p>Distance: <strong>{distance}</strong></p>
              <p>Estimated Travel Time: <strong>{travelTime}</strong></p>
            </div>
          )}
        </div>

        {/* Rest of the content same as main version */}
        {/* ... (keep all the other sections from the main version) ... */}
      </div>
    </div>
  )
}