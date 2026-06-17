import { describe, it, expect, vi, beforeEach } from 'vitest'

const { fromMock, eqUpdate } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  eqUpdate: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  getSupabase: () => ({ from: fromMock }),
}))

import { POST } from './route'

function reqWith(token?: string) {
  const url = token
    ? `https://marco-tech.se/api/unsubscribe?token=${token}`
    : 'https://marco-tech.se/api/unsubscribe'
  return { nextUrl: new URL(url) } as Parameters<typeof POST>[0]
}

const VALID_TOKEN = 'a'.repeat(64)
const INVALID_TOKEN = 'tok123'

describe('POST /api/unsubscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fromMock.mockReturnValue({ update: () => ({ eq: eqUpdate }) })
    eqUpdate.mockResolvedValue({ error: null })
  })

  it('unsubscribes when a valid token is present', async () => {
    const res = await POST(reqWith(VALID_TOKEN))
    expect(res.status).toBe(200)
    expect(eqUpdate).toHaveBeenCalledWith('unsubscribe_token', VALID_TOKEN)
  })

  it('does nothing but still returns 200 for a malformed token', async () => {
    const res = await POST(reqWith(INVALID_TOKEN))
    expect(res.status).toBe(200)
    expect(eqUpdate).not.toHaveBeenCalled()
  })

  it('does nothing but still returns 200 without a token', async () => {
    const res = await POST(reqWith())
    expect(res.status).toBe(200)
    expect(eqUpdate).not.toHaveBeenCalled()
  })

  it('still returns 200 when the database call throws', async () => {
    eqUpdate.mockRejectedValue(new Error('db down'))
    const res = await POST(reqWith(VALID_TOKEN))
    expect(res.status).toBe(200)
  })
})
