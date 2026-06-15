'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const sections = [
  {
    href: '/portfolio',
    label: 'Portfolio',
    mono: 'selected.work',
    description:
      'Projects I have designed, built, and shipped — including a live, fully automated daily AI news pipeline you can try right here.',
    cta: 'View projects →',
  },
  {
    href: '/about',
    label: 'About me',
    mono: 'marco.lundh',
    description:
      'Senior fullstack and backend developer with 13+ years across FinTech, MedTech, and Telecom — with hands-on AI integration experience across the full development cycle.',
    cta: 'Read my story →',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-ink flex flex-col">
      {/* Subtle background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-dark/8 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-accent-dark text-sm tracking-widest uppercase mb-4">
            marco-tech.se
          </p>
          <h1 className="font-display tracking-tight text-4xl md:text-5xl font-bold text-ink mb-4 leading-tight">
            AI Engineering & Automation
          </h1>
          <p className="text-ink-muted text-lg max-w-md mx-auto">
            Python-first development, agentic workflows, and daily AI news — built by Marco Lundh.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {sections.map((section, i) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
            >
              <Link
                href={section.href}
                className="group block h-full bg-surface border border-ink/10 rounded-2xl p-8 hover:border-accent/40 transition-all duration-300 hover:bg-surface-2"
              >
                <p className="font-mono text-accent-dark text-xs tracking-widest uppercase mb-4">
                  {section.mono}
                </p>
                <h2 className="font-display tracking-tight text-xl font-bold text-ink mb-3">{section.label}</h2>
                <p className="text-ink-muted text-sm leading-relaxed mb-6">
                  {section.description}
                </p>
                <span className="text-sm text-accent-dark group-hover:translate-x-1 inline-block transition-transform duration-200">
                  {section.cta}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
