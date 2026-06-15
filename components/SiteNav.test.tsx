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

  it('renders Portfolio link pointing to /portfolio', () => {
    renderWith(<SiteNav />)
    const link = screen.getByText('Portfolio')
    expect(link.closest('a')).toHaveAttribute('href', '/portfolio')
  })

  it('renders About link pointing to /about (English)', () => {
    renderWith(<SiteNav />)
    const link = screen.getByText('About')
    expect(link.closest('a')).toHaveAttribute('href', '/about')
  })

  it('renders AI News link pointing to /ai-news (English)', () => {
    renderWith(<SiteNav />)
    const link = screen.getByText('AI News')
    expect(link.closest('a')).toHaveAttribute('href', '/ai-news')
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

  it('shows Swedish labels after toggle', () => {
    renderWith(<SiteNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Swedish' }))
    expect(screen.getByText('Om mig')).toBeInTheDocument()
    expect(screen.getByText('AI-nyheter')).toBeInTheDocument()
  })

  it('renders Swedish labels when browser language is Swedish', () => {
    renderWith(<SiteNav />, 'sv')
    expect(screen.getByText('Om mig')).toBeInTheDocument()
    expect(screen.getByText('AI-nyheter')).toBeInTheDocument()
  })

  it('persists chosen language to localStorage', () => {
    renderWith(<SiteNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Swedish' }))
    expect(localStorage.getItem('lang')).toBe('sv')
  })

  it('reads persisted language from localStorage on mount', () => {
    localStorage.setItem('lang', 'sv')
    renderWith(<SiteNav />)
    expect(screen.getByText('Om mig')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Byt till engelska' }).textContent
    ).toBe('EN')
  })

  it('has accessible nav landmark', () => {
    renderWith(<SiteNav />)
    expect(screen.getByRole('navigation', { name: 'Site navigation' })).toBeInTheDocument()
  })
})
