import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

/**
 * Opt a subscriber out. Triggered both by the explicit button on the
 * /unsubscribe page and by the RFC 8058 List-Unsubscribe-Post header that
 * Gmail and others POST to. Returns 200 regardless so the caller always
 * sees success and no subscriber existence is leaked.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get('token')
  const TOKEN_RE = /^[0-9a-f]{64}$/
  if (token && TOKEN_RE.test(token)) {
    try {
      await getSupabase()
        .from('subscribers')
        .update({ status: 'unsubscribed' })
        .eq('unsubscribe_token', token)
    } catch (err) {
      console.error('Unsubscribe failed', err)
    }
  }
  return NextResponse.json({ ok: true }, { status: 200 })
}
