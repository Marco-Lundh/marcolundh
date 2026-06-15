'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#14201a0a_1px,transparent_1px),linear-gradient(to_bottom,#14201a0a_1px,transparent_1px)] bg-[size:64px_64px]" />
      {/* Glow blob */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-dark/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-accent-dark text-sm mb-4"
        >
          {t.hero.greeting}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-display tracking-tight text-5xl md:text-7xl font-bold text-ink mb-3 leading-tight"
        >
          Marco Lundh
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="font-display tracking-tight text-2xl md:text-4xl font-semibold text-ink-muted mb-6"
        >
          Full-Stack Python Developer · AI & Automation
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-ink-muted text-lg max-w-xl mb-10 leading-relaxed"
        >
          {t.hero.description}{' '}
          <span className="text-accent-dark">{t.hero.yearsExp}</span>{' '}
          {t.hero.descriptionEnd}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="https://www.linkedin.com/in/marcolundh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-accent text-accent-dark font-semibold rounded hover:bg-accent/10 transition-colors"
          >
            {t.hero.linkedin}
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
          className="absolute bottom-10 left-0"
        >
          <div className="flex flex-col items-center gap-1 text-ink-muted">
            <span className="text-xs font-mono">scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-ink-muted to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
