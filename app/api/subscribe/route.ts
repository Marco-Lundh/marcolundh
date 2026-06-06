import { NextRequest, NextResponse } from 'next/server'

const MAILERLITE_API = 'https://connect.mailerlite.com/api'

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

  const apiKey = process.env.MAILERLITE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  let res: Response
  try {
    res = await fetch(`${MAILERLITE_API}/subscribers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, resubscribe: true }),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to reach MailerLite' }, { status: 502 })
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    console.error('MailerLite subscribe error', res.status, JSON.stringify(errorBody))
    return NextResponse.json(
      { error: errorBody.message ?? 'MailerLite error' },
      { status: res.status }
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
