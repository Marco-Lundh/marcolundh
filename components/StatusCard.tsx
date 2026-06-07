'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export type StatusKind = 'confirmed' | 'already' | 'invalid' | 'unsubscribed'

interface Message {
  title: string
  body: string
}

export default function StatusCard({
  page,
  kind,
}: {
  page: 'confirm' | 'unsubscribe'
  kind: StatusKind
}) {
  const { t } = useLanguage()
  const copy = (page === 'confirm' ? t.confirm : t.unsubscribe) as Record<
    StatusKind,
    Message
  >
  const message = copy[kind]
  const isError = kind === 'invalid'

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center"
      >
        <p className="font-mono text-[#4f9cf9] text-xs tracking-widest uppercase mb-6">
          ai news · marco-tech.se
        </p>
        <div
          className={`bg-[#111827] border rounded-xl p-8 ${
            isError ? 'border-red-500/30' : 'border-[#4f9cf9]/30'
          }`}
        >
          <h1
            className={`text-xl font-bold mb-2 ${
              isError ? 'text-red-400' : 'text-[#4f9cf9]'
            }`}
          >
            {message.title}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {message.body}
          </p>
        </div>
        <Link
          href="/ai-news"
          className="inline-block mt-8 text-sm text-slate-500 hover:text-[#4f9cf9] transition-colors font-mono"
        >
          ← marco-tech.se/ai-news
        </Link>
      </motion.div>
    </main>
  )
}
