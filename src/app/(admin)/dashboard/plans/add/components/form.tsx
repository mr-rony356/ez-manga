'use client'
import { useForm } from "react-hook-form";
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SeriesSelector from "@/components/Series/series-selector";
import type { Series, SubscriptionPlan } from "@/types"
import { Form, FormControl, FormDescription, FormMessage, FormItem, FormField, FormLabel } from '@/components/ui/form'
import API from "@/services/api";
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const planSchema = z.object({
  name: z.string(),
  description: z.string(),
  value: z.coerce.number(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'CREATED']),
  series: z.array(z.number())
})

export default function PlanForm() {


  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      status: 'CREATED',
      value: 12,
      description: '',
      series: []
    }
  })

  const router = useRouter()


  async function onSubmit(data: z.infer<typeof planSchema>) {

    toast.promise(API.post(`/store/plans`, data), {
      loading: 'Creating plan...',
      success: () => {
        setTimeout(() => {
          router.push('/admin/dashboard/plans')
        }, 1000)
        return 'Plan created! Redirecting...'
      },
      error: 'An error occurred while creating the plan!'
    })

  }


  const onValueChange = (value: Series[]) => {
    form.setValue('series', value.map(s => parseInt(s.id)))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-9">
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Plan Details</CardTitle>
              <CardDescription>
                In this section, you can edit both title and description of this plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input  {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the plan name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the plan description.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the plan value.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="CREATED">Created</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Status of the subscription plan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button type='button' variant='outline' className='w-full'
                onClick={form.handleSubmit(onSubmit)}>
                Create
              </Button>

            </CardContent>
          </Card>
        </div>
        <div className="col-span-12">
          <Card>
            <FormField
              control={form.control}
              name="series"
              render={({ field }) => (
                <FormItem >
                  <FormControl>
                    <SeriesSelector defaultSeries={[]} onValueChange={onValueChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        </div>
      </form>
    </Form>
  )
}