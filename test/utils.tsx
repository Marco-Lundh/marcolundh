import React from 'react'
import { render } from '@testing-library/react'
import { LanguageProvider } from '@/contexts/LanguageContext'

export function renderWith(ui: React.ReactElement, lang: 'en' | 'sv' = 'en') {
  Object.defineProperty(navigator, 'language', {
    value: lang === 'sv' ? 'sv-SE' : 'en-US',
    configurable: true,
  })
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}
