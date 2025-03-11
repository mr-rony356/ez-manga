'use client'

import { Form } from '@/components/ui/form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import API from '@/services/api'
import { toast } from 'sonner'
import { Website_URL } from '@global'
import { ThemeCustomizer } from '@/components/theme-customizer'
import { useConfig } from '@/hooks/use-config'
import { useEffect } from 'react'

const schema = z.object({
  theme: z.string().optional(),
})

export default function ThemeForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  const [config] = useConfig()

  useEffect(() => {
    form.setValue('theme', config.theme)
  }, [config])

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      await API.post(`${Website_URL}/api/theme`, data)
      toast.success(
        'The theme was updated successfully! Website will rebuild...'
      )
    } catch (error) {
      toast.error('An error occurred while trying to update the theme.')
    }
  }

  return (
    <div
      className={
        'bg-background p-4 rounded flex flex-col gap-2 items-center justify-center'
      }
    >
      <ThemeCustomizer />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={'space-y-4 w-full'}
        >
          <Button className="w-full" type={'submit'}>
            Customize website
          </Button>
        </form>
      </Form>
    </div>
  )
}
