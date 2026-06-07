import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

/**
 * One-click unsubscribe endpoint for the RFC 8058 List-Unsubscribe-Post
 * header that Gmail and others POST to. Returns 200 regardless so the
 * mail client shows success.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get('token')
  if (token) {
    await getSupabase()
      .from('subscribers')
      .update({ status: 'unsubscribed' })
      .eq('unsubscribe_token', token)
  }
  return NextResponse.json({ ok: true }, { status: 200 })
}
