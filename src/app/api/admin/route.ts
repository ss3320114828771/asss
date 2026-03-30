import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Add a new product (Admin only)
export async function POST(request: Request) {
  try {
    const { name, price, image, description } = await request.json()
    
    // Validate required fields
    if (!name || !price || !image || !description) {
      return NextResponse.json(
        { error: 'All fields are required' }, 
        { status: 400 }
      )
    }
    
    // Create new product
    const product = await db.product.create({
      data: {
        name,
        price: parseFloat(price),
        image,
        description
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      product,
      message: 'Product added successfully!' 
    })
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' }, 
      { status: 500 }
    )
  }
}

// GET - Get all products (Admin view)
export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    )
  }
}

// DELETE - Delete a product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      )
    }
    
    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id }
    })
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      )
    }
    
    // Delete product
    await db.product.delete({
      where: { id }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully!' 
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' }, 
      { status: 500 }
    )
  }
}

// PUT - Update a product (Optional - for editing products)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const { name, price, image, description } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      )
    }
    
    // Update product
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        name: name || undefined,
        price: price ? parseFloat(price) : undefined,
        image: image || undefined,
        description: description || undefined
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      product: updatedProduct,
      message: 'Product updated successfully!' 
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' }, 
      { status: 500 }
    )
  }
}