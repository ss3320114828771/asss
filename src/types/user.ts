// User role types
export type UserRole = 'customer' | 'admin' | 'moderator'

// User status types
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'banned'

// Main User interface
export interface User {
  id: string
  email: string
  password: string // In production, this should be hashed and not exposed to client
  name?: string
  phone?: string
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  phoneVerified: boolean
  avatar?: string
  createdAt: Date | string
  updatedAt?: Date | string
  lastLogin?: Date | string
}

// User profile (without sensitive data)
export interface UserProfile {
  id: string
  email: string
  name?: string
  phone?: string
  role: UserRole
  avatar?: string
  emailVerified: boolean
  createdAt: Date | string
}

// User for authentication (without password)
export interface AuthUser {
  id: string
  email: string
  name?: string
  role: UserRole
}

// User registration input
export interface RegisterInput {
  email: string
  password: string
  confirmPassword: string
  name?: string
  phone?: string
  agreeTerms: boolean
}

// User login input
export interface LoginInput {
  email: string
  password: string
  rememberMe?: boolean
}

// User update input
export interface UpdateUserInput {
  name?: string
  phone?: string
  email?: string
  avatar?: string
}

// Password change input
export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Password reset input
export interface ResetPasswordInput {
  email: string
  token?: string
  newPassword?: string
  confirmPassword?: string
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  currency: string
  notifications: {
    email: boolean
    orderUpdates: boolean
    promotionalEmails: boolean
    sms: boolean
  }
  privacy: {
    showEmail: boolean
    showPhone: boolean
    twoFactorAuth: boolean
  }
}

// Address type
export interface Address {
  id: string
  userId: string
  type: 'shipping' | 'billing' | 'both'
  firstName: string
  lastName: string
  company?: string
  address: string
  address2?: string
  city: string
  state?: string
  zipCode: string
  country: string
  phone?: string
  isDefault: boolean
  createdAt: Date | string
  updatedAt?: Date | string
}

// Wishlist item
export interface WishlistItem {
  id: string
  userId: string
  productId: string
  addedAt: Date | string
}

// Cart item (client-side)
export interface CartItem {
  productId: string
  quantity: number
  name: string
  price: number
  image: string
}

// Session user (stored in localStorage/cookies)
export interface SessionUser {
  id: string
  email: string
  name?: string
  role: UserRole
  avatar?: string
}

// API response for auth
export interface AuthResponse {
  success: boolean
  user?: SessionUser
  token?: string
  message?: string
  error?: string
}

// Helper functions
export function isAdmin(user: User | SessionUser | null): boolean {
  return user?.role === 'admin'
}

export function isAuthenticated(user: User | SessionUser | null): boolean {
  return user !== null && user.id !== undefined
}

export function getUserDisplayName(user: User | SessionUser | null): string {
  if (!user) return 'Guest'
  return user.name || user.email.split('@')[0]
}

export function getUserInitials(user: User | SessionUser | null): string {
  if (!user) return 'G'
  if (user.name) {
    const nameParts = user.name.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return user.name[0].toUpperCase()
  }
  return user.email[0].toUpperCase()
}

export function getAvatarColor(user: User | SessionUser | null): string {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
  ]
  
  if (!user) return 'bg-gray-500'
  
  const index = user.id.length % colors.length
  return colors[index]
}

export function formatUserRole(role: UserRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export function formatUserStatus(status: UserStatus): string {
  const statusMap: Record<UserStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
    banned: 'Banned'
  }
  return statusMap[status]
}

export function getStatusColor(status: UserStatus): string {
  const colors: Record<UserStatus, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    banned: 'bg-red-100 text-red-800'
  }
  return colors[status]
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 4) {
    errors.push('Password must be at least 4 characters')
  }
  
  if (password.length > 50) {
    errors.push('Password must be less than 50 characters')
  }
  
  // Optional: Add more password strength checks
  // if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter')
  // if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number')
  // if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must contain at least one special character')
  
  return {
    isValid: errors.length === 0,
    errors
  }
}