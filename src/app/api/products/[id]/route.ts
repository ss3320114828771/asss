import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch a single product by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      )
    }
    
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

// PUT - Update a product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, price, image, description } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      )
    }
    
    const existingProduct = await db.product.findUnique({
      where: { id }
    })
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      )
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (price !== undefined) updateData.price = parseFloat(price)
    if (image !== undefined) updateData.image = image
    if (description !== undefined) updateData.description = description
    
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

// DELETE - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      )
    }
    
    const existingProduct = await db.product.findUnique({
      where: { id }
    })
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      )
    }
    
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