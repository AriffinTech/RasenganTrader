import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getPublicClassSessions } from '@/lib/db/courses'
import { validateDiscountCode } from '@/lib/db/discounts'
import { registrationOffers, type RegistrationOfferKey } from '@/lib/course'
import { recordSuccessfulPayment } from '@/lib/payments'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { success } = rateLimit(ip, { windowMs: 60000, maxRequests: 5 })

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, phone, telegram, offer, discountCode } = body

    if (
      typeof name !== 'string' || name.trim().length < 2 || name.length > 120 ||
      typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof phone !== 'string' || phone.trim().length < 5 || phone.length > 40 ||
      typeof telegram !== 'string' || telegram.trim().length < 2 || telegram.length > 80
    ) {
      return NextResponse.json({ error: 'Invalid registration details' }, { status: 400 })
    }

    // 1. Fetch dynamic class session and price
    const sessions = await getPublicClassSessions()
    const targetSession = sessions.find((s) => s.course?.slug === offer)

    if (!targetSession) {
      return NextResponse.json({ error: 'Invalid offer selected' }, { status: 400 })
    }

    // 2. Lifecycle & status validation
    if (targetSession.status === 'upcoming') {
      return NextResponse.json(
        { error: 'Pendaftaran belum dibuka untuk sesi ini.' },
        { status: 409 }
      )
    }

    if (targetSession.status === 'closed' || targetSession.status === 'archived') {
      return NextResponse.json(
        { error: 'Pendaftaran untuk kelas ini telah ditutup.' },
        { status: 400 }
      )
    }

    // Base price in cents
    let finalAmount = targetSession.price_cents
    let appliedDiscountCode: string | null = null

    // 3. Discount Code validation
    if (discountCode && typeof discountCode === 'string' && discountCode.trim()) {
      const discountResult = await validateDiscountCode(
        discountCode,
        targetSession.price_cents,
        targetSession.course_id,
        targetSession.id
      )

      if (!discountResult.valid) {
        return NextResponse.json(
          { error: discountResult.message || 'Kod diskaun tidak sah' },
          { status: 400 }
        )
      }

      finalAmount = discountResult.finalPriceCents ?? finalAmount
      appliedDiscountCode = discountResult.code ?? null
    }

    const courseTitle =
      targetSession.course?.title ||
      (offer in registrationOffers
        ? registrationOffers[offer as RegistrationOfferKey].title
        : offer)

    const description = `Pendaftaran RasenganTrader: ${courseTitle} (${telegram})${
      appliedDiscountCode ? ` [KOD: ${appliedDiscountCode}]` : ''
    }`

    // Derive app URL: prefer env var, then auto-detect from request headers
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get('origin') ||
      (request.headers.get('host')
        ? `https://${request.headers.get('host')}`
        : 'http://localhost:3000')

    // 4. Handle 100% Free Discount Code bypass
    if (finalAmount === 0) {
      const freeBillId = `FREE-${Date.now()}`
      await recordSuccessfulPayment({
        billId: freeBillId,
        paidAmountCents: 0,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        reference1: telegram,
        reference2: offer,
        discountCode: appliedDiscountCode,
        description,
        paidAt: new Date().toISOString(),
        rawMetadata: { offer, free_pass: true, discount_code: appliedDiscountCode },
      })

      return NextResponse.json({
        url: `${appUrl}/terima-kasih?status=success&offer=${encodeURIComponent(
          offer
        )}&name=${encodeURIComponent(name)}&telegram=${encodeURIComponent(telegram)}${
          appliedDiscountCode ? `&code=${encodeURIComponent(appliedDiscountCode)}` : ''
        }`,
        id: freeBillId,
      })
    }

    // 5. Billplz Bill Creation
    const billplzUrl = process.env.BILLPLZ_API_URL || 'https://www.billplz-sandbox.com/api/v3'
    const secretKey = process.env.BILLPLZ_SECRET_KEY
    const collectionId = process.env.BILLPLZ_COLLECTION_ID

    if (!secretKey || !collectionId) {
      console.error('Missing Billplz credentials')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`

    const redirectUrl = `${appUrl}/terima-kasih?offer=${encodeURIComponent(offer)}${
      appliedDiscountCode ? `&code=${encodeURIComponent(appliedDiscountCode)}` : ''
    }`
    const reference2Value = appliedDiscountCode ? `${offer}|${appliedDiscountCode}` : offer

    const billData = {
      collection_id: collectionId,
      description: description,
      email: email,
      name: name,
      mobile: phone,
      amount: finalAmount,
      callback_url: `${appUrl}/api/webhook/billplz`,
      redirect_url: redirectUrl,
      reference_1_label: 'Telegram',
      reference_1: telegram,
      reference_2_label: 'Offer',
      reference_2: reference2Value,
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

    // Record pending transaction in Supabase with discount code metadata
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin')
      const adminSupabase = createAdminClient()
      await adminSupabase.from('payment_transactions').insert({
        bill_id: data.id,
        status: 'pending',
        amount_cents: finalAmount,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        reference_1: telegram,
        reference_2: reference2Value,
        metadata: {
          offer,
          discount_code: appliedDiscountCode,
          billplz_url: data.url,
          description,
        },
        processed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
    } catch (txErr) {
      console.warn('Failed to insert pending payment_transaction:', txErr)
    }

    return NextResponse.json({ url: data.url, id: data.id })
  } catch (error) {
    console.error('Create Bill Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
