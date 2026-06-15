import { describe, it, expect } from 'vitest'
import { translations, type Language } from './translations'

const languages: Language[] = ['en', 'sv']

describe('translations', () => {
  it('has both English and Swedish', () => {
    expect(translations.en).toBeDefined()
    expect(translations.sv).toBeDefined()
  })

  it.each(languages)('%s has all required top-level keys', (lang) => {
    const t = translations[lang]
    expect(t.home).toBeDefined()
    expect(t.hero).toBeDefined()
    expect(t.about).toBeDefined()
    expect(t.experience).toBeDefined()
    expect(t.skills).toBeDefined()
    expect(t.contact).toBeDefined()
  })

  it.each(languages)('%s home has heading, subtitle and two cards', (lang) => {
    const home = translations[lang].home
    expect(home.heading).toBeTruthy()
    expect(home.subtitle).toBeTruthy()
    expect(home.portfolio.label).toBeTruthy()
    expect(home.portfolio.cta).toBeTruthy()
    expect(home.about.label).toBeTruthy()
    expect(home.about.cta).toBeTruthy()
  })

  it.each(languages)(
    '%s hero has greeting, description and linkedin',
    (lang) => {
      const h = translations[lang].hero
      expect(h.greeting).toBeTruthy()
      expect(h.description).toBeTruthy()
      expect(h.linkedin).toBeTruthy()
    }
  )

  it.each(languages)('%s about has 4 stats with value and label', (lang) => {
    const stats = translations[lang].about.stats
    expect(stats).toHaveLength(4)
    stats.forEach((s) => {
      expect(s.value).toBeTruthy()
      expect(s.label).toBeTruthy()
    })
  })

  it.each(languages)('%s skills has 4 categories with label and tags', (lang) => {
    const categories = translations[lang].skills.categories
    expect(categories).toHaveLength(4)
    categories.forEach((c) => {
      expect(c.label).toBeTruthy()
      expect(c.tags.length).toBeGreaterThan(0)
    })
  })

  it('English and Swedish have same structure', () => {
    const enKeys = Object.keys(translations.en).sort()
    const svKeys = Object.keys(translations.sv).sort()
    expect(enKeys).toEqual(svKeys)
  })
})
