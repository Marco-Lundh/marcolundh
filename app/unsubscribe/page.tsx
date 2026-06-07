import StatusCard from '@/components/StatusCard'
import UnsubscribeButton from '@/components/UnsubscribeButton'

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  if (!token) {
    return <StatusCard page="unsubscribe" kind="invalid" />
  }
  // The actual opt-out happens on an explicit POST from UnsubscribeButton,
  // so link prefetchers cannot unsubscribe a user with a GET.
  return <UnsubscribeButton token={token} />
}
