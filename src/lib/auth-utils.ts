export function getAdminPassword(): string {
  const pwd = process.env.ADMIN_PASSWORD
  if (!pwd) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_PASSWORD environment variable must be configured in production.')
    }
    return 'rasengan2026!'
  }
  return pwd
}

export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SECRET environment variable must be configured in production.')
    }
    return 'rt-admin-secret-key-2026'
  }
  return secret
}

export function getAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL
  if (!email) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_EMAIL environment variable must be configured in production.')
    }
    return 'admin@rasengantrader.com'
  }
  return email.trim().toLowerCase()
}

// Backwards-compatible constants for callers
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'rasengan2026!')
export const ADMIN_SECRET = process.env.ADMIN_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'rt-admin-secret-key-2026')
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || (process.env.NODE_ENV === 'production' ? '' : 'admin@rasengantrader.com')

/**
 * Calculates a SHA-256 HMAC / digest for admin session validation.
 * Uses Web Crypto API compatible with Node.js, Edge Runtime, and browser.
 */
export async function computeAdminToken(): Promise<string> {
  const secret = getAdminSecret()
  const password = getAdminPassword()

  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(password)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
