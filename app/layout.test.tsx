import { describe, it, expect } from 'vitest'
import { metadata } from './layout'

vi.mock('next/font/google')

describe('RootLayout metadata', () => {
  it('has correct title', () => {
    expect(metadata.title).toBe('marco-tech.se')
  })

  it('description mentions Marco Lundh', () => {
    expect(metadata.description).toContain('Marco Lundh')
  })

  it('openGraph title matches page title', () => {
    expect(metadata.openGraph?.title).toBe(metadata.title)
  })
})
