import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/email'

function newToken(): string {
  return randomBytes(32).toString('hex')
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let email: unknown
  try {
    const body = await req.json()
    email = body?.email
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const normalized = email.trim().toLowerCase()
  const supabase = getSupabase()

  const { data: existing, error: lookupError } = await supabase
    .from('subscribers')
    .select('id, status, unsubscribe_token')
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

  const confirmToken = newToken()

  if (existing) {
    // Pending or previously unsubscribed — refresh token and re-confirm.
    const { error } = await supabase
      .from('subscribers')
      .update({ status: 'pending', confirm_token: confirmToken })
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
    })
    if (error) {
      console.error('Supabase insert error', error.message)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  try {
    await sendConfirmationEmail(normalized, confirmToken)
  } catch (err) {
    console.error('Confirmation email failed', err)
    return NextResponse.json(
      { error: 'Could not send confirmation email' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
