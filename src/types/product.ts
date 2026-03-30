export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category?: string
  stock?: number
  rating?: number
  reviews?: number
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface ProductWithQuantity extends Product {
  quantity: number
}

export interface ProductCreateInput {
  name: string
  price: number
  image: string
  description: string
  category?: string
  stock?: number
}

export interface ProductUpdateInput {
  name?: string
  price?: number
  image?: string
  description?: string
  category?: string
  stock?: number
}

export interface CartItem {
  product: Product
  quantity: number
}