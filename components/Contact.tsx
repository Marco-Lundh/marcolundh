'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="py-24 px-6 bg-surface-2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-display tracking-tight text-4xl font-bold text-ink mb-6">
            {t.contact.heading}
          </h2>
          <p className="text-ink-muted text-lg leading-relaxed mb-10">
            {t.contact.body}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://www.linkedin.com/in/marcolundh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-accent text-white font-semibold rounded hover:bg-accent-dark transition-colors"
            >
              {t.contact.linkedin}
            </a>
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 pt-8 border-t border-ink/10 text-center"
        >
          <p className="text-sm text-ink-muted font-mono">
            <a
              href="https://www.linkedin.com/in/marcolundh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-dark transition-colors"
            >
              linkedin.com/in/marcolundh
            </a>
          </p>
        </motion.footer>
      </div>
    </section>
  )
}
