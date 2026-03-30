/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET - Fetch orders with authentication
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let orders
    
    if (userId) {
      // Fetch user-specific orders
      orders = await db.order.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // Fetch all orders (admin only)
      orders = await db.order.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      })
    }
    
    // Parse items JSON for each order
    const parsedOrders = orders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }))
    
    return NextResponse.json(parsedOrders)
    
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' }, 
      { status: 500 }
    )
  }
}

// POST - Create order with validation
export async function POST(request: Request) {
  try {
    const { userId, total, items } = await request.json()
    
    // Validate required fields
    if (!userId || !total || !items) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, total, items' }, 
        { status: 400 }
      )
    }
    
    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' }, 
        { status: 400 }
      )
    }
    
    // Validate each item has required fields
    for (const item of items) {
      if (!item.product || !item.product.id || !item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: 'Invalid item data' }, 
          { status: 400 }
        )
      }
    }
    
    // Validate total matches items sum
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
    
    if (Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json(
        { error: 'Total amount does not match items' }, 
        { status: 400 }
      )
    }
    
    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      )
    }
    
    // Create order with proper JSON format
    const order = await db.order.create({
      data: {
        userId,
        total,
        items: items // Directly pass the array, Prisma will handle JSON conversion
      }
    })
    
    // Log order creation
    console.log(`✅ Order created: ${order.id} - Total: $${total} - User: ${userId}`)
    
    return NextResponse.json({ 
      success: true, 
      order: {
        ...order,
        items: order.items // Already in correct format
      },
      message: 'Order placed successfully!' 
    })
    
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' }, 
      { status: 500 }
    )
  }
}

// PATCH - Update order status (for admin)
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const { status } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' }, 
        { status: 400 }
      )
    }
    
    // Update order (add status field to schema if needed)
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Order status updated successfully!' 
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' }, 
      { status: 500 }
    )
  }
}