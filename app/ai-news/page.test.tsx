import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { redirect } from 'next/navigation'
import AiNews from './page'

vi.mock('framer-motion')
vi.mock('next/link')
// The real redirect() throws to abort rendering; mirror that.
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT')
  }),
}))

function renderPage() {
  return render(
    <LanguageProvider>
      <AiNews />
    </LanguageProvider>
  )
}

describe('AI News page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', 'true')
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', 'true')
  })

  it('redirects to the portfolio while AI News is paused', () => {
    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', '')
    expect(() => AiNews()).toThrow('NEXT_REDIRECT')
    expect(redirect).toHaveBeenCalledWith('/portfolio')
  })

  it('shows the feed without a signup form while the newsletter is paused', () => {
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', '')
    renderPage()
    expect(screen.getByText(/What matters in AI/i)).toBeInTheDocument()
    expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument()
    expect(screen.getByText(/Browse and filter by category/i)).toBeInTheDocument()
  })

  it('renders the headline', () => {
    renderPage()
    expect(screen.getByText(/What matters in AI/i)).toBeInTheDocument()
  })

  it('renders the email input with accessible label', () => {
    renderPage()
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
  })

  it('renders the subscribe button', () => {
    renderPage()
    expect(
      screen.getByRole('button', { name: 'Subscribe' })
    ).toBeInTheDocument()
  })

  it('shows loading state while submitting', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {}))
    )
    renderPage()
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(
      screen.getByRole('button', { name: 'Subscribing…' })
    ).toBeInTheDocument()
  })

  it('shows confirmation prompt after subscribe', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: true }))
    )
    renderPage()
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    await waitFor(() =>
      expect(screen.getByText(/check your inbox/i)).toBeInTheDocument()
    )
  })

  it('shows error state when request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false }))
    )
    renderPage()
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    )
  })

  it('renders free/unsubscribe disclaimer', () => {
    renderPage()
    expect(
      screen.getByText(/Free · Unsubscribe anytime/i)
    ).toBeInTheDocument()
  })
})
