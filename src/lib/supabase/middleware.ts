import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { verifyAdminToken } from '@/lib/auth-utils'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

  // Fast-path: non-admin routes do not require admin authentication
  if (!isAdminPage) {
    return supabaseResponse
  }

  // 1. Check Master / Fallback Admin Session Cookie
  const adminCookie = request.cookies.get('admin_session')?.value
  let isVerifiedAdmin = await verifyAdminToken(adminCookie)

  // 2. Check Supabase Auth session if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isVerifiedAdmin && supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      })

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Only trust app_metadata (server-set). NEVER trust client-writable user_metadata.
        if (user.app_metadata?.is_admin === true) {
          isVerifiedAdmin = true
        } else if (user.email) {
          const { data: adminRecord } = await supabase
            .from('admin_users')
            .select('email')
            .ilike('email', user.email.trim())
            .maybeSingle()

          if (adminRecord?.email) {
            isVerifiedAdmin = true
          }
        }
      }
    } catch (err) {
      console.error('Middleware Supabase error:', err)
    }
  }

  // Protecting /admin routes (excluding /admin/login)
  if (isAdminPage && !isAuthPage) {
    if (!isVerifiedAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // If already logged in and verified as admin, redirect away from /admin/login to /admin dashboard
  if (isAuthPage && isVerifiedAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
