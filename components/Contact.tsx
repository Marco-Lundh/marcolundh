'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="py-24 px-6 bg-[#111827]/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-slate-100 mb-6">
            {t.contact.heading}
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            {t.contact.body}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://www.linkedin.com/in/marcolundh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#4f9cf9] text-[#0a0f1e] font-semibold rounded hover:bg-[#3b82f6] transition-colors"
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
          className="mt-20 pt-8 border-t border-white/5 text-center"
        >
          <p className="text-sm text-slate-500 font-mono">
            <a
              href="https://www.linkedin.com/in/marcolundh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4f9cf9] transition-colors"
            >
              linkedin.com/in/marcolundh
            </a>
          </p>
        </motion.footer>
      </div>
    </section>
  )
}
