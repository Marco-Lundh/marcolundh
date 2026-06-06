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
          ? 'bg-[#0a0f1e]/80 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono text-[#4f9cf9] font-semibold tracking-wide text-sm">
          marco-tech.se
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {t.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
            aria-label={language === 'en' ? 'Switch to Swedish' : 'Byt till engelska'}
            className="text-sm font-mono text-slate-500 hover:text-[#4f9cf9] transition-colors border-l border-white/10 pl-8"
          >
            {language === 'en' ? 'SV' : 'EN'}
          </button>
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-[#4f9cf9] transition-colors border-l border-white/10 pl-4"
          >
            ← Home
          </Link>
        </div>
        {/* Mobile */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
          aria-label={language === 'en' ? 'Switch to Swedish' : 'Byt till engelska'}
          className="md:hidden text-sm font-mono text-slate-500 hover:text-[#4f9cf9] transition-colors"
        >
          {language === 'en' ? 'SV' : 'EN'}
        </button>
      </div>
    </motion.nav>
  )
}
