'use server'

import { revalidatePath } from 'next/cache'
import { verifyAdminSession } from '@/actions/auth'
import type { ClassStatus } from '@/types/database'

export async function saveClassSession(formData: FormData) {
  try {
    // Enforce verified administrator session
    const adminCheck = await verifyAdminSession()
    if (!adminCheck.authorized || !adminCheck.supabase) {
      return { error: adminCheck.error || 'Akses tidak dibenarkan. Sila log masuk sebagai pentadbir.' }
    }
    const supabase = adminCheck.supabase

    const id = formData.get('id') as string | null
    const course_id = formData.get('course_id') as string
    const session_title = formData.get('session_title') as string
    const display_date = formData.get('display_date') as string
    const display_time = (formData.get('display_time') as string) || null
    const start_date = (formData.get('start_date') as string) || null
    const end_date = (formData.get('end_date') as string) || null
    const price_rm = parseFloat((formData.get('price_rm') as string) || '0')
    const price_cents = Math.round(price_rm * 100)
    const status = (formData.get('status') as ClassStatus) || 'upcoming'
    const telegram_link_override = (formData.get('telegram_link_override') as string) || null
    const poster_url_override = (formData.get('poster_url_override') as string) || null
    const custom_inclusions_raw = (formData.get('custom_inclusions') as string) || ''
    const custom_inclusions = custom_inclusions_raw
      ? custom_inclusions_raw.split('\n').map((s) => s.trim()).filter(Boolean)
      : null
    const sort_order_raw = formData.get('sort_order') as string | null
    const sort_order = sort_order_raw ? parseInt(sort_order_raw, 10) : undefined

    const sessionPayload: Record<string, any> = {
      course_id,
      session_title,
      display_date,
      display_time,
      start_date: start_date ? new Date(start_date).toISOString() : null,
      end_date: end_date ? new Date(end_date).toISOString() : null,
      price_cents,
      status,
      telegram_link_override: telegram_link_override ? telegram_link_override.trim() : null,
      poster_url_override: poster_url_override ? poster_url_override.trim() : null,
      custom_inclusions,
      ...(sort_order !== undefined && !isNaN(sort_order) ? { sort_order } : {}),
      updated_at: new Date().toISOString(),
    }

    if (id) {
      const { error } = await supabase
        .from('class_sessions')
        .update(sessionPayload)
        .eq('id', id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('class_sessions').insert({
        ...sessionPayload,
        created_at: new Date().toISOString(),
      })
      if (error) throw error
    }

    revalidatePath('/')
    revalidatePath('/register')
    revalidatePath('/admin')
    revalidatePath('/admin/classes')

    return { success: true }
  } catch (err: any) {
    console.error('Save session error:', err)
    return { error: err.message || 'Gagal menyimpan maklumat kelas.' }
  }
}

export async function updateClassStatus(id: string, status: ClassStatus) {
  try {
    // Enforce verified administrator session
    const adminCheck = await verifyAdminSession()
    if (!adminCheck.authorized || !adminCheck.supabase) {
      return { error: adminCheck.error || 'Akses tidak dibenarkan.' }
    }
    const supabase = adminCheck.supabase

    const { error } = await supabase
      .from('class_sessions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/register')
    revalidatePath('/admin')
    revalidatePath('/admin/classes')

    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function deleteClassSession(id: string) {
  try {
    // Enforce verified administrator session
    const adminCheck = await verifyAdminSession()
    if (!adminCheck.authorized || !adminCheck.supabase) {
      return { error: adminCheck.error || 'Akses tidak dibenarkan.' }
    }
    const supabase = adminCheck.supabase

    const { error } = await supabase.from('class_sessions').delete().eq('id', id)
    if (error) throw error

    revalidatePath('/')
    revalidatePath('/register')
    revalidatePath('/admin')
    revalidatePath('/admin/classes')

    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function moveClassSession(id: string, direction: 'up' | 'down') {
  try {
    // Enforce verified administrator session
    const adminCheck = await verifyAdminSession()
    if (!adminCheck.authorized || !adminCheck.supabase) {
      return { error: adminCheck.error || 'Akses tidak dibenarkan.' }
    }
    const supabase = adminCheck.supabase

    // Retrieve all class sessions ordered by sort_order
    const { data: sessions, error } = await supabase
      .from('class_sessions')
      .select('id, sort_order')
      .order('sort_order', { ascending: true })

    if (error || !sessions) throw error

    const currentIndex = (sessions as Array<{ id: string; sort_order: number }>).findIndex(
      (s) => s.id === id
    )
    if (currentIndex === -1) {
      return { error: 'Sesi kelas tidak ditemui.' }
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= sessions.length) {
      return { success: true } // Already at boundary
    }

    const currentSession = sessions[currentIndex]
    const targetSession = sessions[targetIndex]

    // Swap sort_order values
    const currentSort = targetIndex + 1
    const targetSort = currentIndex + 1

    await Promise.all([
      supabase.from('class_sessions').update({ sort_order: currentSort }).eq('id', currentSession.id),
      supabase.from('class_sessions').update({ sort_order: targetSort }).eq('id', targetSession.id),
    ])

    revalidatePath('/')
    revalidatePath('/register')
    revalidatePath('/admin')
    revalidatePath('/admin/classes')

    return { success: true }
  } catch (err: any) {
    console.error('moveClassSession error:', err)
    return { error: err.message || 'Gagal mengubah susunan kelas.' }
  }
}
