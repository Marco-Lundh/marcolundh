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
      <p className={`font-mono text-[#4f9cf9] tracking-widest uppercase ${compact ? 'text-xs mb-3' : 'text-sm mb-4'}`}>
        {tr.label}
      </p>
      {!compact && (
        <>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 leading-tight">
            {tr.heading}<br />{tr.headingLine2}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            {tr.subheading}
          </p>
        </>
      )}

      {status === 'success' ? (
        <div className="bg-[#111827] border border-[#4f9cf9]/30 rounded-xl p-6">
          <p className="text-[#4f9cf9] font-semibold mb-1">{tr.successTitle}</p>
          <p className="text-slate-400 text-sm">{tr.successBody}</p>
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
            className="flex-1 bg-[#111827] border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#4f9cf9]/50 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-[#4f9cf9] text-[#0a0f1e] font-semibold text-sm rounded-lg hover:bg-[#3b82f6] transition-colors shrink-0 disabled:opacity-50"
          >
            {status === 'loading' ? tr.subscribingButton : tr.subscribeButton}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-400 text-sm mt-3">
          {tr.errorText}
        </p>
      )}

      <p className="text-slate-600 text-xs mt-4 font-mono">
        {tr.disclaimer}
      </p>
      {!compact && (
        <p className="text-slate-400 text-lg leading-relaxed mt-8">
          {tr.browseText}
        </p>
      )}
    </motion.div>
  )
}
