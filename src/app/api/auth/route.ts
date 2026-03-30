import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, action } = body
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' }, 
        { status: 400 }
      )
    }
    
    // Validate password length
    if (password.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters long' }, 
        { status: 400 }
      )
    }
    
    // REGISTER
    if (action === 'register') {
      // Check if user exists
      const existingUser = await db.user.findUnique({
        where: { email }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered. Please login instead.' }, 
          { status: 400 }
        )
      }
      
      // Create user (In production: hash password)
      const user = await db.user.create({
        data: {
          email,
          password, // TODO: Add password hashing
        }
      })
      
      return NextResponse.json({ 
        success: true,
        user: { 
          id: user.id, 
          email: user.email 
        },
        message: 'Registration successful! Please login.'
      })
    } 
    
    // LOGIN
    else if (action === 'login') {
      const user = await db.user.findUnique({
        where: { email }
      })
      
      if (!user) {
        return NextResponse.json(
          { error: 'No account found with this email' }, 
          { status: 401 }
        )
      }
      
      // Compare password (In production: use bcrypt.compare)
      if (user.password !== password) {
        return NextResponse.json(
          { error: 'Incorrect password' }, 
          { status: 401 }
        )
      }
      
      return NextResponse.json({ 
        success: true,
        user: { 
          id: user.id, 
          email: user.email 
        },
        message: 'Login successful!'
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action specified' }, 
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' }, 
      { status: 500 }
    )
  }
}