import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export interface PaymentCompletionPayload {
  billId: string
  paidAmountCents?: number
  customerName?: string | null
  customerEmail?: string | null
  customerPhone?: string | null
  reference1?: string | null
  reference2?: string | null
  discountCode?: string | null
  description?: string | null
  paidAt?: string | null
  rawMetadata?: Record<string, any>
}

/**
 * Idempotently records a verified successful payment and increments coupon times_used.
 * Can be safely called from both the Billplz Webhook and the /terima-kasih redirect page.
 */
export async function recordSuccessfulPayment(payload: PaymentCompletionPayload) {
  const {
    billId,
    paidAmountCents = 0,
    customerName,
    customerEmail,
    customerPhone,
    reference1,
    reference2,
    discountCode: explicitDiscountCode,
    description,
    paidAt,
    rawMetadata = {},
  } = payload

  if (!billId) return { error: 'Missing bill ID' }

  let supabase: any
  try {
    supabase = createAdminClient()
  } catch (err) {
    console.error('recordSuccessfulPayment: createAdminClient error:', err)
    return { error: 'Supabase admin client unavailable' }
  }

  // 1. Check idempotency in payment_transactions
  let alreadyPaid = false
  try {
    const { data: existingTx } = await supabase
      .from('payment_transactions')
      .select('id, status, metadata')
      .eq('bill_id', billId)
      .maybeSingle()

    if (existingTx && existingTx.status === 'paid') {
      alreadyPaid = true
    }
  } catch (err) {
    console.warn('Idempotency check query warning:', err)
  }

  if (alreadyPaid) {
    console.log(`[Payment] Bill ID ${billId} already processed as paid. Skipping duplicate processing.`)
    return { success: true, alreadyProcessed: true }
  }

  // 2. Identify effective discount code
  let effectiveCode: string | null = explicitDiscountCode?.trim().toUpperCase() || null

  // Fallback 1: check reference_2 for offer|DISCOUNT_CODE format
  if (!effectiveCode && reference2 && reference2.includes('|')) {
    const parts = reference2.split('|')
    if (parts[1]) {
      effectiveCode = parts[1].trim().toUpperCase()
    }
  }

  // Fallback 2: check rawMetadata
  if (!effectiveCode && rawMetadata?.discount_code) {
    effectiveCode = String(rawMetadata.discount_code).trim().toUpperCase()
  }

  // Fallback 3: check description regex [KOD: XXX]
  if (!effectiveCode && description) {
    const promoMatch = description.match(/\[KOD:\s*([^\]]+)\]/i)
    if (promoMatch && promoMatch[1]) {
      effectiveCode = promoMatch[1].trim().toUpperCase()
    }
  }

  // 3. Upsert / update payment_transactions
  try {
    const txPayload = {
      bill_id: billId,
      status: 'paid',
      amount_cents: paidAmountCents,
      customer_name: customerName || null,
      customer_email: customerEmail || null,
      customer_phone: customerPhone || null,
      reference_1: reference1 || null,
      reference_2: reference2 || null,
      metadata: {
        ...rawMetadata,
        paid_at: paidAt || new Date().toISOString(),
        description: description || null,
        discount_code: effectiveCode,
      },
      processed_at: new Date().toISOString(),
    }

    const { data: existingRecord } = await supabase
      .from('payment_transactions')
      .select('id')
      .eq('bill_id', billId)
      .maybeSingle()

    if (existingRecord) {
      await supabase
        .from('payment_transactions')
        .update(txPayload)
        .eq('id', existingRecord.id)
    } else {
      await supabase
        .from('payment_transactions')
        .insert({
          ...txPayload,
          created_at: new Date().toISOString(),
        })
    }
  } catch (err) {
    console.error('Error recording payment_transaction:', err)
  }

  // 4. Increment discount code times_used if a code was applied
  if (effectiveCode) {
    try {
      const { data: discRecord } = await supabase
        .from('discount_codes')
        .select('id, times_used')
        .ilike('code', effectiveCode)
        .maybeSingle()

      if (discRecord) {
        const newTimesUsed = (discRecord.times_used || 0) + 1
        const { error: discUpdateErr } = await supabase
          .from('discount_codes')
          .update({
            times_used: newTimesUsed,
            updated_at: new Date().toISOString(),
          })
          .eq('id', discRecord.id)

        if (discUpdateErr) {
          console.error('Error updating discount code times_used:', discUpdateErr)
        } else {
          console.log(`[Coupon] Successfully incremented times_used for ${effectiveCode} to ${newTimesUsed}`)
          try {
            revalidatePath('/admin/discounts')
          } catch {}
        }
      } else {
        console.warn(`[Coupon] Discount code ${effectiveCode} not found in discount_codes table`)
      }
    } catch (err) {
      console.error('Error incrementing discount code:', err)
    }
  }

  // 5. Send Telegram Notification
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (botToken && chatId) {
    try {
      const product = reference2 ? reference2.split('|')[0] : 'Kelas RasenganTrader'
      const discountText = effectiveCode ? `\nKupon: ${effectiveCode}` : ''
      const message = `✅ *Bayaran Berjaya*\n\nNama: ${customerName || 'N/A'}\nEmail: ${customerEmail || 'N/A'}\nPhone: ${customerPhone || 'N/A'}\nTelegram: ${reference1 || 'N/A'}\nProduk: ${product}${discountText}\nJumlah: RM${(paidAmountCents / 100).toFixed(2)}\nBil ID: ${billId}`

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }).catch((err) => console.error('Telegram API Error:', err))
    } catch (tgErr) {
      console.error('Failed to send Telegram notification:', tgErr)
    }
  }

  return { success: true, codeApplied: effectiveCode }
}
