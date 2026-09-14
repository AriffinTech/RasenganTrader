import Papa from 'papaparse'

import { defaultClassSchedule, type RegistrationOfferKey } from '@/lib/course'

export type ClassScheduleItem = {
  offerId: RegistrationOfferKey
  name: string
  date: string
  price: string
  status: string
  availability: string
}

const PUBLISHED_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHJJikovmz71pcvsw5pZdCSBWbZgG3LcIn3mx6NqZFz69nFhOv-JVegJbfAmvg9yCnbKyhBCyFWTai/pub?output=csv'

function inferOfferId(name: string, explicitId?: string): RegistrationOfferKey | undefined {
  const value = (explicitId || name).trim().toLowerCase()

  if (value === 'fast-track' || value.includes('fast track') || value.includes('true smc')) return 'fast-track'
  if (value === 'saham-101' || value.includes('saham 101')) return 'saham-101'
  if (value === 'personal-coaching' || value.includes('personal coaching')) return 'personal-coaching'
  if (value === 'trading-clinic' || value.includes('trading clinic') || value.includes('coaching')) return 'trading-clinic'
  return undefined
}

function getRowValue(row: Record<string, string>, ...keys: string[]) {
  for (const key of keys) {
    const value = row[key]?.trim()
    if (value) return value
  }
  return ''
}

export async function getClassesData(): Promise<ClassScheduleItem[]> {
  let rows: Record<string, string>[] = []

  try {
    const res = await fetch(PUBLISHED_CSV_URL, { next: { revalidate: 60 } })

    if (res.ok) {
      const parsed = Papa.parse<Record<string, string>>(await res.text(), {
        header: true,
        skipEmptyLines: true,
      })
      rows = parsed.data || []
    } else {
      console.error('Failed to fetch Google Sheets CSV:', res.statusText)
    }
  } catch (error) {
    console.error('Error fetching Google Sheets CSV data:', error)
  }

  const overrides = new Map(
    rows
      .map((row) => {
        const name = getRowValue(row, 'Class Name', 'Name')
        const offerId = inferOfferId(name, getRowValue(row, 'Offer ID', 'Offer'))
        return offerId ? [offerId, row] as const : null
      })
      .filter((entry): entry is readonly [RegistrationOfferKey, Record<string, string>] => Boolean(entry)),
  )

  return defaultClassSchedule.map((fallback) => {
    const row = overrides.get(fallback.offerId)
    if (!row) return { ...fallback }

    return {
      offerId: fallback.offerId,
      // Keep the controlled offer copy and prices in code. The Sheet controls
      // operational status and the manually displayed coaching availability.
      name: fallback.name,
      date: fallback.date,
      price: fallback.price,
      status: fallback.offerId === 'fast-track' || fallback.offerId === 'trading-clinic'
        ? fallback.status
        : getRowValue(row, 'Status') || fallback.status,
      availability: fallback.offerId === 'trading-clinic'
        ? ''
        : getRowValue(row, 'Availability', 'Slots Remaining', 'Remaining') || fallback.availability,
    }
  })
}
