'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { captureOrder, createOrder } from '@/services/paypal'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import API from '@/services/api'

const StoreCards = () => {
  const router = useRouter()

  async function create_subscription() {
    const response = await API.post<{ id: string }>(
      '/paypal/create-subscription',
      {
        plan_id: 'P-3UX34417C2134335MMX5UFFY',
      }
    )
    return response.data.id
  }

  async function verify_subscription(subscription_id: string) {
    const response = await API.post('/paypal/verify-subscription', {
      subscription_id,
    })
    return response.data
  }

  return (
    <>
      <div className="flex flex-row gap-3 justify-start lg:justify-center items-center min-h-[70vh] overflow-auto">
        <Card className="flex-1 bg-background text-muted-foreground justify-center items-center flex flex-col border-0">
          <CardHeader className="text-center">
            <CardTitle>Ad-free reading</CardTitle>
            <CardDescription>
              Support us through this monthly subscription and get rid of ads.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 justify-center items-center text-muted-foreground">
            <span>{'$5 (+1)'}</span>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              disabled={false}
              fundingSource={undefined}
              createSubscription={async (data, actions) => {
                return await create_subscription()
              }}
              onApprove={async (data, actions) => {
                await verify_subscription(data.subscriptionID || '')
                toast.success(
                  'You have successfully subscribed to our ad-free plan!'
                )
                router.push('/')
              }}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default StoreCards
