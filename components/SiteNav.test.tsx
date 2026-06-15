import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import SiteNav from './SiteNav'

vi.mock('next/link')

describe('SiteNav', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    })
  })

  it('renders the logo as a home link', () => {
    renderWith(<SiteNav />)
    const logo = screen.getByText('marco-tech.se')
    expect(logo).toBeInTheDocument()
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  it('renders only the brand link and the language toggle', () => {
    renderWith(<SiteNav />)
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('does not render section or page links', () => {
    renderWith(<SiteNav />)
    expect(screen.queryByText('Portfolio')).not.toBeInTheDocument()
    expect(screen.queryByText('About')).not.toBeInTheDocument()
    expect(screen.queryByText('AI News')).not.toBeInTheDocument()
  })

  it('shows SV toggle when language is English', () => {
    renderWith(<SiteNav />)
    const toggle = screen.getByRole('button', { name: 'Switch to Swedish' })
    expect(toggle.textContent).toBe('SV')
  })

  it('switches to Swedish on toggle click', () => {
    renderWith(<SiteNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Swedish' }))
    expect(
      screen.getByRole('button', { name: 'Byt till engelska' }).textContent
    ).toBe('EN')
  })

  it('shows the EN toggle when browser language is Swedish', () => {
    renderWith(<SiteNav />, 'sv')
    const toggle = screen.getByRole('button', { name: 'Byt till engelska' })
    expect(toggle.textContent).toBe('EN')
  })

  it('persists chosen language to localStorage', () => {
    renderWith(<SiteNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Swedish' }))
    expect(localStorage.getItem('lang')).toBe('sv')
  })

  it('reads persisted language from localStorage on mount', () => {
    localStorage.setItem('lang', 'sv')
    renderWith(<SiteNav />)
    expect(
      screen.getByRole('button', { name: 'Byt till engelska' }).textContent
    ).toBe('EN')
  })

  it('has accessible nav landmark', () => {
    renderWith(<SiteNav />)
    expect(screen.getByRole('navigation', { name: 'Site navigation' })).toBeInTheDocument()
  })
})
