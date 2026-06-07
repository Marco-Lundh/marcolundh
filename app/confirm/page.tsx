import { getSupabase } from '@/lib/supabase'
import StatusCard, { type StatusKind } from '@/components/StatusCard'

async function confirmSubscriber(token: string | undefined): Promise<StatusKind> {
  if (!token) return 'invalid'

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('subscribers')
    .select('id, status')
    .eq('confirm_token', token)
    .maybeSingle()

  if (error || !data) return 'invalid'
  if (data.status === 'active') return 'already'

  const { error: updateError } = await supabase
    .from('subscribers')
    .update({ status: 'active', confirmed_at: new Date().toISOString() })
    .eq('id', data.id)

  if (updateError) return 'invalid'
  return 'confirmed'
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const result = await confirmSubscriber(token)
  return <StatusCard page="confirm" kind={result} />
}
