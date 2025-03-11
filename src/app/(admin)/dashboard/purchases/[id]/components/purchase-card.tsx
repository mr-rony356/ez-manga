'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { generateForm, VariableData } from '@/components/ui/form'

export const purchaseSchema = z.object({
  id: z.number(),
  custom_id: z.string(),
  user_id: z.number(),
  paypal_id: z.string(),
  paid: z.boolean(),
  amount: z.number(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  product_id: z.number(),
  payment_gateway: z.string(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    role: z.string(),
    coins: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    validated: z.boolean(),
    profile_picture: z.string(),
    is_ads_free: z.boolean(),
  }),
  product: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    paypal_product_id: z.string(),
    type: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    is_subscription_product: z.boolean(),
    price: z.number(),
    currency_code: z.string(),
    status: z.string(),
    coins_reward: z.number(),
    stripe_product_id: z.string(),
    stripe_price_id: z.string(),
  }),
})

export const formDetails: Record<
  keyof z.infer<typeof purchaseSchema>,
  VariableData
> = {
  id: {
    label: 'ID',
    description: 'The ID of the purchase',
    type: 'text',
    disabled: true,
  },
  custom_id: {
    label: 'Custom ID',
    description: 'The custom ID of the purchase',
    type: 'text',
    disabled: true,
  },
  user_id: {
    label: 'User ID',
    description: 'The ID of the user who made the purchase',
    type: 'text',
    disabled: true,
  },
  paypal_id: {
    label: 'Paypal ID',
    description: 'The Paypal ID of the purchase',
    type: 'text',
    disabled: true,
  },
  paid: {
    label: 'Paid',
    description: 'Whether the purchase has been paid',
    type: 'boolean',
  },
  amount: {
    label: 'Amount',
    description: 'The amount of the purchase',
    type: 'text',
    disabled: true,
  },
  description: {
    label: 'Description',
    description: 'The description of the purchase',
    type: 'text',
  },
  created_at: {
    label: 'Created at',
    description: 'The creation date of the purchase',
    type: 'text',
    disabled: true,
  },
  updated_at: {
    label: 'Updated at',
    description: 'The last update date of the purchase',
    type: 'text',
    disabled: true,
  },
  product_id: {
    label: 'Product ID',
    description: 'The ID of the product bought',
    type: 'text',
    disabled: true,
  },
  payment_gateway: {
    label: 'Payment gateway',
    description: 'The payment gateway used for the purchase',
    type: 'options',
    disabled: true,
    options: [
      {
        label: 'Paypal',
        value: 'paypal',
      },
      {
        label: 'Stripe',
        value: 'stripe',
      },
    ],
  },
  user: {
    label: 'User',
    description: 'The user who made the purchase',
    type: 'text',
  },
  product: {
    label: 'Product',
    description: 'The product bought',
    type: 'text',
  },
}

export default function PurchaseDetailsCard({
  purchase,
}: {
  purchase: z.infer<typeof purchaseSchema>
}) {
  const form = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues: purchase,
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <Card className="col-span-full lg:col-span-3">
        <CardHeader>
          <CardTitle>Purchase details</CardTitle>
          <CardDescription>
            Here you can see the details of the purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generateForm<typeof purchaseSchema>({
            form,
            defaultValues: purchase,
            formDetails,
            onSubmit: () => {
              console.log('oi')
            },
          })}
        </CardContent>
        <CardFooter>
          <span className="text-muted-foreground">{`This purchase belongs to ${purchase.user.email}`}</span>
        </CardFooter>
      </Card>
    </div>
  )
}
