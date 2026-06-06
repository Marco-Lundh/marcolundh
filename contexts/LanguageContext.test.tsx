import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, useLanguage } from './LanguageContext'

function LangDisplay() {
  const { language, setLanguage, t } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="greeting">{t.hero.greeting}</span>
      <button onClick={() => setLanguage('sv')}>sv</button>
      <button onClick={() => setLanguage('en')}>en</button>
    </div>
  )
}

describe('LanguageContext', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    })
  })

  it('defaults to English', () => {
    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>
    )
    expect(screen.getByTestId('lang').textContent).toBe('en')
  })

  it('auto-detects Swedish from navigator.language', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'sv-SE',
      configurable: true,
    })
    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>
    )
    expect(screen.getByTestId('lang').textContent).toBe('sv')
  })

  it('switches language on setLanguage call', () => {
    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>
    )
    fireEvent.click(screen.getByText('sv'))
    expect(screen.getByTestId('lang').textContent).toBe('sv')
  })

  it('provides correct greeting translation for English', () => {
    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>
    )
    expect(screen.getByTestId('greeting').textContent).toBe('Hello, world.')
  })

  it('throws when used outside LanguageProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<LangDisplay />)).toThrow(
      'useLanguage must be used inside LanguageProvider'
    )
    spy.mockRestore()
  })
})
