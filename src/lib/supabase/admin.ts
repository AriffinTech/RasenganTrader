import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

function ensureEnvLoaded() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
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

export function createAdminClient() {
  ensureEnvLoaded()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service role credentials are missing')
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
