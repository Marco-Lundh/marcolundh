'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { language, t } = useLanguage()
  const tr = t.aiNews

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language }),
      })
      if (!res.ok) throw new Error('Subscribe request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={compact ? 'w-full text-left' : 'max-w-2xl w-full text-center'}
    >
      <p className={`font-mono text-accent-dark tracking-widest uppercase ${compact ? 'text-xs mb-3' : 'text-sm mb-4'}`}>
        {tr.label}
      </p>
      {!compact && (
        <>
          <h1 className="font-display tracking-tight text-4xl md:text-5xl font-bold text-ink mb-6 leading-tight">
            {tr.heading}<br />{tr.headingLine2}
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed mb-10">
            {tr.subheading}
          </p>
        </>
      )}

      {status === 'success' ? (
        <div className="bg-surface border border-accent/30 rounded-xl p-6">
          <p className="text-accent-dark font-semibold mb-1">{tr.successTitle}</p>
          <p className="text-ink-muted text-sm">{tr.successBody}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 max-w-md ${compact ? '' : 'mx-auto'}`}>
          <label htmlFor="email-input" className="sr-only">
            {t.common.emailLabel}
          </label>
          <input
            id="email-input"
            type="email"
            required
            placeholder={tr.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="flex-1 bg-surface border border-ink/15 rounded-lg px-4 py-3 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-accent/50 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent-dark transition-colors shrink-0 disabled:opacity-50"
          >
            {status === 'loading' ? tr.subscribingButton : tr.subscribeButton}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-600 text-sm mt-3">
          {tr.errorText}
        </p>
      )}

      <p className="text-ink-muted text-xs mt-4 font-mono">
        {tr.disclaimer}
      </p>
      {!compact && (
        <p className="text-ink-muted text-lg leading-relaxed mt-8">
          {tr.browseText}
        </p>
      )}
    </motion.div>
  )
}
