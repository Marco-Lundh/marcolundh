import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import SubscribeForm from './SubscribeForm'

vi.mock('framer-motion')

describe('SubscribeForm', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', 'true')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('hides the signup form but keeps the heading while the newsletter is paused', () => {
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', '')
    renderWith(<SubscribeForm />)
    expect(screen.getByText(/What matters in AI/i)).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('your@email.com')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Subscribe' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Unsubscribe anytime/i)).not.toBeInTheDocument()
  })

  it('renders the email field and subscribe button', () => {
    renderWith(<SubscribeForm />)
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('shows the subheading in default mode', () => {
    renderWith(<SubscribeForm />)
    expect(screen.getByText(/ranked and summarized by Claude/i)).toBeInTheDocument()
  })

  it('hides the heading and subheading in compact mode but keeps the form', () => {
    renderWith(<SubscribeForm compact />)
    expect(screen.queryByText(/ranked and summarized by Claude/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('posts the email and current language, then shows success', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true } as Response)

    renderWith(<SubscribeForm />, 'sv')
    fireEvent.change(screen.getByPlaceholderText(/@/), {
      target: { value: 'me@example.com' },
    })
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() =>
      expect(
        screen.getByText('Nästan klart - kolla din inkorg')
      ).toBeInTheDocument()
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/subscribe',
      expect.objectContaining({ method: 'POST' })
    )
    const body = JSON.parse(
      (fetchMock.mock.calls[0][1] as RequestInit).body as string
    )
    expect(body).toEqual({ email: 'me@example.com', language: 'sv' })
  })

  it('shows an error message when the request is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response)

    renderWith(<SubscribeForm />)
    fireEvent.change(screen.getByPlaceholderText(/@/), {
      target: { value: 'me@example.com' },
    })
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() =>
      expect(
        screen.getByText('Something went wrong - please try again.')
      ).toBeInTheDocument()
    )
  })

  it('shows an error message when fetch rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'))

    renderWith(<SubscribeForm />)
    fireEvent.change(screen.getByPlaceholderText(/@/), {
      target: { value: 'me@example.com' },
    })
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() =>
      expect(
        screen.getByText('Something went wrong - please try again.')
      ).toBeInTheDocument()
    )
  })
})
