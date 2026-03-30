// ❌ Yeh line hata do
// import { User } from '@prisma/client'

// ✅ User type manually define karo
export type User = {
  id: string
  email: string
  password: string
  createdAt: Date | string
  name?: string
  phone?: string
}

export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      return JSON.parse(userStr)
    }
  }
  return null
}

export const setCurrentUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user))
  }
}

export const removeCurrentUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser')
  }
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}

export const isAdmin = (): boolean => {
  const user = getCurrentUser()
  return user?.email === 'admin@ecommerce.com'
}