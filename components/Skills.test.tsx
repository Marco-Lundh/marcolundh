import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import Skills from './Skills'

vi.mock('framer-motion')

describe('Skills', () => {
  it('renders English heading', () => {
    renderWith(<Skills />)
    expect(screen.getByText('What I work with')).toBeInTheDocument()
  })

  it('renders all 4 English category labels', () => {
    renderWith(<Skills />)
    expect(screen.getByText('AI & Automation')).toBeInTheDocument()
    expect(screen.getByText('Frameworks & Databases')).toBeInTheDocument()
    expect(screen.getByText('Cloud & Infrastructure')).toBeInTheDocument()
    expect(screen.getByText('Tools & Methods')).toBeInTheDocument()
  })

  it('renders core skill bar names', () => {
    renderWith(<Skills />)
    expect(screen.getByText('Python')).toBeInTheDocument()
    // FastAPI and Docker appear in both skill bars and category tags
    expect(screen.getAllByText('FastAPI').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('Docker').length).toBeGreaterThanOrEqual(2)
  })

  it('renders AI category tags', () => {
    renderWith(<Skills />)
    expect(screen.getByText('LLM Integration')).toBeInTheDocument()
    expect(screen.getByText('Prompt Engineering')).toBeInTheDocument()
    expect(screen.getByText('RAG')).toBeInTheDocument()
  })

  it('renders Swedish category labels when language is sv', () => {
    renderWith(<Skills />, 'sv')
    expect(screen.getByText('Ramverk & Databaser')).toBeInTheDocument()
    expect(screen.getByText('Moln & Infrastruktur')).toBeInTheDocument()
  })
})
