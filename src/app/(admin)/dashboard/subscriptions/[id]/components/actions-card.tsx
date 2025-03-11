'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import API from '@/services/api'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPaypal } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAtomValue } from 'jotai'
import { subscriptionAtom } from './card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ActionsCard() {
  const router = useRouter()
  const subscription = useAtomValue(subscriptionAtom)
  if (!subscription) return null

  async function verify_subscription(subscription_id: string) {
    const response = await API.post('/paypal/verify-subscription', {
      subscription_id,
    })
    toast.success('You have verified this subscription!')
    router.refresh()
  }

  return (
    <div className="col-span-full lg:col-span-1 flex flex-col gap-4">
      <Button
        onClick={() =>
          verify_subscription(subscription?.paypal_subscription_id!)
        }
        className="w-full"
      >
        <FontAwesomeIcon className="mr-2" icon={faPaypal as IconProp} /> Verify
        subscription
      </Button>
    </div>
  )
}
