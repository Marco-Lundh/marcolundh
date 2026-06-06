import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import Contact from './Contact'

vi.mock('framer-motion')

describe('Contact', () => {
  it('renders English heading', () => {
    renderWith(<Contact />)
    expect(screen.getByText("Let's work together")).toBeInTheDocument()
  })

  it('renders contact body text', () => {
    renderWith(<Contact />)
    expect(
      screen.getByText(/currently open to new opportunities/i)
    ).toBeInTheDocument()
  })

  it('all LinkedIn links have correct href', () => {
    renderWith(<Contact />)
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href')?.includes('linkedin.com'))
    expect(links.length).toBeGreaterThan(0)
    links.forEach((l) =>
      expect(l).toHaveAttribute(
        'href',
        'https://www.linkedin.com/in/marcolundh'
      )
    )
  })

  it('renders Swedish heading when language is sv', () => {
    renderWith(<Contact />, 'sv')
    expect(screen.getByText('Låt oss jobba ihop')).toBeInTheDocument()
  })
})
