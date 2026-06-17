import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import Home from './page'

vi.mock('framer-motion')
vi.mock('next/link')

describe('Home page', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    })
  })

  it('renders the main heading', () => {
    renderWith(<Home />)
    expect(
      screen.getByText('AI Engineering & Automation')
    ).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    renderWith(<Home />)
    expect(
      screen.getByText(/AI-native development/i)
    ).toBeInTheDocument()
  })

  it('renders the nav logo', () => {
    renderWith(<Home />)
    expect(screen.getAllByText('marco-tech.se').length).toBeGreaterThan(0)
  })

  it('renders the Portfolio section card', () => {
    renderWith(<Home />)
    expect(screen.getByText('View projects →')).toBeInTheDocument()
  })

  it('renders the About me section card', () => {
    renderWith(<Home />)
    expect(screen.getByText('About me')).toBeInTheDocument()
    expect(screen.getByText('Read my story →')).toBeInTheDocument()
  })

  it('Portfolio card links to /portfolio', () => {
    renderWith(<Home />)
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/portfolio')
    expect(links.length).toBeGreaterThan(0)
  })

  it('About me card links to /about', () => {
    renderWith(<Home />)
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/about')
    expect(links.length).toBeGreaterThan(0)
  })
})
