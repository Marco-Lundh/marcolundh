import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import StatusCard from './StatusCard'

vi.mock('framer-motion')
vi.mock('next/link')

describe('StatusCard', () => {
  it('shows the confirmed message on the confirm page', () => {
    renderWith(<StatusCard page="confirm" kind="confirmed" />)
    expect(screen.getByText("You're subscribed!")).toBeInTheDocument()
    expect(screen.getByText(/every morning at 07:00 CET/i)).toBeInTheDocument()
  })

  it('shows the already-confirmed message', () => {
    renderWith(<StatusCard page="confirm" kind="already" />)
    expect(screen.getByText('Already confirmed')).toBeInTheDocument()
  })

  it('shows the unsubscribed message on the unsubscribe page', () => {
    renderWith(<StatusCard page="unsubscribe" kind="unsubscribed" />)
    expect(screen.getByText("You're unsubscribed")).toBeInTheDocument()
  })

  it('renders the invalid state with error styling', () => {
    renderWith(<StatusCard page="confirm" kind="invalid" />)
    const heading = screen.getByText('Invalid or expired link')
    expect(heading).toBeInTheDocument()
    expect(heading.className).toContain('text-red-400')
  })

  it('renders Swedish copy when language is sv', () => {
    renderWith(<StatusCard page="confirm" kind="confirmed" />, 'sv')
    expect(screen.getByText('Du prenumererar!')).toBeInTheDocument()
  })

  it('links back to the ai-news page', () => {
    renderWith(<StatusCard page="confirm" kind="confirmed" />)
    expect(
      screen.getByText('← marco-tech.se/ai-news').closest('a')
    ).toHaveAttribute('href', '/ai-news')
  })
})
