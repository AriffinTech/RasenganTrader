import { NextResponse } from 'next/server'
import crypto from 'crypto'

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
    
    // Sort keys alphabetically (excluding x_signature)
    const keys = Object.keys(data).filter(key => key !== 'x_signature').sort()
    
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

    // 3. Enforce Idempotency
    // Check if the bill_id has already been processed in payment_transactions or memory fallback
    let alreadyProcessed = processedBillsFallback.has(billId)
    let adminSupabase: any = null

    try {
      const { createAdminClient } = await import('@/lib/supabase/admin')
      adminSupabase = createAdminClient()
    } catch (e) {
      console.warn('Supabase admin client not initialized for webhook idempotency check:', e)
    }

    if (!alreadyProcessed && adminSupabase) {
      try {
        const { data: existingTx, error: txQueryError } = await adminSupabase
          .from('payment_transactions')
          .select('id, bill_id, status')
          .eq('bill_id', billId)
          .maybeSingle()

        if (!txQueryError && existingTx) {
          alreadyProcessed = true
          processedBillsFallback.add(billId)
        }
      } catch (err) {
        console.error('Error checking payment_transactions table for idempotency:', err)
      }
    }

    if (alreadyProcessed) {
      console.log(`[Billplz Webhook] Bill ID ${billId} has already been processed. Skipping duplicate webhook execution.`)
      return NextResponse.json({ received: true, skipped: true, message: 'Already processed' })
    }

    // 4. Process the payment status
    if (data.state === 'paid') {
      console.log(`Payment successful for Bill ID: ${billId}`)
      
      // Update discount code times_used if applied
      const desc = typeof data.description === 'string' ? data.description : ''
      const promoMatch = desc.match(/\[KOD:\s*([^\]]+)\]/)
      if (promoMatch && promoMatch[1] && adminSupabase) {
        const code = promoMatch[1].trim().toUpperCase()
        try {
          const { data: disc } = await adminSupabase
            .from('discount_codes')
            .select('id, times_used')
            .eq('code', code)
            .maybeSingle()
          if (disc) {
            await adminSupabase
              .from('discount_codes')
              .update({ times_used: (disc.times_used || 0) + 1 })
              .eq('id', disc.id)
          }
        } catch (e) {
          console.error('Failed to increment discount code usage:', e)
        }
      }

      // Send Telegram Notification
      const botToken = process.env.TELEGRAM_BOT_TOKEN
      const chatId = process.env.TELEGRAM_CHAT_ID

      if (botToken && chatId) {
        const message = `✅ *Bayaran Berjaya (Billplz)*\n\nNama: ${data.name}\nEmail: ${data.email}\nPhone: ${data.mobile}\nTelegram: ${data.reference_1}\nProduk: ${data.reference_2}\nJumlah: RM${(Number(data.amount) / 100).toFixed(2)}\nBil ID: ${billId}`

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        }).catch(err => console.error('Telegram API Error:', err))
      }

      // Record transaction in payment_transactions to ensure webhook retries are skipped safely
      if (adminSupabase) {
        try {
          const amountCents = Math.round(Number(data.amount) || 0)
          const { error: insertTxError } = await adminSupabase
            .from('payment_transactions')
            .insert({
              bill_id: billId,
              status: 'paid',
              amount_cents: amountCents,
              customer_name: typeof data.name === 'string' ? data.name : null,
              customer_email: typeof data.email === 'string' ? data.email : null,
              customer_phone: typeof data.mobile === 'string' ? data.mobile : null,
              reference_1: typeof data.reference_1 === 'string' ? data.reference_1 : null,
              reference_2: typeof data.reference_2 === 'string' ? data.reference_2 : null,
              metadata: {
                paid_at: data.paid_at || new Date().toISOString(),
                url: data.url || null,
                description: data.description || null,
                state: data.state,
              },
              processed_at: new Date().toISOString(),
            })

          if (insertTxError) {
            console.error('Failed to insert record into payment_transactions:', insertTxError.message)
          }
        } catch (dbErr) {
          console.error('Unexpected error recording payment transaction:', dbErr)
        }
      }

      // Mark in memory fallback
      processedBillsFallback.add(billId)
    } else {
      console.log(`Payment failed or pending for Bill ID: ${billId}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
