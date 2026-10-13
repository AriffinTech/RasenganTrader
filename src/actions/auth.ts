'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getAdminEmail, getAdminPassword, computeAdminToken, verifyAdminToken } from '@/lib/auth-utils'
import { rateLimit } from '@/lib/rate-limit'

/**
 * Checks whether the given authenticated user is an authorized administrator.
 * Validates against the user's app_metadata claims and the `admin_users` table in Supabase.
 */
export async function isUserAdmin(
  supabase: any,
  user: { id?: string; email?: string; app_metadata?: any; user_metadata?: any } | null
): Promise<boolean> {
  if (!user) return false

  // 1. Check metadata claims - ONLY app_metadata is trusted (server-set), user_metadata is untrusted (client-writable)
  if (user.app_metadata?.is_admin === true) {
    return true
  }

  if (!user.email) return false
  const userEmail = user.email.toLowerCase().trim()

  // 2. Check admin_users table via provided client
  if (supabase) {
    try {
      const { data } = await supabase
        .from('admin_users')
        .select('email')
        .ilike('email', userEmail)
        .maybeSingle()

      if (data?.email) {
        return true
      }
    } catch {
      // Continue to admin client fallback check
    }
  }

  // 3. Fallback: Check admin_users table via Service Role Admin Client if available
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const adminClient = createAdminClient()
    const { data } = await adminClient
      .from('admin_users')
      .select('email')
      .ilike('email', userEmail)
      .maybeSingle()

    if (data?.email) {
      return true
    }
  } catch {
    // Service role credentials may not be configured in non-production environments
  }

  return false
}

/**
 * Verifies that the current request has an active, authenticated administrator session.
 */
export async function verifyAdminSession() {
  try {
    const cookieStore = await cookies()
    const adminCookie = cookieStore.get('admin_session')?.value
    let expectedToken: string | null = null
    try {
      expectedToken = await computeAdminToken()
    } catch {
      expectedToken = null
    }

    let supabase: any = null
    try {
      supabase = await createClient()
    } catch {
      supabase = null
    }

    let adminClient: any = null
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin')
      adminClient = createAdminClient()
    } catch {
      adminClient = null
    }

    // 1. Check master cookie session (supports current token and legacy tokens during transition)
    const isMasterSession = adminCookie ? await verifyAdminToken(adminCookie) : false

    if (isMasterSession) {
      // Seamlessly upgrade cookie to current token if signed with legacy credentials
      if (expectedToken && adminCookie !== expectedToken) {
        try {
          cookieStore.set('admin_session', expectedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })
        } catch {
          // Ignore in read-only Server Component context
        }
      }

      const effectiveClient = adminClient || supabase
      if (!effectiveClient) {
        return {
          authorized: false,
          error: 'Pangkalan data Supabase tidak dapat diakses. Sila pastikan pelayan dev telah dimulakan semula (restart npm run dev).',
          user: null,
          supabase: null,
          adminClient: null,
        }
      }

      return {
        authorized: true,
        user: { email: getAdminEmail() },
        supabase: effectiveClient,
        adminClient: effectiveClient,
      }
    }

    // 2. Check Supabase Auth session
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user && user.email) {
        const isAdmin = await isUserAdmin(supabase, user)
        if (isAdmin) {
          const effectiveClient = adminClient || supabase
          if (!effectiveClient) {
            return {
              authorized: false,
              error: 'Pangkalan data Supabase tidak dapat diakses. Sila pastikan pelayan dev telah dimulakan semula (restart npm run dev).',
              user: null,
              supabase: null,
              adminClient: null,
            }
          }

          return {
            authorized: true,
            user,
            supabase: effectiveClient,
            adminClient: effectiveClient,
          }
        }
      }
    }

    return {
      authorized: false,
      error: 'Akses tidak dibenarkan. Sila log masuk sebagai pentadbir.',
      user: null,
      supabase: null,
      adminClient: null,
    }
  } catch (err: any) {
    return {
      authorized: false,
      error: err.message || 'Ralat pengesahan sesi pentadbir.',
      user: null,
      supabase: null,
      adminClient: null,
    }
  }
}

export async function loginAdmin(formData: FormData) {
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1'

  const email = ((formData.get('email') as string) || '').trim().toLowerCase()
  const password = ((formData.get('password') as string) || '').trim()

  if (!email || !password) {
    return { error: 'Sila masukkan emel dan kata laluan.' }
  }

  // Rate limiting: 5 attempts per 15 minutes, keyed on ip and email
  const rateLimitKey = `admin-login:${ip}:${email}`
  const { success: rateLimitOk } = rateLimit(rateLimitKey, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  })

  if (!rateLimitOk) {
    return { error: 'Terlalu banyak percubaan log masuk. Sila cuba lagi dalam masa 15 minit.' }
  }

  let loginSuccess = false

  // 1. Check Master / Fallback Admin Credentials
  let configuredAdminEmail: string | null = null
  let configuredAdminPassword: string | null = null
  try {
    configuredAdminEmail = getAdminEmail().toLowerCase()
    configuredAdminPassword = getAdminPassword()
  } catch (err: any) {
    console.error('Admin auth configuration error:', err)
  }

  // Ensure password matches master password AND email is a valid admin email
  if (configuredAdminPassword && password === configuredAdminPassword) {
    if (configuredAdminEmail && email === configuredAdminEmail) {
      loginSuccess = true
    } else {
      // Check if email exists in admin_users
      try {
        const { createAdminClient } = await import('@/lib/supabase/admin')
        const adminClient = createAdminClient()
        const { data } = await adminClient
          .from('admin_users')
          .select('email')
          .ilike('email', email)
          .maybeSingle()
        if (data?.email) {
          loginSuccess = true
        }
      } catch {
        // Fallback or ignore
      }
    }
  }

  // 2. Check Supabase Auth
  if (!loginSuccess) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const isAdmin = await isUserAdmin(supabase, user)
          if (isAdmin) {
            loginSuccess = true
          } else {
            await supabase.auth.signOut()
            return { error: 'Akses dinafikan. Akaun ini bukan pentadbir yang sah.' }
          }
        }
      }
    } catch {
      // Supabase not reachable or unconfigured
    }
  }

  if (!loginSuccess) {
    return { error: 'Emel atau kata laluan tidak tepat.' }
  }

  // Set secure HTTP-only admin session cookie
  const token = await computeAdminToken()
  const cookieStore = await cookies()
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

export async function logoutAdmin() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')

    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (err) {
    console.error('Logout error:', err)
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin/login')
}
