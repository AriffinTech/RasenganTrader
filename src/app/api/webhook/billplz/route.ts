import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { recordSuccessfulPayment } from '@/lib/payments'

// In-memory fallback set for idempotency tracking (in case database is unreachable)
const processedBillsFallback = new Set<string>()

export async function POST(request: Request) {
  try {
    // 1. Parse incoming data from Billplz
    // Billplz sends webhook as x-www-form-urlencoded
    const formData = await request.formData()
    const data = Object.fromEntries(formData.entries())

    // 2. Verify X-Signature
    // The X-Signature string format: <key><value>|...
    // Example: amount1000|collection_id...
    
    // Sort keys alphabetically case-insensitively (excluding x_signature)
    const keys = Object.keys(data)
      .filter((key) => key !== 'x_signature')
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    
    let signatureString = ''
    for (const key of keys) {
      signatureString += `${key}${data[key]}`
      if (key !== keys[keys.length - 1]) {
        signatureString += '|'
      }
    }

    const xSignatureKey = process.env.BILLPLZ_X_SIGNATURE
    if (!xSignatureKey) {
      console.error('Missing X-Signature Key')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', xSignatureKey)
      .update(signatureString)
      .digest('hex')

    if (expectedSignature !== data.x_signature) {
      console.error('Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const billId = String(data.id || '').trim()
    if (!billId) {
      return NextResponse.json({ error: 'Missing bill id' }, { status: 400 })
    }

    // 3. Process the payment status
    if (data.state === 'paid') {
      console.log(`[Billplz Webhook] Payment confirmed for Bill ID: ${billId}`)

      await recordSuccessfulPayment({
        billId,
        paidAmountCents: Math.round(Number(data.amount) || 0),
        customerName: typeof data.name === 'string' ? data.name : null,
        customerEmail: typeof data.email === 'string' ? data.email : null,
        customerPhone: typeof data.mobile === 'string' ? data.mobile : null,
        reference1: typeof data.reference_1 === 'string' ? data.reference_1 : null,
        reference2: typeof data.reference_2 === 'string' ? data.reference_2 : null,
        description: typeof data.description === 'string' ? data.description : null,
        paidAt: typeof data.paid_at === 'string' ? data.paid_at : null,
        rawMetadata: {
          source: 'billplz_webhook',
          url: data.url || null,
          state: data.state,
        },
      })

      processedBillsFallback.add(billId)
    } else {
      console.log(`[Billplz Webhook] Payment state not paid for Bill ID ${billId}: ${data.state}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
