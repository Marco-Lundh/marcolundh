import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  getSupabase,
  fromMock,
  maybeSingle,
  eqUpdate,
  insertMock,
  sendConfirmationEmail,
} = vi.hoisted(() => ({
  getSupabase: vi.fn(),
  fromMock: vi.fn(),
  maybeSingle: vi.fn(),
  eqUpdate: vi.fn(),
  insertMock: vi.fn(),
  sendConfirmationEmail: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({ getSupabase }))

vi.mock('@/lib/email', () => ({ sendConfirmationEmail }))

import { POST } from './route'

function reqWith(body: unknown) {
  return { json: () => Promise.resolve(body) } as Parameters<typeof POST>[0]
}

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getSupabase.mockReturnValue({ from: fromMock })
    fromMock.mockReturnValue({
      select: () => ({ eq: () => ({ maybeSingle }) }),
      update: () => ({ eq: eqUpdate }),
      insert: insertMock,
    })
    maybeSingle.mockResolvedValue({ data: null, error: null })
    eqUpdate.mockResolvedValue({ error: null })
    insertMock.mockResolvedValue({ error: null })
    sendConfirmationEmail.mockResolvedValue(undefined)
  })

  it('returns 400 on an unparseable body', async () => {
    const badReq = {
      json: () => Promise.reject(new Error('bad')),
    } as Parameters<typeof POST>[0]
    const res = await POST(badReq)
    expect(res.status).toBe(400)
  })

  it('returns 400 on an invalid email', async () => {
    const res = await POST(reqWith({ email: 'not-an-email' }))
    expect(res.status).toBe(400)
  })

  it('returns 503 when Supabase is not configured', async () => {
    getSupabase.mockImplementation(() => {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
    })
    const res = await POST(reqWith({ email: 'a@b.com' }))
    expect(res.status).toBe(503)
    await expect(res.json()).resolves.toEqual({
      error: 'Subscription service is not configured',
    })
    expect(fromMock).not.toHaveBeenCalled()
    expect(sendConfirmationEmail).not.toHaveBeenCalled()
  })

  it('returns 200 without re-sending when already active', async () => {
    maybeSingle.mockResolvedValue({
      data: { id: '1', status: 'active', unsubscribe_token: 'u' },
      error: null,
    })
    const res = await POST(reqWith({ email: 'a@b.com' }))
    expect(res.status).toBe(200)
    expect(sendConfirmationEmail).not.toHaveBeenCalled()
  })

  it('re-confirms an existing pending/unsubscribed subscriber', async () => {
    maybeSingle.mockResolvedValue({
      data: { id: '1', status: 'unsubscribed', confirmation_sent_at: null },
      error: null,
    })
    const res = await POST(reqWith({ email: 'a@b.com' }))
    expect(res.status).toBe(200)
    expect(eqUpdate).toHaveBeenCalledOnce()
    expect(sendConfirmationEmail).toHaveBeenCalledOnce()
  })

  it('throttles a repeat request within the cooldown window', async () => {
    maybeSingle.mockResolvedValue({
      data: {
        id: '1',
        status: 'pending',
        confirmation_sent_at: new Date().toISOString(),
      },
      error: null,
    })
    const res = await POST(reqWith({ email: 'a@b.com' }))
    expect(res.status).toBe(200)
    expect(eqUpdate).not.toHaveBeenCalled()
    expect(sendConfirmationEmail).not.toHaveBeenCalled()
  })

  it('re-sends once the cooldown has elapsed', async () => {
    maybeSingle.mockResolvedValue({
      data: {
        id: '1',
        status: 'pending',
        confirmation_sent_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      error: null,
    })
    const res = await POST(reqWith({ email: 'a@b.com' }))
    expect(res.status).toBe(200)
    expect(sendConfirmationEmail).toHaveBeenCalledOnce()
  })

  it('forwards the chosen language to the confirmation email', async () => {
    const res = await POST(reqWith({ email: 'sv@example.com', language: 'sv' }))
    expect(res.status).toBe(200)
    expect(sendConfirmationEmail).toHaveBeenCalledWith(
      'sv@example.com',
      expect.any(String),
      'sv'
    )
  })

  it('returns 500 when re-confirm update fails', async () => {
    maybeSingle.mockResolvedValue({
      data: { id: '1', status: 'pending', unsubscribe_token: 'u' },
      error: null,
    })
    eqUpdate.mockResolvedValue({ error: { message: 'update failed' } })
    const res = await POST(reqWith({ email: 'a@b.com' }))
    expect(res.status).toBe(500)
    expect(sendConfirmationEmail).not.toHaveBeenCalled()
  })

  it('inserts and emails a brand-new subscriber', async () => {
    const res = await POST(reqWith({ email: 'New@Example.com' }))
    expect(res.status).toBe(200)
    expect(insertMock).toHaveBeenCalledOnce()
    // Email is normalised to lowercase before storing.
    expect(insertMock.mock.calls[0][0].email).toBe('new@example.com')
    expect(sendConfirmationEmail).toHaveBeenCalledOnce()
  })

  it('returns 500 on a lookup error', async () => {
    maybeSingle.mockResolvedValue({
      data: null,
      error: { message: 'db down' },
    })
    const res = await POST(reqWith({ email: 'a@b.com' }))
    expect(res.status).toBe(500)
  })

  it('returns 500 when the insert fails', async () => {
    insertMock.mockResolvedValue({ error: { message: 'insert failed' } })
    const res = await POST(reqWith({ email: 'a@b.com' }))
    expect(res.status).toBe(500)
  })

  it('returns 502 when the confirmation email fails', async () => {
    sendConfirmationEmail.mockRejectedValue(new Error('resend down'))
    const res = await POST(reqWith({ email: 'a@b.com' }))
    expect(res.status).toBe(502)
  })
})
