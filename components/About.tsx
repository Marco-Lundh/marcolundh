'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display tracking-tight text-3xl font-bold text-ink mb-10">{t.about.heading}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 text-ink-muted leading-relaxed"
          >
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p className="text-ink italic border-l-2 border-accent pl-4">
              &ldquo;{t.about.quote}&rdquo;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {t.about.stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface border border-ink/10 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-accent/40 transition-colors"
              >
                <span className="text-4xl font-bold text-accent mb-1 font-mono">
                  {stat.value}
                </span>
                <span className="text-sm text-ink-muted">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
