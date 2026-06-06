'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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
      className="max-w-2xl w-full text-center"
    >
      <p className="font-mono text-[#4f9cf9] text-sm tracking-widest uppercase mb-4">
        daily ai news
      </p>
      <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 leading-tight">
        What matters in AI,<br />every morning.
      </h1>
      <p className="text-slate-400 text-lg leading-relaxed mb-10">
        10 hand-picked stories — ranked by Claude, delivered at 07:00 CET.
        Browse and filter all 50 by category below.
      </p>

      {status === 'success' ? (
        <div className="bg-[#111827] border border-[#4f9cf9]/30 rounded-xl p-6">
          <p className="text-[#4f9cf9] font-semibold mb-1">You&apos;re subscribed!</p>
          <p className="text-slate-400 text-sm">You&apos;ll receive your first newsletter tomorrow morning at 07:00 CET.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <label htmlFor="email-input" className="sr-only">
            Email address
          </label>
          <input
            id="email-input"
            type="email"
            required
            placeholder="your@email.com"
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
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-400 text-sm mt-3">
          Something went wrong — please try again.
        </p>
      )}

      <p className="text-slate-600 text-xs mt-4 font-mono">
        Free · Unsubscribe anytime · No spam
      </p>
    </motion.div>
  )
}
