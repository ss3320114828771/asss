'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/button'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    agreeTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 4) strength++
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    const strengths = [
      { strength: 0, label: 'Very Weak', color: 'bg-red-500' },
      { strength: 1, label: 'Weak', color: 'bg-orange-500' },
      { strength: 2, label: 'Fair', color: 'bg-yellow-500' },
      { strength: 3, label: 'Good', color: 'bg-blue-500' },
      { strength: 4, label: 'Strong', color: 'bg-green-500' },
      { strength: 5, label: 'Very Strong', color: 'bg-green-600' }
    ]
    
    return strengths[strength] || strengths[0]
  }

  const passwordStrength = getPasswordStrength()

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters long')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms and Conditions')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password, 
          action: 'register',
          name: formData.name 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting...')
        localStorage.setItem('currentUser', JSON.stringify(data.user))
        document.cookie = `auth=true; path=/`
        setTimeout(() => router.push('/'), 2000)
      } else {
        setError(data.error || 'Registration failed. Please try again.')
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🕌</div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join us to start shopping for quality Islamic products</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name (Optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Strength: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
                I agree to the Terms and Conditions and Privacy Policy
              </label>
            </div>
          </div>

          <Button type="submit" disabled={loading} fullWidth size="lg">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-800 text-center mb-2">
            Benefits of joining:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>✓ Track orders</div>
            <div>✓ Save favorites</div>
            <div>✓ Fast checkout</div>
            <div>✓ Exclusive offers</div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        </div>
      </div>
    </div>
  )
}