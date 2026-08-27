import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { success } = rateLimit(ip, { windowMs: 60000, maxRequests: 5 })
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const { name, email, phone, telegram, offer } = body

    // Determine price based on offer type
    let amount = 0
    if (offer === 'course') {
      amount = 49900 // RM499.00 in cents
    } else if (offer === 'coaching') {
      amount = 160000 // RM1,600.00 in cents
    } else {
      return NextResponse.json({ error: 'Invalid offer selected' }, { status: 400 })
    }

    const description = `Pendaftaran RasenganTrader: ${offer.toUpperCase()} (${telegram})`

    const billplzUrl = process.env.BILLPLZ_API_URL || 'https://www.billplz-sandbox.com/api/v3'
    const secretKey = process.env.BILLPLZ_SECRET_KEY
    const collectionId = process.env.BILLPLZ_COLLECTION_ID

    if (!secretKey || !collectionId) {
      console.error('Missing Billplz credentials')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`

    const billData = {
      collection_id: collectionId,
      description: description,
      email: email,
      name: name,
      mobile: phone,
      amount: amount,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhook/billplz`,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/terima-kasih?status=success`,
      reference_1_label: 'Telegram',
      reference_1: telegram,
      reference_2_label: 'Offer',
      reference_2: offer,
    }

    const response = await fetch(`${billplzUrl}/bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(billData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Billplz API Error:', errorText)
      return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 })
    }

    const data = await response.json()

    return NextResponse.json({ url: data.url, id: data.id })
  } catch (error) {
    console.error('Create Bill Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
