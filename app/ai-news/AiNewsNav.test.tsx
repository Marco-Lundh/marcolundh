import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import AiNewsNav from './AiNewsNav'

vi.mock('next/link')

describe('AiNewsNav', () => {
  it('renders the brand and Portfolio link', () => {
    renderWith(<AiNewsNav />)
    expect(screen.getByText('marco-tech.se')).toBeInTheDocument()
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
  })

  it('shows the home link in English by default', () => {
    renderWith(<AiNewsNav />, 'en')
    expect(screen.getByText('← Home')).toBeInTheDocument()
  })

  it('shows the home link in Swedish when language is sv', () => {
    renderWith(<AiNewsNav />, 'sv')
    expect(screen.getByText('← Hem')).toBeInTheDocument()
  })

  it('toggles language when the SV/EN button is clicked', () => {
    renderWith(<AiNewsNav />, 'en')
    const toggle = screen.getByRole('button', { name: 'Switch to Swedish' })
    expect(toggle.textContent).toBe('SV')
    fireEvent.click(toggle)
    expect(
      screen.getByRole('button', { name: 'Byt till engelska' }).textContent
    ).toBe('EN')
    expect(screen.getByText('← Hem')).toBeInTheDocument()
  })
})
