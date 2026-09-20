import crypto from 'crypto'

export const TELEGRAM_KELAS_ASAS_INVITE_LINK =
  process.env.TELEGRAM_KELAS_ASAS_INVITE_LINK || 'https://t.me/+Bc8UkVt2yHMzMzRl'

export type BillVerificationResult = {
  verified: boolean
  isPaid: boolean
  billId: string
  offer?: string
  name?: string
  email?: string
  telegram?: string
  amount?: number
  paidAt?: string
  error?: string
}

/**
 * Verify redirect signature using BILLPLZ_X_SIGNATURE.
 * Redirect signature format for Billplz:
 * billplzid<id>|billplzpaid_at<paid_at>|billplzpaid<paid>
 */
export function verifyRedirectSignature(
  billId: string,
  paid: string,
  paidAt: string,
  xSignature: string
): boolean {
  const xSignatureKey = process.env.BILLPLZ_X_SIGNATURE
  if (!xSignatureKey) return false

  const source = `billplzid${billId}|billplzpaid_at${paidAt}|billplzpaid${paid}`
  const expected = crypto
    .createHmac('sha256', xSignatureKey)
    .update(source)
    .digest('hex')

  return expected === xSignature
}

/**
 * Verifies the payment of a Billplz bill via direct Billplz API query.
 * Falls back to cryptographic redirect X-Signature verification if the API is unreachable.
 */
export async function verifyBillplzPayment(
  billId: string,
  clientFallback?: {
    paid?: string
    paidAt?: string
    xSignature?: string
  }
): Promise<BillVerificationResult> {
  const billplzUrl = process.env.BILLPLZ_API_URL || 'https://www.billplz.com/api/v3'
  const secretKey = process.env.BILLPLZ_SECRET_KEY

  if (secretKey) {
    try {
      const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`
      const response = await fetch(`${billplzUrl}/bills/${encodeURIComponent(billId)}`, {
        method: 'GET',
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
        cache: 'no-store',
      })

      if (response.ok) {
        const bill = await response.json()
        const isPaid = bill.paid === true || bill.state === 'paid'

        return {
          verified: true,
          isPaid,
          billId: bill.id || billId,
          offer: bill.reference_2 || undefined,
          name: bill.name || undefined,
          email: bill.email || undefined,
          telegram: bill.reference_1 || undefined,
          amount: typeof bill.amount === 'number' ? bill.amount : undefined,
          paidAt: bill.paid_at || undefined,
        }
      } else {
        console.error(`Billplz API verification failed for bill ${billId}: HTTP ${response.status}`)
      }
    } catch (err) {
      console.error('Error contacting Billplz API for verification:', err)
    }
  } else {
    console.warn('BILLPLZ_SECRET_KEY is not configured on the server.')
  }

  // Fallback to X-Signature if API check could not be completed
  if (
    clientFallback?.paid &&
    clientFallback?.paidAt &&
    clientFallback?.xSignature
  ) {
    const isValidSignature = verifyRedirectSignature(
      billId,
      clientFallback.paid,
      clientFallback.paidAt,
      clientFallback.xSignature
    )

    if (isValidSignature) {
      const isPaid = clientFallback.paid === 'true'
      return {
        verified: true,
        isPaid,
        billId,
        paidAt: clientFallback.paidAt,
      }
    }
  }

  return {
    verified: false,
    isPaid: false,
    billId,
    error: 'Unable to verify payment with Billplz',
  }
}
