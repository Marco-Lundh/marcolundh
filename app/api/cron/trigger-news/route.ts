import { NextRequest, NextResponse } from 'next/server'

const GITHUB_OWNER = 'Marco-Lundh'
const GITHUB_REPO = 'marcolundh'
const DISPATCH_EVENT = 'daily-news'

/**
 * Triggered by Vercel Cron once a day. Fires a GitHub `repository_dispatch`
 * event so the news pipeline workflow runs promptly (event-driven, not the
 * delayed GitHub cron). Vercel attaches `Authorization: Bearer ${CRON_SECRET}`
 * to cron requests when CRON_SECRET is set, which we verify here.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.GITHUB_DISPATCH_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  let res: Response
  try {
    res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_type: DISPATCH_EVENT }),
      }
    )
  } catch (err) {
    console.error('GitHub dispatch failed', err)
    return NextResponse.json({ error: 'Dispatch failed' }, { status: 502 })
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('GitHub dispatch error', res.status, body)
    return NextResponse.json({ error: 'Dispatch rejected' }, { status: 502 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
