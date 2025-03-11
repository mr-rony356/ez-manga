'use client'
import { PlanSelector } from "@/components/plan-selector"
import type { User } from "@/types"
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/Icons"
import { Form, FormItem, FormControl, FormDescription, FormMessage, FormLabel, FormField } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"


type Props = {
  user: User
}

const schema = z.object({
  plan_id: z.union([z.number(), z.string()]).nullable(),
  user_id: z.number(),
  status: z.string(),
  paypal_subscription_id: z.string().nullable(),
  start_date: z.date().nullable(),
  next_charge: z.date().nullable(),
  last_payment_date: z.date().nullable(),
})

type formValues = z.infer<typeof schema>



{/* 
Form Anatomy
  
            <FormField
              control={form.control}
              name=''
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
  
*/}


export function CreateSubscriptionForm({ user }: Props) {

  const form = useForm<formValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      user_id: user.id as unknown as number,
      plan_id: null,
      status: 'APPROVAL_PENDING',
      paypal_subscription_id: '',
      start_date: null,
      next_charge: null,
      last_payment_date: null,
    }
  })

  async function onSubmit(data: formValues) {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 20000)), {
      loading: 'Creating...'
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-4'>
          <div className="flex flex-col lg:flex-row justify-start  gap-4 items-start lg:items-center">
            <FormField
              control={form.control}
              name='plan_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Plan</FormLabel>
                  <PlanSelector onValueChange={field.onChange} />
                  <FormDescription>Select a subscription plan for the user.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Label>User</Label>
            <Input className='w-fit' disabled value={user.username} />
          </div>
          <div className="flex flex-col xl:flex-row gap-2 items-start">
            <FormField
              control={form.control}
              name='paypal_subscription_id'
              render={({ field: { value, ...rest } }) => (
                <FormItem className='lg:max-w-[500px]'>
                  <FormLabel><Icons.paypal className='h-4 inline-block mr-2' />Paypal Subscription ID</FormLabel>
                  <FormControl className='flex flex-row gap-2'>
                    <Input value={value ? value : ''} {...rest} />
                  </FormControl>
                  <FormDescription>
                    Usually starts with I- and followed by a string of characters. Example: I-1A2B3C4D5E6F7G8H9I0J
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='start_date'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-2'>
                  <FormLabel>Start date</FormLabel>
                  <FormControl className='flex flex-row gap-2in'>
                    <DatePicker />
                  </FormControl>
                  <FormDescription>
                    When the subscription starts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='next_charge'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-2'>
                  <FormLabel>Next charge date</FormLabel>
                  <FormControl className='flex flex-row gap-2in'>
                    <DatePicker onDateChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    When the next charge will be made.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-2 items-start">
            <FormField
              control={form.control}
              name='last_payment_date'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-2'>
                  <FormLabel>Last payment date</FormLabel>
                  <FormControl className='flex flex-row gap-2in'>
                    <DatePicker onDateChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    When the last payment was made.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-2'>
                  <FormLabel>Subscription status</FormLabel>
                  <FormControl className='flex flex-row gap-2in'>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-fit">
                        <SelectValue placeholder="Subscription Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APPROVAL_PENDING">Pending</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Status of this subscription.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' className='w-full'>Create Subscription</Button>
        </div>
      </form>
    </Form>
  )

}