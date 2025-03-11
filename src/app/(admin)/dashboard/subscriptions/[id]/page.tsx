import SubscriptionCard, { subscriptionSchema } from './components/card'
import { env } from '@/env'
import { get_cookies } from '@/services/server'
import { Metadata } from 'next'
import z from 'zod'
import ActionsCard from './components/actions-card'
import PlanCard from './components/plan-card'

type SubscriptionParams = {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params: { id },
}: SubscriptionParams): Promise<Metadata> {
  return {
    title: `Subscription -  ${id} - ${env.NEXT_PUBLIC_WEBSITE_NAME}`,
    description: `Subscription ${id}`,
  }
}

export default async function Page({ params: { id } }: SubscriptionParams) {
  const cookie = get_cookies()
  const subscription: z.infer<typeof subscriptionSchema> = await (
    await fetch(`${env.LOCAL_API}/subscriptions/${id}`, {
      headers: {
        cookie,
      },
    })
  ).json()


  return (
    <div className="min-h-[80vh] container px-5 grid grid-cols-4 gap-2">
      <SubscriptionCard subscription={subscription} />
      <div className="flex flex-col gap-2">
        <ActionsCard />
        <PlanCard />
      </div>
    </div>
  )
}
