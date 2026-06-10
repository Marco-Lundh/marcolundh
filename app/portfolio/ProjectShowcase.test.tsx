import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import ProjectShowcase from './ProjectShowcase'

vi.mock('framer-motion')
vi.mock('next/link')

describe('ProjectShowcase', () => {
  it('renders the heading and every project', () => {
    renderWith(<ProjectShowcase />)
    expect(screen.getByText('Selected work')).toBeInTheDocument()
    expect(screen.getByText('AI News automation')).toBeInTheDocument()
    expect(screen.getByText('Job Radar')).toBeInTheDocument()
    expect(screen.getByText('CV Fit Score')).toBeInTheDocument()
    expect(screen.getByText('DocuChat')).toBeInTheDocument()
  })

  it('embeds the live demo (no static gallery) for AI News', () => {
    renderWith(<ProjectShowcase />)
    expect(screen.getByText('Live demo')).toBeInTheDocument()
    // The embedded SubscribeForm renders its email field.
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
  })

  it('switches the hero image when a thumbnail is clicked', () => {
    renderWith(<ProjectShowcase />)
    // Job Radar has multiple screenshots — view 1 is the initial hero.
    expect(
      screen.getByRole('button', { name: 'Enlarge Job Radar screenshot 1' })
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Show Job Radar screenshot 3' })
    )

    expect(
      screen.getByRole('button', { name: 'Enlarge Job Radar screenshot 3' })
    ).toBeInTheDocument()
  })

  it('opens a lightbox dialog and closes it with Escape', async () => {
    renderWith(<ProjectShowcase />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Enlarge DocuChat screenshot 1' })
    )
    expect(
      screen.getByRole('dialog', { name: 'DocuChat screenshot 1' })
    ).toBeInTheDocument()

    fireEvent.keyDown(document.body, { key: 'Escape' })
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
  })

  it('renders a GitHub "View code" link for each of the four projects', () => {
    renderWith(<ProjectShowcase />)
    const codeLinks = screen
      .getAllByRole('link')
      .filter((l) =>
        l.getAttribute('href')?.startsWith('https://github.com/Marco-Lundh/')
      )
    expect(codeLinks).toHaveLength(4)
  })
})
