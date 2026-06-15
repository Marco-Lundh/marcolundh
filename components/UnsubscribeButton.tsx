'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import StatusCard from '@/components/StatusCard'
import SiteNav from '@/components/SiteNav'

export default function UnsubscribeButton({ token }: { token: string }) {
  const [state, setState] = useState<'prompt' | 'loading' | 'done'>('prompt')
  const { t } = useLanguage()
  const copy = t.unsubscribe.prompt

  if (state === 'done') {
    return <StatusCard page="unsubscribe" kind="unsubscribed" />
  }

  async function handleClick() {
    setState('loading')
    try {
      await fetch(`/api/unsubscribe?token=${encodeURIComponent(token)}`, {
        method: 'POST',
      })
    } catch {
      // Best-effort: show the confirmation regardless of network result.
    }
    setState('done')
  }

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
          ai news · marco-tech.se
        </p>
        <div className="bg-surface border border-accent/30 rounded-xl p-8">
          <h1 className="font-display tracking-tight text-xl font-bold mb-2 text-ink">
            {copy.title}
          </h1>
          <p className="text-ink-muted text-sm leading-relaxed mb-6">
            {copy.body}
          </p>
          <button
            onClick={handleClick}
            disabled={state === 'loading'}
            className="px-6 py-3 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {state === 'loading' ? copy.loading : copy.button}
          </button>
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
