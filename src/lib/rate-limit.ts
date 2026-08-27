interface RateLimitOptions {
  windowMs: number
  maxRequests: number
}

const store = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(ip: string, options: RateLimitOptions = { windowMs: 60000, maxRequests: 5 }) {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry) {
    store.set(ip, { count: 1, resetTime: now + options.windowMs })
    return { success: true }
  }

  if (now > entry.resetTime) {
    store.set(ip, { count: 1, resetTime: now + options.windowMs })
    return { success: true }
  }

  if (entry.count >= options.maxRequests) {
    return { success: false }
  }

  entry.count += 1
  return { success: true }
}
