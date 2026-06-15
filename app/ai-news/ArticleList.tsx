'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Article } from '@/lib/types'

const CATEGORIES = [
  'LLMs & Models',
  'AI Agents & Automation',
  'Open Source AI',
  'AI Tools & Frameworks',
  'MLOps & Infrastructure',
  'Research & Papers',
  'AI in Industry',
  'Ethics & Policy',
  'Generative Media',
  'Funding & Business',
]

export default function ArticleList({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles

  if (articles.length === 0) {
    return (
      <div className="max-w-3xl w-full text-center py-16">
        <p className="text-ink-muted font-mono text-sm">
          Today&apos;s stories are being curated — check back soon.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="max-w-3xl w-full"
    >
      <div className="border-t border-ink/10 pt-12 mb-8">
        <p className="font-mono text-accent-dark text-xs tracking-widest uppercase mb-5">
          today&apos;s {articles.length} stories
        </p>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === null
                ? 'bg-accent text-white'
                : 'bg-ink/5 text-ink-muted hover:bg-ink/10 hover:text-ink'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const count = articles.filter((a) => a.category === cat).length
            if (count === 0) return null
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-accent text-white'
                    : 'bg-ink/5 text-ink-muted hover:bg-ink/10 hover:text-ink'
                }`}
              >
                {cat}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Article cards */}
      <div className="space-y-px">
        {filtered.map((article, i) => (
          <motion.article
            key={article.url}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            className="group py-5 border-b border-ink/10 last:border-0"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-ink/25">·</span>
                  <span className="text-[10px] text-ink-muted">
                    {article.source}
                  </span>
                  <span className="text-ink/25">·</span>
                  <span className="text-[10px] text-ink-muted">
                    {article.reading_time_minutes} minute read
                  </span>
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-ink font-semibold text-[15px] leading-snug mb-1.5 group-hover:text-accent-dark transition-colors"
                >
                  {article.title}
                </a>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  )
}
