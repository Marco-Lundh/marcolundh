'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/80 backdrop-blur-md border-b border-ink/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono text-accent-dark font-semibold tracking-wide text-sm">
          marco-tech.se
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {t.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/portfolio"
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            {t.common.portfolio}
          </Link>
          <button
            onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
            aria-label={t.common.langToggle}
            className="text-sm font-mono text-ink-muted hover:text-accent-dark transition-colors border-l border-ink/15 pl-8"
          >
            {language === 'en' ? 'SV' : 'EN'}
          </button>
          <Link
            href="/"
            className="text-sm text-ink-muted hover:text-accent-dark transition-colors border-l border-ink/15 pl-4"
          >
            {t.common.home}
          </Link>
        </div>
        {/* Mobile */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
          aria-label={t.common.langToggle}
          className="md:hidden text-sm font-mono text-ink-muted hover:text-accent-dark transition-colors"
        >
          {language === 'en' ? 'SV' : 'EN'}
        </button>
      </div>
    </motion.nav>
  )
}
