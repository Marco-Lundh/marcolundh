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
      'Senior full-stack Python developer with 13+ years across FinTech, MedTech, and Telecom — now focused on AI engineering and automation.',
    cta: 'Read my story →',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      {/* Subtle background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4f9cf9]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1d4ed8]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-[#4f9cf9] text-sm tracking-widest uppercase mb-4">
            marco-tech.se
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4 leading-tight">
            AI Engineering & Automation
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
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
                className="group block h-full bg-[#111827] border border-white/5 rounded-2xl p-8 hover:border-[#4f9cf9]/30 transition-all duration-300 hover:bg-[#111827]/80"
              >
                <p className="font-mono text-[#4f9cf9] text-xs tracking-widest uppercase mb-4">
                  {section.mono}
                </p>
                <h2 className="text-xl font-bold text-slate-100 mb-3">{section.label}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {section.description}
                </p>
                <span className="text-sm text-[#4f9cf9] group-hover:translate-x-1 inline-block transition-transform duration-200">
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
