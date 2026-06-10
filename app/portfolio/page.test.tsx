import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import Portfolio from './page'

vi.mock('framer-motion')
vi.mock('next/link')

describe('Portfolio (projects) page', () => {
  it('renders nav logo', () => {
    renderWith(<Portfolio />)
    expect(screen.getAllByText('marco-tech.se').length).toBeGreaterThan(0)
  })

  it('renders the showcase heading', () => {
    renderWith(<Portfolio />)
    expect(screen.getByText('Selected work')).toBeInTheDocument()
  })

  it('renders all four projects', () => {
    renderWith(<Portfolio />)
    expect(screen.getByText('AI News automation')).toBeInTheDocument()
    expect(screen.getByText('Job Radar')).toBeInTheDocument()
    expect(screen.getByText('CV Fit Score')).toBeInTheDocument()
    expect(screen.getByText('DocuChat')).toBeInTheDocument()
  })

  it('renders the embedded live demo label', () => {
    renderWith(<Portfolio />)
    expect(screen.getByText('Live demo')).toBeInTheDocument()
  })

  it('renders a "View code" link to GitHub for every project', () => {
    renderWith(<Portfolio />)
    const codeLinks = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href')?.startsWith('https://github.com/Marco-Lundh/'))
    expect(codeLinks.length).toBe(4)
  })

  it('links to the full AI News feed', () => {
    renderWith(<Portfolio />)
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/ai-news')
    expect(links.length).toBeGreaterThan(0)
  })
})
