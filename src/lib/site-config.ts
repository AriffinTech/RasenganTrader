const rawEnrollUrl = process.env.NEXT_PUBLIC_ENROLL_URL?.trim()

const isHttpUrl = (value: string | undefined): value is string =>
  Boolean(value && /^https?:\/\/.+/i.test(value))

export const enrollment = {
  url: isHttpUrl(rawEnrollUrl) ? rawEnrollUrl : undefined,
  available: isHttpUrl(rawEnrollUrl),
} as const
