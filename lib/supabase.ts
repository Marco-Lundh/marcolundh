import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client using the service-role key.
 *
 * This bypasses Row Level Security and must NEVER be imported into client
 * components or exposed to the browser. Use it only in API routes and
 * server components.
 *
 * The client is created lazily so that importing this module never throws
 * at build time — only an actual call fails if the env vars are missing.
 */
let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (client) return client

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!url || !serviceKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
  return client
}

export interface Subscriber {
  id: string
  email: string
  status: 'pending' | 'active' | 'unsubscribed'
  confirm_token: string
  unsubscribe_token: string
  created_at: string
  confirmed_at: string | null
}
