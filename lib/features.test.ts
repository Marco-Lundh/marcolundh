import { describe, it, expect, vi, afterEach } from 'vitest'
import { isNewsletterEnabled } from './features'

describe('isNewsletterEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('is off by default', () => {
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', '')
    expect(isNewsletterEnabled()).toBe(false)
  })

  it('is on only when the flag is exactly "true"', () => {
    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', 'true')
    expect(isNewsletterEnabled()).toBe(true)

    vi.stubEnv('NEXT_PUBLIC_NEWSLETTER_ENABLED', '1')
    expect(isNewsletterEnabled()).toBe(false)
  })
})
