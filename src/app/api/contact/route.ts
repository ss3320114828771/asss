import { NextResponse } from 'next/server'

// Simple in-memory rate limiting (for demo purposes)
// In production, use Redis or database
const rateLimit = new Map()

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()
    
    // Rate limiting - prevent spam
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxRequests = 3 // 3 requests per 15 minutes
    
    const userRequests = rateLimit.get(ip) || []
    const recentRequests = userRequests.filter((time: number) => now - time < windowMs)
    
    if (recentRequests.length >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' }, 
        { status: 429 }
      )
    }
    
    recentRequests.push(now)
    rateLimit.set(ip, recentRequests)
    
    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' }, 
        { status: 400 }
      )
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' }, 
        { status: 400 }
      )
    }
    
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' }, 
        { status: 400 }
      )
    }
    
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' }, 
        { status: 400 }
      )
    }
    
    // Log the message
    console.log(`
    ========================================
    📧 CONTACT FORM SUBMISSION
    ========================================
    Name: ${name}
    Email: ${email}
    Message: ${message}
    ========================================
    Sent to: sajidsyedhafizsajidsyed@gmail.com
    ========================================
    `)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully! We will contact you soon.' 
    })
    
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json(
      { error: 'Server error. Please try again.' }, 
      { status: 500 }
    )
  }
}