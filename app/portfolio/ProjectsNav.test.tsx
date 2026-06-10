import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import ProjectsNav from './ProjectsNav'

vi.mock('next/link')

describe('ProjectsNav', () => {
  it('renders the brand and About / AI News links', () => {
    renderWith(<ProjectsNav />)
    expect(screen.getByText('marco-tech.se')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('AI News')).toBeInTheDocument()
  })

  it('shows the home link in English by default', () => {
    renderWith(<ProjectsNav />, 'en')
    expect(screen.getByText('← Home')).toBeInTheDocument()
  })

  it('toggles to Swedish labels when the SV/EN button is clicked', () => {
    renderWith(<ProjectsNav />, 'en')
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Swedish' }))
    expect(screen.getByText('Om mig')).toBeInTheDocument()
    expect(screen.getByText('← Hem')).toBeInTheDocument()
  })
})
