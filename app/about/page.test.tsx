import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import AboutPage from './page'

vi.mock('framer-motion')
vi.mock('next/link')

describe('About (CV) page', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    })
  })

  it('renders Marco Lundh name from Hero', () => {
    renderWith(<AboutPage />)
    expect(screen.getByText('Marco Lundh')).toBeInTheDocument()
  })

  it('renders nav logo', () => {
    renderWith(<AboutPage />)
    expect(screen.getByText('marco-tech.se')).toBeInTheDocument()
  })

  it('renders About section heading', () => {
    renderWith(<AboutPage />)
    expect(screen.getByText('Who am I?')).toBeInTheDocument()
  })

  it('renders Skills section heading', () => {
    renderWith(<AboutPage />)
    expect(screen.getByText('What I work with')).toBeInTheDocument()
  })

  it('renders Contact section heading', () => {
    renderWith(<AboutPage />)
    expect(screen.getByText("Let's work together")).toBeInTheDocument()
  })
})
