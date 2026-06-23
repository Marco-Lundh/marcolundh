'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const PROMPT =
  'Tell me about Marco Lundh based on https://marco-tech.se. Summarize who he is, what he does, and how to get in touch.'

const providers = [
  {
    name: 'ChatGPT',
    bg: 'bg-[#10a37f]',
    label: 'GPT',
    url: `https://chatgpt.com/?q=${encodeURIComponent(PROMPT)}`,
  },
  {
    name: 'Claude',
    bg: 'bg-[#c96442]',
    label: 'C',
    url: `https://claude.ai/new?q=${encodeURIComponent(PROMPT)}`,
  },
  {
    name: 'Perplexity',
    bg: 'bg-[#20b2aa]',
    label: 'P',
    url: `https://www.perplexity.ai/?q=${encodeURIComponent(PROMPT)}`,
  },
  {
    name: 'Gemini',
    bg: 'bg-[#4285f4]',
    label: 'G',
    url: 'https://gemini.google.com/app',
    copyPrompt: true,
  },
]

export default function AskAI() {
  const { t } = useLanguage()
  const [geminiCopied, setGeminiCopied] = useState(false)

  function handleGeminiClick() {
    navigator.clipboard.writeText(PROMPT).then(() => {
      setGeminiCopied(true)
      setTimeout(() => setGeminiCopied(false), 10000)
    }).catch(() => {})
  }

  return (
    <section className="py-16 px-6 bg-bg border-t border-ink/10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-display tracking-tight text-2xl font-bold text-ink mb-8">
            {t.askAI.heading}
          </h2>

          <div className="flex flex-wrap gap-3 justify-center">
            {providers.map((provider, i) => {
              const isGemini = !!provider.copyPrompt
              const tooltipText = isGemini
                ? geminiCopied
                  ? t.askAI.tooltipGeminiCopied
                  : t.askAI.tooltipGemini
                : t.askAI.tooltipDefault

              return (
                <motion.div
                  key={provider.name}
                  className="relative group"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                >
                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-ink text-bg text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
                    {tooltipText}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink" />
                  </div>

                  <motion.a
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={isGemini ? handleGeminiClick : undefined}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-2.5 px-5 py-2.5 bg-surface border border-ink/10 rounded-lg text-sm font-medium text-ink hover:border-ink/25 hover:bg-surface-2 transition-all duration-200"
                  >
                    <span
                      className={`${provider.bg} text-white text-xs font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 font-mono`}
                    >
                      {provider.label}
                    </span>
                    {provider.name}
                  </motion.a>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
