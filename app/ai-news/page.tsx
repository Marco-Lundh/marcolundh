import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import SubscribeForm from './SubscribeForm'
import ArticleList from './ArticleList'

interface Article {
  title: string
  url: string
  source: string
  summary: string
  category: string
  reading_time_minutes: number
  published: string
}

function loadArticles(): Article[] {
  const filePath = join(process.cwd(), 'app/data/news.json')
  if (!existsSync(filePath)) return []
  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))
    return data.articles ?? []
  } catch {
    return []
  }
}

export default function AiNews() {
  const articles = loadArticles()

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      <nav className="px-6 h-16 flex items-center border-b border-white/5">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="font-mono text-[#4f9cf9] font-semibold tracking-wide text-sm">
            marco-tech.se
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/portfolio" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">
              Portfolio
            </Link>
            <Link href="/" className="text-sm text-slate-500 hover:text-[#4f9cf9] transition-colors border-l border-white/10 pl-6">
              ← Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center px-6 py-20 gap-16">
        <SubscribeForm />
        <ArticleList articles={articles} />
      </div>
    </main>
  )
}
