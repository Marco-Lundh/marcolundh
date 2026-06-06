import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import Experience from './Experience'

vi.mock('framer-motion')

describe('Experience', () => {
  it('renders English section heading', () => {
    renderWith(<Experience />)
    expect(screen.getByText("Where I've worked")).toBeInTheDocument()
  })

  it('renders all 5 company names', () => {
    renderWith(<Experience />)
    expect(screen.getByText('Brite Payments AB')).toBeInTheDocument()
    expect(screen.getByText('Sigma Technology Systems AB')).toBeInTheDocument()
    expect(screen.getByText('ContextVision AB')).toBeInTheDocument()
    expect(screen.getByText('Östgötatrafiken AB')).toBeInTheDocument()
    expect(
      screen.getByText('Nokia Home Communications & earlier')
    ).toBeInTheDocument()
  })

  it('hides job details before clicking', () => {
    renderWith(<Experience />)
    expect(
      screen.queryByText(/prompt engineering for architecture/i)
    ).not.toBeInTheDocument()
  })

  it('shows job details after clicking a company', () => {
    renderWith(<Experience />)
    fireEvent.click(screen.getByText('Brite Payments AB'))
    expect(
      screen.getByText(/prompt engineering for architecture/i)
    ).toBeInTheDocument()
  })

  it('collapses details on second click', () => {
    renderWith(<Experience />)
    fireEvent.click(screen.getByText('Brite Payments AB'))
    expect(
      screen.getByText(/prompt engineering for architecture/i)
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText('Brite Payments AB'))
    expect(
      screen.queryByText(/prompt engineering for architecture/i)
    ).not.toBeInTheDocument()
  })

  it('shows stack tags when job is expanded', () => {
    renderWith(<Experience />)
    fireEvent.click(screen.getByText('ContextVision AB'))
    expect(screen.getByText('Elasticsearch')).toBeInTheDocument()
    expect(screen.getByText('Celery')).toBeInTheDocument()
  })

  it('shows bullet points for Sigma Technology', () => {
    renderWith(<Experience />)
    fireEvent.click(screen.getByText('Sigma Technology Systems AB'))
    expect(screen.getByText(/NIRA Dynamics/i)).toBeInTheDocument()
    expect(screen.getByText(/Ericsson/i)).toBeInTheDocument()
  })

  it('can expand multiple jobs independently', () => {
    renderWith(<Experience />)
    fireEvent.click(screen.getByText('Brite Payments AB'))
    fireEvent.click(screen.getByText('ContextVision AB'))
    expect(
      screen.getByText(/prompt engineering for architecture/i)
    ).toBeInTheDocument()
    expect(screen.getByText('Elasticsearch')).toBeInTheDocument()
  })
})
