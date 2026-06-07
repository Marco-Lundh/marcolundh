'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import StatusCard from '@/components/StatusCard'

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
        <div className="bg-[#111827] border border-[#4f9cf9]/30 rounded-xl p-8">
          <h1 className="text-xl font-bold mb-2 text-slate-100">
            {copy.title}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {copy.body}
          </p>
          <button
            onClick={handleClick}
            disabled={state === 'loading'}
            className="px-6 py-3 bg-[#4f9cf9] text-[#0a0f1e] font-semibold text-sm rounded-lg hover:bg-[#3b82f6] transition-colors disabled:opacity-50"
          >
            {state === 'loading' ? copy.loading : copy.button}
          </button>
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
