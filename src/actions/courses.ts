'use server'

import { revalidatePath } from 'next/cache'
import { verifyAdminSession } from '@/actions/auth'
import type { CourseModule, ExclusiveBonus } from '@/types/database'

export async function saveCourse(formData: FormData) {
  try {
    // Enforce verified administrator session
    const adminCheck = await verifyAdminSession()
    if (!adminCheck.authorized || !adminCheck.supabase) {
      return { error: adminCheck.error || 'Tidak dibenarkan. Sila log masuk sebagai pentadbir.' }
    }
    const supabase = adminCheck.supabase

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const educator = formData.get('educator') as string
    const description = formData.get('description') as string
    const default_price_rm = parseFloat((formData.get('default_price_rm') as string) || '0')
    const default_price_cents = Math.round(default_price_rm * 100)
    const default_telegram_link = (formData.get('default_telegram_link') as string) || null

    // Bonuses
    const bonuses_raw = (formData.get('bonuses') as string) || ''
    const bonuses = bonuses_raw
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean)

    // Exclusive Bonus
    const exclusive_title = (formData.get('exclusive_title') as string) || ''
    const exclusive_badge = (formData.get('exclusive_badge') as string) || 'EXCLUSIVE BONUS'
    const exclusive_benefits_raw = (formData.get('exclusive_benefits') as string) || ''
    const exclusive_benefits = exclusive_benefits_raw
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean)

    const exclusive_bonus: ExclusiveBonus | null =
      exclusive_title.trim().length > 0
        ? {
            title: exclusive_title.trim(),
            benefits: exclusive_benefits,
            badge_label: exclusive_badge.trim(),
          }
        : null

    // Modules (JSON parsed)
    const modules_json = (formData.get('modules_json') as string) || '[]'
    let modules: CourseModule[] = []
    try {
      modules = JSON.parse(modules_json)
    } catch {
      modules = []
    }

    const { error } = await supabase
      .from('courses')
      .update({
        title,
        educator,
        description,
        default_price_cents,
        default_telegram_link: default_telegram_link ? default_telegram_link.trim() : null,
        bonuses,
        exclusive_bonus,
        modules,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/courses')
    revalidatePath(`/admin/courses/${id}`)
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    console.error('Save course error:', err)
    return { error: err.message || 'Gagal menyimpan perubahan kursus.' }
  }
}
