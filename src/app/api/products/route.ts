import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

// Define types
type WhereClause = Prisma.ProductWhereInput

interface OrderBy {
  price?: 'asc' | 'desc'
  name?: 'asc' | 'desc'
  createdAt?: 'asc' | 'desc'
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'newest'
    
    const skip = (page - 1) * limit
    
    // Build where clause with proper type
    const whereClause: WhereClause = {}
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: search, mode: Prisma.QueryMode.insensitive } }
      ]
    }
    
    if (minPrice || maxPrice) {
      whereClause.price = {}
      if (minPrice) whereClause.price.gte = parseFloat(minPrice)
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice)
    }
    
    // Build order by with proper type
    let orderBy: OrderBy = { createdAt: 'desc' }
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'name_asc':
        orderBy = { name: 'asc' }
        break
      case 'name_desc':
        orderBy = { name: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
    }
    
    const products = await db.product.findMany({
      where: whereClause,
      orderBy: orderBy,
      skip: skip,
      take: limit
    })
    
    const total = await db.product.count({
      where: whereClause
    })
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', success: false }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, image, description } = await request.json()
    
    if (!name || !price || !image || !description) {
      return NextResponse.json(
        { error: 'All fields are required', success: false }, 
        { status: 400 }
      )
    }
    
    const numericPrice = parseFloat(price)
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { error: 'Invalid price', success: false }, 
        { status: 400 }
      )
    }
    
    const product = await db.product.create({
      data: {
        name: name.trim(),
        price: numericPrice,
        image: image.trim(),
        description: description.trim()
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      product,
      message: 'Product created successfully!' 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product', success: false }, 
      { status: 500 }
    )
  }
}