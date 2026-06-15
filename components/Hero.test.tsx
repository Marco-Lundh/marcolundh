import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import Hero from './Hero'

vi.mock('framer-motion')

describe('Hero', () => {
  it('renders full name', () => {
    renderWith(<Hero />)
    expect(screen.getByText('Marco Lundh')).toBeInTheDocument()
  })

  it('renders job title', () => {
    renderWith(<Hero />)
    expect(
      screen.getByText('Senior Fullstack & Backend Developer · Python · AI · Cloud')
    ).toBeInTheDocument()
  })

  it('renders English greeting', () => {
    renderWith(<Hero />)
    expect(screen.getByText('Hello, world.')).toBeInTheDocument()
  })

  it('renders LinkedIn link with correct href', () => {
    renderWith(<Hero />)
    const link = screen.getByRole('link', { name: /linkedin/i })
    expect(link).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/marcolundh'
    )
  })

  it('renders years of experience highlight', () => {
    renderWith(<Hero />)
    expect(screen.getByText('13+ years')).toBeInTheDocument()
  })
})
