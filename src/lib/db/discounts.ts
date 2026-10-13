import { createClient } from '@/lib/supabase/server'
import type { DiscountCode } from '@/types/database'

export type DiscountValidationResult = {
  valid: boolean
  code?: string
  discountType?: 'fixed' | 'percentage'
  discountValue?: number
  discountCents?: number
  finalPriceCents?: number
  message?: string
}

export async function getDiscountCodes(): Promise<DiscountCode[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*, course:courses(id, title, slug)')
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }
    return data as DiscountCode[]
  } catch {
    return []
  }
}

export async function validateDiscountCode(
  rawCode: string,
  basePriceCents: number,
  courseId?: string,
  classSessionId?: string
): Promise<DiscountValidationResult> {
  const code = rawCode.trim().toUpperCase()

  if (!code) {
    return { valid: false, message: 'Sila masukkan kod diskaun' }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .maybeSingle()

    if (error || !data) {
      return { valid: false, message: 'Kod diskaun tidak sah atau tidak aktif' }
    }

    const discount = data as DiscountCode
    const now = new Date()

    if (discount.valid_from && new Date(discount.valid_from) > now) {
      return { valid: false, message: 'Kod diskaun ini belum mula berkuatkuasa' }
    }

    if (discount.valid_until && new Date(discount.valid_until) < now) {
      return { valid: false, message: 'Kod diskaun ini telah tamat tempoh' }
    }

    if (discount.max_uses !== null && discount.times_used >= discount.max_uses) {
      return { valid: false, message: 'Had penggunaan kod diskaun ini telah dicapai' }
    }

    if (discount.course_id && courseId && discount.course_id !== courseId) {
      return { valid: false, message: 'Kod diskaun ini tidak sah untuk kursus yang dipilih' }
    }

    if (discount.class_session_id && classSessionId && discount.class_session_id !== classSessionId) {
      return { valid: false, message: 'Kod diskaun ini tidak sah untuk sesi yang dipilih' }
    }

    // Calculate discount deduction
    let discountCents = 0
    if (discount.discount_type === 'fixed') {
      discountCents = discount.discount_value
    } else if (discount.discount_type === 'percentage') {
      discountCents = Math.round((basePriceCents * discount.discount_value) / 100)
    }

    // Guard against negative price. If fully discounted, 0. Else min RM1 (100 sen) for payment gateway
    let finalPriceCents = Math.max(0, basePriceCents - discountCents)
    if (finalPriceCents > 0 && finalPriceCents < 100) {
      finalPriceCents = 100
    }

    return {
      valid: true,
      code: discount.code,
      discountType: discount.discount_type,
      discountValue: discount.discount_value,
      discountCents,
      finalPriceCents,
      message: `Diskaun berjaya! Penjimatan RM${(discountCents / 100).toFixed(2)}.`,
    }
  } catch (err) {
    console.error('Error validating discount code:', err)
    return { valid: false, message: 'Ralat mengesahkan kod diskaun' }
  }
}
