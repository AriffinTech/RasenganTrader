import { NextResponse } from 'next/server'
import { getPublicClassSessions } from '@/lib/db/courses'
import { validateDiscountCode } from '@/lib/db/discounts'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { success } = rateLimit(ip, { windowMs: 60000, maxRequests: 20 })

    if (!success) {
      return NextResponse.json(
        { error: 'Terlalu banyak percubaan. Sila cuba sebentar lagi.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { code, offer } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Kod diskaun diperlukan' }, { status: 400 })
    }

    if (!offer || typeof offer !== 'string') {
      return NextResponse.json({ error: 'Pilihan tawaran diperlukan' }, { status: 400 })
    }

    // Find the session and base price
    const sessions = await getPublicClassSessions()
    const targetSession = sessions.find((s) => s.course?.slug === offer)

    if (!targetSession) {
      return NextResponse.json({ error: 'Tawaran tidak sah' }, { status: 400 })
    }

    const result = await validateDiscountCode(
      code,
      targetSession.price_cents,
      targetSession.course_id,
      targetSession.id
    )

    return NextResponse.json(result)
  } catch (err) {
    console.error('Validate Discount API Error:', err)
    return NextResponse.json({ error: 'Ralat pemprosesan sistem' }, { status: 500 })
  }
}
