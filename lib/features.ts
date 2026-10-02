/**
 * Whether the email newsletter accepts signups. Paused by default: set
 * NEXT_PUBLIC_NEWSLETTER_ENABLED=true (Vercel env) to turn it back on, along
 * with the NEWSLETTER_ENABLED repo variable that gates the daily send in
 * pipeline/curate.py. The daily news feed runs regardless.
 *
 * Read at call time (not module load) so tests can toggle it; Next.js still
 * inlines the literal `process.env.NEXT_PUBLIC_*` access into client bundles.
 */
export function isNewsletterEnabled(): boolean {
  return process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === 'true'
}
