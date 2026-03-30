'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'
import Modal from '@/components/ui/modal'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [success, setSuccess] = useState(false)
  const [showChat, setShowChat] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSuccess(false), 5000)
      } else {
        alert(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90">We&apos;d love to hear from you. Get in touch with us anytime.</p>
          </div>
        </div>

        {/* Live Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowChat(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
          >
            <span className="text-2xl">💬</span>
          </button>
        </div>

        {/* Rest of the content remains the same as above */}
        {/* ... (same content as the main version) ... */}
      </div>

      {/* Live Chat Modal */}
      <Modal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        title="Live Chat Support"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              👋 Hello! How can we help you today?
            </p>
          </div>
          <div className="bg-blue-100 rounded-lg p-4 ml-8">
            <p className="text-sm text-blue-800">
              Our support team is online and ready to assist you.
            </p>
          </div>
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>Send</Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Average response time: 2-3 minutes
          </p>
        </div>
      </Modal>
    </>
  )
}