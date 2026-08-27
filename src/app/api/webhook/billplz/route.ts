import { NextResponse } from 'next/server'
import crypto from 'crypto'

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

    // 3. Process the payment status
    if (data.state === 'paid') {
      console.log(`Payment successful for Bill ID: ${data.id}`)
      
      // TODO: Send Telegram Notification
      const botToken = process.env.TELEGRAM_BOT_TOKEN
      const chatId = process.env.TELEGRAM_CHAT_ID

      if (botToken && chatId) {
        const message = `✅ *Bayaran Berjaya (Billplz)*\n\nNama: ${data.name}\nEmail: ${data.email}\nPhone: ${data.mobile}\nTelegram: ${data.reference_1}\nProduk: ${data.reference_2}\nJumlah: RM${(Number(data.amount) / 100).toFixed(2)}\nBil ID: ${data.id}`

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
    } else {
      console.log(`Payment failed or pending for Bill ID: ${data.id}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
