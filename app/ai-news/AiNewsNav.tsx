'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AiNewsNav() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <nav className="px-6 h-16 flex items-center border-b border-white/5">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="font-mono text-[#4f9cf9] font-semibold tracking-wide text-sm">
          marco-tech.se
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/portfolio" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">
            Portfolio
          </Link>
          <button
            onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
            aria-label={language === 'en' ? 'Switch to Swedish' : 'Byt till engelska'}
            className="text-sm font-mono text-slate-500 hover:text-[#4f9cf9] transition-colors border-l border-white/10 pl-6"
          >
            {language === 'en' ? 'SV' : 'EN'}
          </button>
          <Link href="/" className="text-sm text-slate-500 hover:text-[#4f9cf9] transition-colors border-l border-white/10 pl-6">
            {t.aiNews.navHome}
          </Link>
        </div>
      </div>
    </nav>
  )
}
