import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Portfolio from './page'

vi.mock('framer-motion')
vi.mock('next/link')

describe('Portfolio page', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    })
  })

  it('renders Marco Lundh name from Hero', () => {
    render(<Portfolio />)
    expect(screen.getByText('Marco Lundh')).toBeInTheDocument()
  })

  it('renders nav logo', () => {
    render(<Portfolio />)
    expect(screen.getByText('marco-tech.se')).toBeInTheDocument()
  })

  it('renders About section heading', () => {
    render(<Portfolio />)
    expect(screen.getByText('Who am I?')).toBeInTheDocument()
  })

  it('renders Skills section heading', () => {
    render(<Portfolio />)
    expect(screen.getByText('What I work with')).toBeInTheDocument()
  })

  it('renders Contact section heading', () => {
    render(<Portfolio />)
    expect(screen.getByText("Let's work together")).toBeInTheDocument()
  })
})
