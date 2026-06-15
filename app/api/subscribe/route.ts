import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/email'
import type { Language } from '@/lib/translations'

// Don't send another confirmation email to the same address within this
// window — throttles email-bombing and protects the Resend daily quota.
const RESEND_COOLDOWN_MS = 2 * 60 * 1000

function newToken(): string {
  return randomBytes(32).toString('hex')
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { email?: unknown; language?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = body?.email
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const language: Language = body?.language === 'sv' ? 'sv' : 'en'
  const normalized = email.trim().toLowerCase()

  let supabase: ReturnType<typeof getSupabase>
  try {
    supabase = getSupabase()
  } catch (err) {
    // Missing/invalid credentials (e.g. no SUPABASE_* env vars). Fail with a
    // structured response instead of letting the handler throw a bare 500.
    console.error('Supabase init failed', err)
    return NextResponse.json(
      { error: 'Subscription service is not configured' },
      { status: 503 }
    )
  }

  const { data: existing, error: lookupError } = await supabase
    .from('subscribers')
    .select('id, status, confirmation_sent_at')
    .eq('email', normalized)
    .maybeSingle()

  if (lookupError) {
    console.error('Supabase lookup error', lookupError.message)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // Already confirmed — nothing to do, report success without re-sending.
  if (existing?.status === 'active') {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // A confirmation was sent very recently — throttle without re-sending.
  if (
    existing?.confirmation_sent_at &&
    Date.now() - new Date(existing.confirmation_sent_at).getTime() <
      RESEND_COOLDOWN_MS
  ) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const confirmToken = newToken()
  const sentAt = new Date().toISOString()

  if (existing) {
    // Pending or previously unsubscribed — refresh token and re-confirm.
    const { error } = await supabase
      .from('subscribers')
      .update({
        status: 'pending',
        confirm_token: confirmToken,
        confirmation_sent_at: sentAt,
      })
      .eq('id', existing.id)
    if (error) {
      console.error('Supabase update error', error.message)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  } else {
    const { error } = await supabase.from('subscribers').insert({
      email: normalized,
      status: 'pending',
      confirm_token: confirmToken,
      unsubscribe_token: newToken(),
      confirmation_sent_at: sentAt,
    })
    if (error) {
      console.error('Supabase insert error', error.message)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  try {
    await sendConfirmationEmail(normalized, confirmToken, language)
  } catch (err) {
    console.error('Confirmation email failed', err)
    return NextResponse.json(
      { error: 'Could not send confirmation email' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
