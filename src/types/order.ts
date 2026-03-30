import { Product } from './product'

// Individual order item
export interface OrderItem {
  product: Product
  quantity: number
  price?: number // Price at time of purchase (optional, can use product.price)
}

// Shipping information
export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state?: string
  zipCode: string
  country: string
}

// Payment information
export interface PaymentInfo {
  method: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery'
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover'
  lastFourDigits?: string
  transactionId?: string
}

// Order status types
export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'confirmed' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'

// Main Order interface
export interface Order {
  id: string
  userId: string
  items: OrderItem[] | string
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  status: OrderStatus
  shippingInfo?: ShippingInfo
  paymentInfo?: PaymentInfo
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: Date | string
  updatedAt?: Date | string
}

// Order for API responses
export interface OrderResponse {
  success: boolean
  order?: Order
  orders?: Order[]
  message?: string
  error?: string
}

// Order creation input
export interface CreateOrderInput {
  userId: string
  items: OrderItem[]
  shippingInfo: ShippingInfo
  paymentInfo?: PaymentInfo
  notes?: string
}

// Order update input
export interface UpdateOrderInput {
  status?: OrderStatus
  trackingNumber?: string
  notes?: string
}

// Order statistics
export interface OrderStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
}

// Order filters for listing
export interface OrderFilters {
  status?: OrderStatus
  startDate?: Date | string
  endDate?: Date | string
  minTotal?: number
  maxTotal?: number
  search?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'total' | 'status'
  sortOrder?: 'asc' | 'desc'
}

// Order with user details (for admin)
export interface OrderWithUser extends Order {
  user: {
    id: string
    email: string
    name?: string
    phone?: string
  }
}

// Helper functions for orders
export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
}

export function calculateOrderSummary(items: OrderItem[]) {
  const subtotal = calculateOrderTotal(items)
  const shippingCost = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shippingCost + tax
  
  return {
    subtotal,
    shippingCost,
    tax,
    total
  }
}

export function formatOrderDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'confirmed':
      return 'bg-indigo-100 text-indigo-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'out_for_delivery':
      return 'bg-orange-100 text-orange-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'refunded':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getOrderStatusIcon(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return '⏳'
    case 'processing':
      return '⚙️'
    case 'confirmed':
      return '✓'
    case 'shipped':
      return '🚚'
    case 'out_for_delivery':
      return '🚛'
    case 'delivered':
      return '✅'
    case 'cancelled':
      return '❌'
    case 'refunded':
      return '💰'
    default:
      return '📦'
  }
}

export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'processing':
      return 'Processing'
    case 'confirmed':
      return 'Confirmed'
    case 'shipped':
      return 'Shipped'
    case 'out_for_delivery':
      return 'Out for Delivery'
    case 'delivered':
      return 'Delivered'
    case 'cancelled':
      return 'Cancelled'
    case 'refunded':
      return 'Refunded'
    default:
      return status
  }
}