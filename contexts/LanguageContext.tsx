'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Language } from '@/lib/translations'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations['en']
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language | null
    if (saved === 'en' || saved === 'sv') {
      setLanguage(saved)
    } else if (navigator.language.startsWith('sv')) {
      setLanguage('sv')
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  function handleSetLanguage(lang: Language) {
    setLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
