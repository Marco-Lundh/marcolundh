// Feature flags. Each is read at call time (not module load) so tests can
// toggle it; Next.js still inlines the literal `process.env.NEXT_PUBLIC_*`
// access into client bundles.

/**
 * Whether the AI News feed is live. Paused by default: set
 * NEXT_PUBLIC_AI_NEWS_ENABLED=true (Vercel env) to resume the daily pipeline
 * trigger and serve /ai-news again.
 */
export function isAiNewsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AI_NEWS_ENABLED === 'true'
}

/**
 * Whether the email newsletter accepts signups. Paused by default: set
 * NEXT_PUBLIC_NEWSLETTER_ENABLED=true (Vercel env) to turn it back on, along
 * with the NEWSLETTER_ENABLED repo variable that gates the daily send in
 * pipeline/curate.py. Requires AI News to be enabled, since the newsletter
 * is built from the daily feed.
 */
export function isNewsletterEnabled(): boolean {
  return isAiNewsEnabled() && process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === 'true'
}
