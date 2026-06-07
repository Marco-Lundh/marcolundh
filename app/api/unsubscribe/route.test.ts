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

describe('POST /api/unsubscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fromMock.mockReturnValue({ update: () => ({ eq: eqUpdate }) })
    eqUpdate.mockResolvedValue({ error: null })
  })

  it('unsubscribes when a token is present', async () => {
    const res = await POST(reqWith('tok123'))
    expect(res.status).toBe(200)
    expect(eqUpdate).toHaveBeenCalledWith('unsubscribe_token', 'tok123')
  })

  it('does nothing but still returns 200 without a token', async () => {
    const res = await POST(reqWith())
    expect(res.status).toBe(200)
    expect(eqUpdate).not.toHaveBeenCalled()
  })
})
