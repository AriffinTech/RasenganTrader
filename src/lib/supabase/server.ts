import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

function ensureEnvLoaded() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local')
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8')
        for (const line of content.split('\n')) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('#')) continue
          const idx = trimmed.indexOf('=')
          if (idx > 0) {
            const key = trimmed.slice(0, idx).trim()
            const val = trimmed.slice(idx + 1).trim()
            if (!process.env[key] || process.env[key] === '') {
              process.env[key] = val
            }
          }
        }
      }
    } catch {}
  }
}

export async function createClient() {
  ensureEnvLoaded()
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing')
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  })
}
