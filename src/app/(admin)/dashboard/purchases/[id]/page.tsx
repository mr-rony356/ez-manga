import { env } from '@/env'
import { get_cookies } from '@/services/server'
import { Metadata } from 'next'
import PurchaseDetailsCard, { purchaseSchema } from './components/purchase-card'
import z from 'zod'

type PurchaseDetailsParams = {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params: { id },
}: PurchaseDetailsParams): Promise<Metadata> {
  return {
    title: `Purchase details - ${id} - ${env.NEXT_PUBLIC_WEBSITE_NAME}`,
  }
}

export default async function PurchaseDetails({
  params: { id },
}: PurchaseDetailsParams) {
  const cookie = get_cookies()
  const purchase: z.infer<typeof purchaseSchema> = await (
    await fetch(`${env.LOCAL_API}/v2/purchases/${id}`, {
      headers: {
        cookie,
      },
    })
  ).json()
  return (
    <div className="min-h-[80vh] container px-5">
      <PurchaseDetailsCard purchase={purchase} />
    </div>
  )
}
