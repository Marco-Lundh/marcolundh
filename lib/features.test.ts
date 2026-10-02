import { describe, it, expect, vi, afterEach } from 'vitest'
import { isAiNewsEnabled, isNewsletterEnabled } from './features'

describe('isAiNewsEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('is off by default', () => {
    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', '')
    expect(isAiNewsEnabled()).toBe(false)
  })

  it('is on only when the flag is exactly "true"', () => {
    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', 'true')
    expect(isAiNewsEnabled()).toBe(true)

    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', '1')
    expect(isAiNewsEnabled()).toBe(false)
  })
})

describe('isNewsletterEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('is off by default', () => {
    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', 'true')
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', '')
    expect(isNewsletterEnabled()).toBe(false)
  })

  it('is on only when the flag is exactly "true"', () => {
    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', 'true')
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', 'true')
    expect(isNewsletterEnabled()).toBe(true)

    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', '1')
    expect(isNewsletterEnabled()).toBe(false)
  })

  it('stays off while AI News itself is paused', () => {
    vi.stubEnv('NEXT_PUBLIC_AI_NEWS_ENABLED', '')
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', 'true')
    expect(isNewsletterEnabled()).toBe(false)
  })
})
