'use client'

import { useAtomValue } from 'jotai'
import { subscriptionAtom } from './card'
import { Card, CardHeader } from '@/components/ui/card'

export default function PlanCard() {
  const subscription = useAtomValue(subscriptionAtom)
  const plan = subscription?.plan

  if (subscription && plan) {
    return (
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Plan</span>
            <span className="font-bold">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Plan status</span>
            <span className="font-bold">{plan.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Value</span>
            <span className="font-bold">{plan.value}</span>
          </div>
        </CardHeader>
      </Card>
    )
  } else {
    return 'Loading...'
  }
}
