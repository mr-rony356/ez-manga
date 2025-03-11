'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { generateForm, FormDetailsType } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHydrateAtoms } from 'jotai/react/utils'
import { atom } from 'jotai'
import API from "@/services/api";
import { toast } from 'sonner'

export const subscriptionSchema = z.object({
  id: z.number(),
  paypal_subscription_id: z.string(),
  custom_id: z.string(),
  status: z.enum([
    'ACTIVE',
    'CANCELLED',
    'SUSPENDED',
    'EXPIRED',
    'APPROVAL_PENDING',
  ]),
  start_time: z.string(),
  next_charge: z.string(),
  user_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  value: z.number(),
  subscription_source: z.string(),
  plan_id: z.number(),
  stripe_subscription_id: z.string(),
  last_payment_date: z.string(),
  plan: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    product_id: z.number(),
    tenure_type: z.string(),
    sequence: z.number(),
    total_cycles: z.number(),
    currency_code: z.string(),
    value: z.number(),
    interval_unit: z.string(),
    setup_fee_currency_code: z.string(),
    setup_fee_value: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    paypal_subscription_plan_id: z.string(),
    stripe_subscription_plan_id: z.string(),
    status: z.string(),
  }),
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
})


const formSchema = z.object({
  id: z.number(),
  paypal_subscription_id: z.string().nullable().transform(data => data ?? ''),
  custom_id: z.string(),
  status: z.enum([
    'ACTIVE',
    'CANCELLED',
    'SUSPENDED',
    'EXPIRED',
    'APPROVAL_PENDING',
  ]),
  start_time: z.coerce.date(),
  next_charge: z.coerce.date(),
  user_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  value: z.number(),
  subscription_source: z.string(),
  plan_id: z.custom<number | string>().nullable().transform(data => data ?? ''),
  stripe_subscription_id: z.string().nullable().transform(data => data ?? ''),
  last_payment_date: z.coerce.date().nullable().transform(data => data ?? ''),
})


type CardProps = {
  subscription: z.infer<typeof subscriptionSchema>
}

const formDetails: FormDetailsType<typeof subscriptionSchema> = {
  last_payment_date: {
    type: 'date',
    label: 'Last payment date',
    disabled: false,
    description: 'The date of the last payment',
  },
  created_at: {
    type: 'date',
    label: 'Created at',
    disabled: true,
    description: 'The date the subscription was created',
  },
  updated_at: {
    type: 'date',
    label: 'Updated at',
    disabled: true,
    description: 'The date the subscription was last updated',
  },
  value: {
    type: 'text',
    label: 'Value',
    disabled: true,
    description: 'The value of the subscription',
  },
  status: {
    type: 'options',
    label: 'Status',
    description: 'The status of the subscription',
    options: [
      { label: 'Active', value: 'ACTIVE' },
      { label: 'Cancelled', value: 'CANCELLED' },
      { label: 'Suspended', value: 'SUSPENDED' },
      { label: 'Expired', value: 'EXPIRED' },
      { label: 'Approval pending', value: 'APPROVAL_PENDING' },
    ],
  },
  start_time: {
    type: 'date',
    label: 'Start time',
    disabled: true,
    description: 'The start time of the subscription',
  },
  next_charge: {
    type: 'date',
    label: 'Next charge',
    disabled: false,
    description: 'The date of the next charge',
  },
  user_id: {
    type: 'text',
    label: 'User ID',
    disabled: true,
    description: 'The ID of the user',
  },
  plan_id: {
    type: 'text',
    label: 'Plan ID',
    disabled: true,
    description: 'The ID of the plan',
  },
  subscription_source: {
    type: 'options',
    label: 'Subscription source',
    disabled: true,
    description: 'The source of the subscription',
    options: [
      { label: 'Paypal', value: 'paypal' },
      { label: 'Stripe', value: 'stripe' },
    ],
  },
  paypal_subscription_id: {
    type: 'text',
    label: 'Paypal subscription ID',
    disabled: false,
    description: 'The ID of the Paypal subscription',
  },
  stripe_subscription_id: {
    type: 'text',
    label: 'Stripe subscription ID',
    disabled: false,
    description: 'The ID of the Stripe subscription',
  },
  custom_id: {
    type: 'text',
    label: 'Custom ID',
    disabled: true,
    description: 'The custom ID of the subscription',
  },
  id: {
    type: 'text',
    label: 'ID',
    disabled: true,
    description: 'The ID of the subscription',
  },
  plan: {
    type: 'text',
    label: 'ID',
    disabled: true,
    description: 'The ID of the subscription',
  },
  user: {
    type: 'text',
    label: 'ID',
    disabled: true,
    description: 'The ID of the subscription',
  },
}

export const subscriptionAtom = atom<z.infer<typeof subscriptionSchema> | null>(
  null
)

export default function SubscriptionCard({ subscription }: CardProps) {
  useHydrateAtoms([[subscriptionAtom, subscription]] as const, {
    dangerouslyForceHydrate: true,
  })
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: formSchema.parse(subscription),
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    toast.promise(API.put(`/v2/subscriptions/${subscription.id}`, data), {
      success: 'Subscription updated!',
      error: 'Failed!'
    })
  }

  return (
    <Card className="col-span-full lg:col-span-3">
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          View and edit the subscription details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generateForm({
          defaultValues: formSchema.parse(subscription),
          formDetails,
          form,
          onSubmit,
        })}
      </CardContent>
    </Card>
  )
}
