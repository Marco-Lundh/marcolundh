import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AiNews from './page'

vi.mock('framer-motion')
vi.mock('next/link')

describe('AI News page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the headline', () => {
    render(<AiNews />)
    expect(screen.getByText(/What matters in AI/i)).toBeInTheDocument()
  })

  it('renders the email input with accessible label', () => {
    render(<AiNews />)
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
  })

  it('renders the subscribe button', () => {
    render(<AiNews />)
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('shows loading state while submitting', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {}))
    )
    render(<AiNews />)
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(
      screen.getByRole('button', { name: 'Subscribing…' })
    ).toBeInTheDocument()
  })

  it('shows success state after subscribe', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: true }))
    )
    render(<AiNews />)
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    await waitFor(() =>
      expect(screen.getByText('Check your inbox.')).toBeInTheDocument()
    )
  })

  it('shows error state when request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false }))
    )
    render(<AiNews />)
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    )
  })

  it('renders free/unsubscribe disclaimer', () => {
    render(<AiNews />)
    expect(screen.getByText(/Free · Unsubscribe anytime/i)).toBeInTheDocument()
  })
})
