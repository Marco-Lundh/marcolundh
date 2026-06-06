'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Article {
  title: string
  url: string
  source: string
  summary: string
  category: string
  reading_time_minutes: number
  published: string
}

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
        <p className="text-slate-500 font-mono text-sm">
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
      <div className="border-t border-white/5 pt-12 mb-8">
        <p className="font-mono text-[#4f9cf9] text-xs tracking-widest uppercase mb-5">
          today&apos;s {articles.length} stories
        </p>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === null
                ? 'bg-[#4f9cf9] text-[#0a0f1e]'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
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
                    ? 'bg-[#4f9cf9] text-[#0a0f1e]'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
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
            className="group py-5 border-b border-white/5 last:border-0"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-slate-800">·</span>
                  <span className="text-[10px] text-slate-600">
                    {article.source}
                  </span>
                  <span className="text-slate-800">·</span>
                  <span className="text-[10px] text-slate-600">
                    {article.reading_time_minutes} min
                  </span>
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-200 font-semibold text-[15px] leading-snug mb-1.5 group-hover:text-[#4f9cf9] transition-colors"
                >
                  {article.title}
                </a>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-600 text-sm py-8 text-center font-mono">
          No stories in this category today.
        </p>
      )}
    </motion.div>
  )
}
