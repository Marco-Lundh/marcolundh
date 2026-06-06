import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import About from './About'

vi.mock('framer-motion')

describe('About', () => {
  it('renders English heading', () => {
    renderWith(<About />)
    expect(screen.getByText('Who am I?')).toBeInTheDocument()
  })

  it('renders all 4 stat values', () => {
    renderWith(<About />)
    expect(screen.getByText('13+')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders English stat labels', () => {
    renderWith(<About />)
    expect(screen.getByText('Years Python')).toBeInTheDocument()
    expect(screen.getByText('Industries')).toBeInTheDocument()
    expect(screen.getByText('Companies')).toBeInTheDocument()
    expect(screen.getByText('Languages')).toBeInTheDocument()
  })

  it('renders Swedish stat labels when language is sv', () => {
    renderWith(<About />, 'sv')
    expect(screen.getByText('År Python')).toBeInTheDocument()
    expect(screen.getByText('Branscher')).toBeInTheDocument()
  })

  it('renders the quote', () => {
    renderWith(<About />)
    expect(
      screen.getByText(/A tight team can accomplish anything/i)
    ).toBeInTheDocument()
  })
})
