'use server'

import { revalidatePath } from 'next/cache'
import { verifyAdminSession } from '@/actions/auth'
import type { DiscountType } from '@/types/database'

export async function saveDiscountCode(formData: FormData) {
  try {
    // Enforce verified administrator session
    const adminCheck = await verifyAdminSession()
    if (!adminCheck.authorized || !adminCheck.supabase) {
      return { error: adminCheck.error || 'Tidak dibenarkan. Sila log masuk sebagai pentadbir.' }
    }
    const supabase = adminCheck.supabase

    const id = formData.get('id') as string | null
    const code = (formData.get('code') as string).trim().toUpperCase()
    const discount_type = (formData.get('discount_type') as DiscountType) || 'fixed'
    const discount_value_input = parseFloat((formData.get('discount_value') as string) || '0')
    const discount_value =
      discount_type === 'fixed'
        ? Math.round(discount_value_input * 100) // store fixed discount in cents
        : Math.round(discount_value_input) // store percentage in integer (e.g. 15 for 15%)

    const course_id = (formData.get('course_id') as string) || null
    const valid_from = (formData.get('valid_from') as string) || null
    const valid_until = (formData.get('valid_until') as string) || null
    const max_uses_raw = (formData.get('max_uses') as string) || null
    const max_uses = max_uses_raw ? parseInt(max_uses_raw, 10) : null
    const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true'

    if (!code) {
      return { error: 'Sila masukkan kod kupon.' }
    }

    if (discount_value <= 0) {
      return { error: 'Nilai diskaun mestilah lebih daripada 0.' }
    }

    const payload = {
      code,
      discount_type,
      discount_value,
      course_id: course_id || null,
      valid_from: valid_from ? new Date(valid_from).toISOString() : null,
      valid_until: valid_until ? new Date(valid_until).toISOString() : null,
      max_uses,
      is_active,
      updated_at: new Date().toISOString(),
    }

    if (id) {
      const { error } = await supabase.from('discount_codes').update(payload).eq('id', id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('discount_codes').insert({
        ...payload,
        times_used: 0,
        created_at: new Date().toISOString(),
      })
      if (error) throw error
    }

    revalidatePath('/admin/discounts')
    return { success: true }
  } catch (err: any) {
    console.error('Save discount error:', err)
    return { error: err.message || 'Gagal menyimpan kod diskaun.' }
  }
}

export async function toggleDiscountStatus(id: string, is_active: boolean) {
  try {
    // Enforce verified administrator session
    const adminCheck = await verifyAdminSession()
    if (!adminCheck.authorized || !adminCheck.supabase) {
      return { error: adminCheck.error || 'Tidak dibenarkan' }
    }
    const supabase = adminCheck.supabase

    const { error } = await supabase
      .from('discount_codes')
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/discounts')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function deleteDiscountCode(id: string) {
  try {
    // Enforce verified administrator session
    const adminCheck = await verifyAdminSession()
    if (!adminCheck.authorized || !adminCheck.supabase) {
      return { error: adminCheck.error || 'Tidak dibenarkan' }
    }
    const supabase = adminCheck.supabase

    const { error } = await supabase.from('discount_codes').delete().eq('id', id)
    if (error) throw error

    revalidatePath('/admin/discounts')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}
