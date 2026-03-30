'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, isAuthenticated } from '@/lib/auth'
import Button from '@/components/ui/button'

// Define extended user type with optional fields
interface ExtendedUser {
  id: string
  email: string
  password: string
  createdAt: Date | string
  name?: string
  phone?: string
}

interface UserSettings {
  // Account Settings
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
  
  // Profile Settings
  name: string
  phone: string
  
  // Notification Settings
  emailNotifications: boolean
  orderUpdates: boolean
  promotionalEmails: boolean
  
  // Privacy Settings
  twoFactorAuth: boolean
  savePaymentInfo: boolean
}

export default function SettingsPage() {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'account' | 'profile' | 'notifications' | 'privacy'>('account')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    name: '',
    phone: '',
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    twoFactorAuth: false,
    savePaymentInfo: true
  })

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    // Load user data
    const currentUser = getCurrentUser() as ExtendedUser | null
    if (currentUser) {
      setUser(currentUser)
      setSettings(prev => ({
        ...prev,
        email: currentUser.email || '',
        name: currentUser.name || '',
        phone: currentUser.phone || ''
      }))
    }

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(prev => ({ ...prev, ...parsed }))
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear messages when user makes changes
    setSuccessMessage('')
    setErrorMessage('')
  }

  const validatePasswordChange = () => {
    if (!settings.currentPassword && !settings.newPassword && !settings.confirmPassword) {
      return true // No password change requested
    }

    if (!settings.currentPassword) {
      setErrorMessage('Current password is required to change password')
      return false
    }

    if (!settings.newPassword) {
      setErrorMessage('New password is required')
      return false
    }

    if (settings.newPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters')
      return false
    }

    if (settings.newPassword !== settings.confirmPassword) {
      setErrorMessage('New passwords do not match')
      return false
    }

    return true
  }

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    if (!validatePasswordChange()) {
      setLoading(false)
      return
    }

    try {
      // Update email if changed
      if (settings.email !== user?.email) {
        // Update in localStorage
        const updatedUser: ExtendedUser = { 
          ...user, 
          email: settings.email,
          id: user?.id || '',
          password: user?.password || '',
          createdAt: user?.createdAt || new Date()
        }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        setUser(updatedUser)
      }

      // Update password (in real app, would call API)
      if (settings.newPassword) {
        console.log('Password updated')
      }

      setSuccessMessage('Account settings updated successfully!')
      
      // Clear password fields
      setSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))

      // Save settings to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings))
      
    } catch {
      setErrorMessage('Failed to update settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // Update user in localStorage
      const updatedUser: ExtendedUser = { 
        ...user,
        name: settings.name,
        phone: settings.phone,
        id: user?.id || '',
        email: user?.email || '',
        password: user?.password || '',
        createdAt: user?.createdAt || new Date()
      }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setUser(updatedUser)

      setSuccessMessage('Profile updated successfully!')
      
      // Save settings
      localStorage.setItem('userSettings', JSON.stringify(settings))
      
    } catch {
      setErrorMessage('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // Save notification preferences
      localStorage.setItem('userSettings', JSON.stringify(settings))
      setSuccessMessage('Notification preferences updated successfully!')
    } catch {
      setErrorMessage('Failed to update preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePrivacy = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // Save privacy settings
      localStorage.setItem('userSettings', JSON.stringify(settings))
      setSuccessMessage('Privacy settings updated successfully!')
    } catch {
      setErrorMessage('Failed to update privacy settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: '🔐' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🛡️' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'account' | 'profile' | 'notifications' | 'privacy')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Account Settings */}
      {activeTab === 'account' && (
        <form onSubmit={handleUpdateAccount} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Account Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your email address is used for login and notifications
                </p>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Change Password</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={settings.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={settings.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={settings.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for order updates and delivery notifications
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleUpdateNotifications} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-800">Order Updates</p>
                  <p className="text-sm text-gray-500">Get notifications about your order status</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="orderUpdates"
                    checked={settings.orderUpdates}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Promotional Emails</p>
                  <p className="text-sm text-gray-500">Receive offers, new products, and deals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="promotionalEmails"
                    checked={settings.promotionalEmails}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Privacy Settings */}
      {activeTab === 'privacy' && (
        <form onSubmit={handleUpdatePrivacy} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Privacy & Security</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Save Payment Information</p>
                  <p className="text-sm text-gray-500">Securely store payment details for faster checkout</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="savePaymentInfo"
                    checked={settings.savePaymentInfo}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ For security reasons, important account changes may require email verification.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Danger Zone */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6 border border-red-200">
        <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
              alert('Account deletion would be implemented here')
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>

      {/* Islamic Blessing */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
      </div>
    </div>
  )
}