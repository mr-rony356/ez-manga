'use client'

import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import API from '@/services/api'
import { toast } from 'sonner'
import { Website_URL } from '@global'
import { ThemeCustomizer } from '@/components/theme-customizer'
import { ThemeWrapper } from '@/components/theme-wrapper'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { useConfig } from '@/hooks/use-config'

const schema = z.object({
  logo: z.instanceof(File).optional(),
  favicon: z.instanceof(File).optional(),
  theme: z.string().optional(),
})

export default function AssetsForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    const formData = new FormData()
    data.favicon && formData.append('favicon', data.favicon)
    data.logo && formData.append('logo', data.logo)
    try {
      await API.post(`${Website_URL}/api/assets`, formData)
      toast.success(
        'Environment variables updated successfully! Website will rebuild...'
      )
    } catch (error) {
      toast.error(
        'An error occurred while trying to update the environment variables.'
      )
    }
  }

  return (
    <div className={'bg-background p-4 rounded'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-4'}>
          <FormField
            control={form.control}
            name={'favicon'}
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Favicon</FormLabel>
                <FormControl>
                  <Input
                    onChange={(event) => {
                      if (!event) return
                      form.setValue('favicon', event.target.files![0])
                    }}
                    type={'file'}
                  />
                </FormControl>
                <FormDescription>Upload a file as your favicon</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'logo'}
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <Input
                    onChange={(event) => {
                      if (!event) return
                      form.setValue('logo', event.target.files![0])
                    }}
                    type={'file'}
                  />
                </FormControl>
                <FormDescription>Upload a file as your logo</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type={'submit'}>
            Save new assets
          </Button>
        </form>
      </Form>
    </div>
  )
}
