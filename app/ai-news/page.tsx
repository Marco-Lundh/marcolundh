import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import type { Article } from '@/lib/types'
import AiNewsNav from './AiNewsNav'
import SubscribeForm from './SubscribeForm'
import ArticleList from './ArticleList'

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
      <AiNewsNav />

      <div className="flex-1 flex flex-col items-center px-6 py-20 gap-16">
        <SubscribeForm />
        <ArticleList articles={articles} />
      </div>
    </main>
  )
}
