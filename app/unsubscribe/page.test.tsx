import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/components/StatusCard', () => ({
  default: ({ page, kind }: { page: string; kind: string }) => (
    <div data-testid="status" data-page={page} data-kind={kind} />
  ),
}))

vi.mock('@/components/UnsubscribeButton', () => ({
  default: ({ token }: { token: string }) => (
    <div data-testid="button" data-token={token} />
  ),
}))

import UnsubscribePage from './page'

describe('UnsubscribePage', () => {
  it('shows the invalid status card when no token is given', async () => {
    const el = await UnsubscribePage({ searchParams: Promise.resolve({}) })
    render(el)
    const status = screen.getByTestId('status')
    expect(status.dataset.kind).toBe('invalid')
    expect(screen.queryByTestId('button')).not.toBeInTheDocument()
  })

  it('renders the confirm button when a token is present', async () => {
    const el = await UnsubscribePage({
      searchParams: Promise.resolve({ token: 'tok123' }),
    })
    render(el)
    expect(screen.getByTestId('button').dataset.token).toBe('tok123')
    expect(screen.queryByTestId('status')).not.toBeInTheDocument()
  })
})
