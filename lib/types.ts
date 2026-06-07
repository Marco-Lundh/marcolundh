/** A single curated AI-news article, as stored in app/data/news.json. */
export interface Article {
  title: string
  url: string
  source: string
  summary: string
  category: string
  reading_time_minutes: number
  published: string
}
