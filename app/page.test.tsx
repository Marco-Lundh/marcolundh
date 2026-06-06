import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

vi.mock('framer-motion')
vi.mock('next/link')

describe('Home page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(
      screen.getByText('AI Engineering & Automation')
    ).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Home />)
    expect(
      screen.getByText(/Python-first development/i)
    ).toBeInTheDocument()
  })

  it('renders the AI News section card', () => {
    render(<Home />)
    expect(screen.getByText('AI News')).toBeInTheDocument()
    expect(screen.getByText('Read more →')).toBeInTheDocument()
  })

  it('renders the Portfolio section card', () => {
    render(<Home />)
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByText('View portfolio →')).toBeInTheDocument()
  })

  it('AI News card links to /ai-news', () => {
    render(<Home />)
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/ai-news')
    expect(links.length).toBe(1)
  })

  it('Portfolio card links to /portfolio', () => {
    render(<Home />)
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/portfolio')
    expect(links.length).toBe(1)
  })
})
