import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ArticleList from './ArticleList'
import type { Article } from '@/lib/types'

vi.mock('framer-motion')

function makeArticle(over: Partial<Article> = {}): Article {
  return {
    title: 'Some AI headline',
    url: 'https://example.com/a',
    source: 'Example',
    summary: 'A short summary.',
    category: 'LLMs & Models',
    reading_time_minutes: 3,
    published: '2026-06-07',
    ...over,
  }
}

describe('ArticleList', () => {
  it('shows a placeholder when there are no articles', () => {
    render(<ArticleList articles={[]} />)
    expect(screen.getByText(/being curated/i)).toBeInTheDocument()
  })

  it('renders all articles and the story count', () => {
    const articles = [
      makeArticle({ title: 'First', url: 'https://example.com/1' }),
      makeArticle({
        title: 'Second',
        url: 'https://example.com/2',
        category: 'Open Source AI',
      }),
    ]
    render(<ArticleList articles={articles} />)
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText(/2 stories/i)).toBeInTheDocument()
  })

  it('only shows category buttons for categories that have articles', () => {
    const articles = [makeArticle({ category: 'LLMs & Models' })]
    render(<ArticleList articles={articles} />)
    expect(
      screen.getByRole('button', { name: /LLMs & Models/ })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Ethics & Policy/ })
    ).not.toBeInTheDocument()
  })

  it('filters articles when a category is selected and toggles back', () => {
    const articles = [
      makeArticle({ title: 'LLM story', category: 'LLMs & Models' }),
      makeArticle({
        title: 'OSS story',
        url: 'https://example.com/2',
        category: 'Open Source AI',
      }),
    ]
    render(<ArticleList articles={articles} />)

    fireEvent.click(screen.getByRole('button', { name: /Open Source AI/ }))
    expect(screen.getByText('OSS story')).toBeInTheDocument()
    expect(screen.queryByText('LLM story')).not.toBeInTheDocument()

    // Clicking the active category again clears the filter.
    fireEvent.click(screen.getByRole('button', { name: /Open Source AI/ }))
    expect(screen.getByText('LLM story')).toBeInTheDocument()
  })

  it('restores all articles via the All button', () => {
    const articles = [
      makeArticle({ title: 'LLM story', category: 'LLMs & Models' }),
      makeArticle({
        title: 'OSS story',
        url: 'https://example.com/2',
        category: 'Open Source AI',
      }),
    ]
    render(<ArticleList articles={articles} />)
    fireEvent.click(screen.getByRole('button', { name: /Open Source AI/ }))
    expect(screen.queryByText('LLM story')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('LLM story')).toBeInTheDocument()
    expect(screen.getByText('OSS story')).toBeInTheDocument()
  })
})
