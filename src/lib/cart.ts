interface CartItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any
  quantity: number
}

export const getCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  }
  return []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addToCart = (product: any) => {
  const cart = getCart()
  const existingItem = cart.find(item => item.product.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ product, quantity: 1 })
  }
  
  localStorage.setItem('cart', JSON.stringify(cart))
}

export const removeFromCart = (productId: string) => {
  const cart = getCart()
  const filteredCart = cart.filter(item => item.product.id !== productId)
  localStorage.setItem('cart', JSON.stringify(filteredCart))
}

export const updateQuantity = (productId: string, quantity: number) => {
  const cart = getCart()
  const item = cart.find(item => item.product.id === productId)
  
  if (item) {
    item.quantity = quantity
    localStorage.setItem('cart', JSON.stringify(cart))
  }
}

export const clearCart = () => {
  localStorage.removeItem('cart')
}

export const getCartTotal = (): number => {
  const cart = getCart()
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
}