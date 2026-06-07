import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ id: 'mock-client' })),
}))

describe('getSupabase', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    delete process.env.SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_KEY
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('throws when env vars are missing', async () => {
    const { getSupabase } = await import('./supabase')
    expect(() => getSupabase()).toThrow(/SUPABASE_URL/)
  })

  it('creates and memoizes the client when env is set', async () => {
    process.env.SUPABASE_URL = 'https://x.supabase.co'
    process.env.SUPABASE_SERVICE_KEY = 'secret'
    const { createClient } = await import('@supabase/supabase-js')
    const { getSupabase } = await import('./supabase')

    const first = getSupabase()
    const second = getSupabase()

    expect(first).toBe(second)
    expect(createClient).toHaveBeenCalledTimes(1)
    expect(createClient).toHaveBeenCalledWith(
      'https://x.supabase.co',
      'secret',
      expect.objectContaining({ auth: { persistSession: false } })
    )
  })
})
