import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import type { Article } from '@/lib/types'
import SiteNav from '@/components/SiteNav'
import SubscribeForm from './SubscribeForm'
import ArticleList from './ArticleList'
import AskAI from '@/components/AskAI'

function loadArticles(): Article[] {
  const filePath = join(process.cwd(), 'app/data/news.json')
  if (!existsSync(filePath)) return []
  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))
    return data.articles ?? []
  } catch (err) {
    console.error('Failed to parse news.json', err)
    return []
  }
}

export default function AiNews() {
  const articles = loadArticles()

  return (
    <main className="min-h-screen bg-bg text-ink flex flex-col">
      <SiteNav />

      <div className="flex-1 flex flex-col items-center px-6 py-20 gap-16">
        <SubscribeForm />
        <ArticleList articles={articles} />
      </div>
      <AskAI />
    </main>
  )
}
