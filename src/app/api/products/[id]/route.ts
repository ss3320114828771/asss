import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'

// GET - Fetch a single product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Validate ID format
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid product ID' }, 
        { status: 400 }
      )
    }
    
    // Fetch product
    const product = await db.product.findUnique({
      where: { id }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
    
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' }, 
      { status: 500 }
    )
  }
}

// PUT - Update a product (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Check admin authentication
    if (!isAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' }, 
        { status: 401 }
      )
    }
    
    const { name, price, image, description } = await request.json()
    
    // Validate ID
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
    
    // Validate input data
    if (name !== undefined && name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Product name must be at least 2 characters' }, 
        { status: 400 }
      )
    }
    
    if (price !== undefined && (isNaN(price) || price <= 0)) {
      return NextResponse.json(
        { error: 'Price must be a positive number' }, 
        { status: 400 }
      )
    }
    
    if (image !== undefined && !image.startsWith('/') && !image.startsWith('http')) {
      return NextResponse.json(
        { error: 'Image URL must be a valid path' }, 
        { status: 400 }
      )
    }
    
    if (description !== undefined && description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' }, 
        { status: 400 }
      )
    }
    
    // Prepare update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (price !== undefined) updateData.price = parseFloat(price)
    if (image !== undefined) updateData.image = image.trim()
    if (description !== undefined) updateData.description = description.trim()
    
    // Update product
    const updatedProduct = await db.product.update({
      where: { id },
      data: updateData
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

// DELETE - Delete a product (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Check admin authentication
    if (!isAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' }, 
        { status: 401 }
      )
    }
    
    // Validate ID
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