import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { ensureEnvLoaded } from './env-loader'

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
