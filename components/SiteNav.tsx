'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SiteNav() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <nav aria-label="Site navigation" className="h-16 flex items-center border-b border-ink/10 bg-bg px-6">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="font-mono text-accent-dark font-semibold tracking-wide text-sm">
          marco-tech.se
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/portfolio"
            className="hidden md:block text-sm text-ink-muted hover:text-ink transition-colors"
          >
            {t.common.portfolio}
          </Link>
          <Link
            href="/about"
            className="hidden md:block text-sm text-ink-muted hover:text-ink transition-colors"
          >
            {t.projectsNav.about}
          </Link>
          <Link
            href="/ai-news"
            className="hidden md:block text-sm text-ink-muted hover:text-ink transition-colors"
          >
            {t.projectsNav.aiNews}
          </Link>
          <button
            onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
            aria-label={t.common.langToggle}
            className="text-sm font-mono text-ink-muted hover:text-accent-dark transition-colors border-l border-ink/15 pl-6"
          >
            {language === 'en' ? 'SV' : 'EN'}
          </button>
        </div>
      </div>
    </nav>
  )
}
