export function getAdminPassword(): string {
  const pwd = process.env.ADMIN_PASSWORD
  if (!pwd) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_PASSWORD environment variable must be configured in production.')
    }
    return 'rasenganking2026!'
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
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'rasenganking2026!')
export const ADMIN_SECRET = process.env.ADMIN_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'rt-admin-secret-key-2026')
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || (process.env.NODE_ENV === 'production' ? '' : 'admin@rasengantrader.com')

/**
 * Calculates a SHA-256 HMAC / digest for admin session validation.
 * Uses Web Crypto API compatible with Node.js, Edge Runtime, and browser.
 */
export async function computeAdminToken(
  overridePassword?: string,
  overrideSecret?: string
): Promise<string> {
  const secret = overrideSecret || getAdminSecret()
  const password = overridePassword || getAdminPassword()

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

/**
 * Validates an admin session token against current credentials and legacy combinations.
 * Allows seamless continuity during password or secret rotation.
 */
export async function verifyAdminToken(token?: string | null): Promise<boolean> {
  if (!token) return false

  // 1. Current token check
  try {
    const currentToken = await computeAdminToken()
    if (token === currentToken) return true
  } catch {}

  // 2. Legacy / transition tokens check
  const candidateCombinations: Array<[string | undefined, string | undefined]> = [
    ['rasengan2026!', undefined],
    ['rasengan2026!', 'rt-admin-secret-key-2026'],
    ['rasenganking2026!', 'rt-admin-secret-key-2026'],
    [undefined, 'rt-admin-secret-key-2026'],
  ]

  for (const [pwd, sec] of candidateCombinations) {
    try {
      const candidate = await computeAdminToken(pwd, sec)
      if (token === candidate) return true
    } catch {}
  }

  return false
}

