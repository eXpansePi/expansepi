import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create email content
    const emailContent = `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `.trim()

    // Try to send email using Resend if API key is configured
    if (resend && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@expansepi.com',
          to: 'info@expansepi.com',
          subject: `Contact Form: ${subject}`,
          text: emailContent,
          replyTo: email,
        })

        return NextResponse.json(
          { 
            success: true,
            message: 'Email sent successfully'
          },
          { status: 200 }
        )
      } catch (emailError) {
        console.error('Error sending email via Resend:', emailError)
        // Fall through to mailto fallback
      }
    }

    // Fallback to mailto link if Resend is not configured
    return NextResponse.json(
      { 
        success: true,
        message: 'Email prepared successfully',
        // Return mailto link for client-side handling
        mailtoLink: `mailto:info@expansepi.com?subject=${encodeURIComponent(`Contact Form: ${subject}`)}&body=${encodeURIComponent(emailContent)}`
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

