import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import Nav from './Nav'

vi.mock('framer-motion')
vi.mock('next/link')

describe('Nav', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    })
  })

  it('renders the logo', () => {
    renderWith(<Nav />)
    expect(screen.getByText('marco-tech.se')).toBeInTheDocument()
  })

  it('renders English nav links', () => {
    renderWith(<Nav />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('shows SV toggle when language is English', () => {
    renderWith(<Nav />)
    expect(screen.getAllByText('SV').length).toBeGreaterThan(0)
  })

  it('switches to Swedish on toggle click', () => {
    renderWith(<Nav />)
    fireEvent.click(screen.getAllByText('SV')[0])
    expect(screen.getAllByText('EN').length).toBeGreaterThan(0)
  })

  it('renders Swedish nav links after toggle', () => {
    renderWith(<Nav />)
    fireEvent.click(screen.getAllByText('SV')[0])
    expect(screen.getByText('Om mig')).toBeInTheDocument()
    expect(screen.getByText('Erfarenhet')).toBeInTheDocument()
  })
})
