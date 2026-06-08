import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { NextRequest } from 'next/server'
import { GET } from './route'

function reqWith(authorization?: string) {
  const headers = new Headers()
  if (authorization) headers.set('authorization', authorization)
  return { headers } as unknown as NextRequest
}

describe('GET /api/cron/trigger-news', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.restoreAllMocks()
    process.env.CRON_SECRET = 'secret'
    process.env.GITHUB_DISPATCH_TOKEN = 'ghtoken'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('returns 401 without the cron bearer token', async () => {
    const res = await GET(reqWith())
    expect(res.status).toBe(401)
  })

  it('returns 401 with a wrong bearer token', async () => {
    const res = await GET(reqWith('Bearer nope'))
    expect(res.status).toBe(401)
  })

  it('returns 500 when the dispatch token is missing', async () => {
    delete process.env.GITHUB_DISPATCH_TOKEN
    const res = await GET(reqWith('Bearer secret'))
    expect(res.status).toBe(500)
  })

  it('dispatches to GitHub and returns 200 on success', async () => {
    const fetchMock = vi.fn((_url: string, _init: RequestInit) =>
      Promise.resolve({ ok: true } as Response)
    )
    vi.stubGlobal('fetch', fetchMock)

    const res = await GET(reqWith('Bearer secret'))

    expect(res.status).toBe(200)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toContain('/repos/Marco-Lundh/marcolundh/dispatches')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({ event_type: 'daily-news' })
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer ghtoken'
    )
  })

  it('returns 502 when GitHub rejects the dispatch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 403,
          text: () => Promise.resolve('forbidden'),
        } as unknown as Response)
      )
    )
    const res = await GET(reqWith('Bearer secret'))
    expect(res.status).toBe(502)
  })

  it('returns 502 when the request throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('network')))
    )
    const res = await GET(reqWith('Bearer secret'))
    expect(res.status).toBe(502)
  })
})
