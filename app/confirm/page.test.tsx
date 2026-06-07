import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const { fromMock, maybeSingle, eqUpdate } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  maybeSingle: vi.fn(),
  eqUpdate: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  getSupabase: () => ({ from: fromMock }),
}))

vi.mock('@/components/StatusCard', () => ({
  default: ({ page, kind }: { page: string; kind: string }) => (
    <div data-testid="status" data-page={page} data-kind={kind} />
  ),
}))

import ConfirmPage from './page'

async function renderPage(token?: string) {
  const el = await ConfirmPage({ searchParams: Promise.resolve({ token }) })
  render(el)
  return screen.getByTestId('status')
}

describe('ConfirmPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fromMock.mockReturnValue({
      select: () => ({ eq: () => ({ maybeSingle }) }),
      update: () => ({ eq: eqUpdate }),
    })
    eqUpdate.mockResolvedValue({ error: null })
  })

  it('returns invalid when no token is provided', async () => {
    const status = await renderPage(undefined)
    expect(status.dataset.kind).toBe('invalid')
    expect(maybeSingle).not.toHaveBeenCalled()
  })

  it('returns invalid when the token is not found', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null })
    const status = await renderPage('nope')
    expect(status.dataset.kind).toBe('invalid')
  })

  it('returns already when the subscriber is active', async () => {
    maybeSingle.mockResolvedValue({
      data: { id: '1', status: 'active' },
      error: null,
    })
    const status = await renderPage('tok')
    expect(status.dataset.kind).toBe('already')
  })

  it('confirms a pending subscriber', async () => {
    maybeSingle.mockResolvedValue({
      data: { id: '1', status: 'pending' },
      error: null,
    })
    const status = await renderPage('tok')
    expect(status.dataset.kind).toBe('confirmed')
    expect(status.dataset.page).toBe('confirm')
    expect(eqUpdate).toHaveBeenCalledOnce()
  })

  it('returns invalid when the update fails', async () => {
    maybeSingle.mockResolvedValue({
      data: { id: '1', status: 'pending' },
      error: null,
    })
    eqUpdate.mockResolvedValue({ error: { message: 'fail' } })
    const status = await renderPage('tok')
    expect(status.dataset.kind).toBe('invalid')
  })

  it('returns invalid when the database throws', async () => {
    maybeSingle.mockRejectedValue(new Error('db down'))
    const status = await renderPage('tok')
    expect(status.dataset.kind).toBe('invalid')
  })
})
