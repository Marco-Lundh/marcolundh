import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent, waitFor, within } from '@testing-library/react'
import { renderWith } from '@/test/utils'
import ProjectShowcase from './ProjectShowcase'

vi.mock('framer-motion')
vi.mock('next/link')

describe('ProjectShowcase', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('renders the heading and every project', () => {
    renderWith(<ProjectShowcase />)
    expect(screen.getByText('Selected work')).toBeInTheDocument()
    expect(screen.getByText('PulseGraph')).toBeInTheDocument()
    expect(screen.getByText('AI News automation')).toBeInTheDocument()
    expect(screen.getByText('Job Radar')).toBeInTheDocument()
    expect(screen.getByText('CV Fit Score')).toBeInTheDocument()
    expect(screen.getByText('DocuChat')).toBeInTheDocument()
  })

  it('shows the AI News gallery without a feed link while AI News is paused', () => {
    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', '')
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', 'true')
    renderWith(<ProjectShowcase />)
    expect(
      screen.getByRole('button', { name: 'Enlarge AI News automation screenshot 1' })
    ).toBeInTheDocument()
    expect(screen.queryByText('Live demo')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Open the full feed →' })).not.toBeInTheDocument()
  })

  it('shows a screenshot gallery for AI News while the newsletter is paused', () => {
    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', 'true')
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', '')
    renderWith(<ProjectShowcase />)
    expect(
      screen.getByRole('button', { name: 'Enlarge AI News automation screenshot 1' })
    ).toBeInTheDocument()
    expect(screen.queryByText('Live demo')).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText('your@email.com')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open the full feed →' })).toHaveAttribute(
      'href',
      '/ai-news'
    )
  })

  it('embeds the live signup demo for AI News when the newsletter is enabled', () => {
    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', 'true')
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', 'true')
    renderWith(<ProjectShowcase />)
    expect(screen.getByText('Live demo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Enlarge AI News automation screenshot 1' })
    ).not.toBeInTheDocument()
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

  it('navigates between images inside the lightbox with arrow buttons and keyboard', () => {
    renderWith(<ProjectShowcase />)

    // Open lightbox on PulseGraph image 1 (15 images total).
    fireEvent.click(
      screen.getByRole('button', { name: 'Enlarge PulseGraph screenshot 1' })
    )
    expect(
      screen.getByRole('dialog', { name: 'PulseGraph screenshot 1' })
    ).toBeInTheDocument()

    const dialog = () => screen.getByRole('dialog', { name: /PulseGraph screenshot \d+/ })

    // No previous button on the first image — scope to the lightbox.
    expect(within(dialog()).queryByRole('button', { name: 'Previous image' })).not.toBeInTheDocument()
    expect(within(dialog()).getByRole('button', { name: 'Next image' })).toBeInTheDocument()

    // Advance with the next button inside the lightbox.
    fireEvent.click(within(dialog()).getByRole('button', { name: 'Next image' }))
    expect(
      screen.getByRole('dialog', { name: 'PulseGraph screenshot 2' })
    ).toBeInTheDocument()
    expect(within(dialog()).getByRole('button', { name: 'Previous image' })).toBeInTheDocument()

    // Go back with ArrowLeft keyboard shortcut (bubbles from body → window).
    fireEvent.keyDown(document.body, { key: 'ArrowLeft' })
    expect(
      screen.getByRole('dialog', { name: 'PulseGraph screenshot 1' })
    ).toBeInTheDocument()

    // ArrowRight keyboard shortcut.
    fireEvent.keyDown(document.body, { key: 'ArrowRight' })
    expect(
      screen.getByRole('dialog', { name: 'PulseGraph screenshot 2' })
    ).toBeInTheDocument()
  })

  it('shows and hides the long PulseGraph description with Read more / Read less', () => {
    renderWith(<ProjectShowcase />)

    // All project descriptions exceed 200 chars — target the first toggle (PulseGraph).
    const toggles = screen.getAllByRole('button', { name: 'Read more' })
    const toggle = toggles[0]
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    // After expanding, the same button now reads "Read less".
    const collapse = screen.getAllByRole('button', { name: 'Read less' })[0]
    expect(collapse).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(collapse)
    expect(screen.getAllByRole('button', { name: 'Read more' })[0]).toHaveAttribute('aria-expanded', 'false')
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
