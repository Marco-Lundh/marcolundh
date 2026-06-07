import { getSupabase } from '@/lib/supabase'
import StatusCard, { type StatusKind } from '@/components/StatusCard'

async function unsubscribe(token: string | undefined): Promise<StatusKind> {
  if (!token) return 'invalid'

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('subscribers')
    .select('id, status')
    .eq('unsubscribe_token', token)
    .maybeSingle()

  if (error || !data) return 'invalid'
  if (data.status === 'unsubscribed') return 'already'

  const { error: updateError } = await supabase
    .from('subscribers')
    .update({ status: 'unsubscribed' })
    .eq('id', data.id)

  if (updateError) return 'invalid'
  return 'unsubscribed'
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const result = await unsubscribe(token)
  return <StatusCard page="unsubscribe" kind={result} />
}
