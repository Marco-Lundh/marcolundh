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

  it('renders the Portfolio section card', () => {
    render(<Home />)
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByText('View projects →')).toBeInTheDocument()
  })

  it('renders the About me section card', () => {
    render(<Home />)
    expect(screen.getByText('About me')).toBeInTheDocument()
    expect(screen.getByText('Read my story →')).toBeInTheDocument()
  })

  it('Portfolio card links to /portfolio', () => {
    render(<Home />)
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/portfolio')
    expect(links.length).toBe(1)
  })

  it('About me card links to /about', () => {
    render(<Home />)
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/about')
    expect(links.length).toBe(1)
  })
})
