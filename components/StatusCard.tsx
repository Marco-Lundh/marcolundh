'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import SiteNav from '@/components/SiteNav'

export type StatusKind = 'confirmed' | 'already' | 'invalid' | 'unsubscribed'

export const AI_NEWS_LABEL = 'ai news · marco-tech.se'

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
  const message: Message =
    page === 'confirm'
      ? t.confirm[kind as keyof typeof t.confirm] ?? t.confirm.invalid
      : kind === 'unsubscribed'
        ? t.unsubscribe.unsubscribed
        : t.unsubscribe[kind as 'already' | 'invalid'] ?? t.unsubscribe.invalid
  const isError = kind === 'invalid'

  return (
    <main className="min-h-screen bg-bg text-ink flex flex-col">
      <SiteNav />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center"
      >
        <p className="font-mono text-accent-dark text-xs tracking-widest uppercase mb-6">
          {AI_NEWS_LABEL}
        </p>
        <div
          className={`bg-surface border rounded-xl p-8 ${
            isError ? 'border-red-500/40' : 'border-accent/30'
          }`}
        >
          <h1
            className={`font-display tracking-tight text-xl font-bold mb-2 ${
              isError ? 'text-red-600' : 'text-accent-dark'
            }`}
          >
            {message.title}
          </h1>
          <p className="text-ink-muted text-sm leading-relaxed">
            {message.body}
          </p>
        </div>
        <Link
          href="/ai-news"
          className="inline-block mt-8 text-sm text-ink-muted hover:text-accent-dark transition-colors font-mono"
        >
          ← marco-tech.se/ai-news
        </Link>
      </motion.div>
      </div>
    </main>
  )
}
