import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import UnsubscribeButton from './UnsubscribeButton'

vi.mock('framer-motion')
vi.mock('next/link')

describe('UnsubscribeButton', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the unsubscribe prompt initially', () => {
    renderWith(<UnsubscribeButton token="tok123" />)
    expect(
      screen.getByRole('button', { name: 'Unsubscribe' })
    ).toBeInTheDocument()
  })

  it('POSTs the token and shows confirmation on click', async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    renderWith(<UnsubscribeButton token="tok123" />)
    fireEvent.click(screen.getByRole('button', { name: 'Unsubscribe' }))

    await waitFor(() =>
      expect(screen.getByText("You're unsubscribed")).toBeInTheDocument()
    )
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/unsubscribe?token=tok123',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('still shows confirmation if the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('network')))
    )

    renderWith(<UnsubscribeButton token="tok123" />)
    fireEvent.click(screen.getByRole('button', { name: 'Unsubscribe' }))

    await waitFor(() =>
      expect(screen.getByText("You're unsubscribed")).toBeInTheDocument()
    )
  })
})
