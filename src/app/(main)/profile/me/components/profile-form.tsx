'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { User } from '@/types'
import { updateUser } from "@/services";
import API from "@/services/api";
import { env } from "@/env";
import Link from 'next/link'

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  password: z.string(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm({ user }: { user: User }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: user.email!,
      username: user.username,
      password: '',
    },
    mode: 'onChange',
  })

  async function onSubmit(data: ProfileFormValues) {
    await updateUser(user.id, data)
    toast('Done')
  }

  async function unlinkDiscord() {
    await API.get('/discord/unlink')
    toast('Discord account unlinked')

  }

  return (
    <div className={'space-y-4'}>
      {user.discord_account && <Button onClick={unlinkDiscord} variant={'destructive'}>
        Unlink Discord Account
      </Button>}
      {!user.discord_account && <Button className={'bg-purple-600'} variant={'default'}><Link prefetch={false} href={`${env.NEXT_PUBLIC_API_URL}/discord/redirect`}>
        Link Discord Account
      </Link></Button>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 space-x-2">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormDescription className="text-muted-foreground">
                  This is your e-mail and cannot be changed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>Your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update profile</Button>

        </form>
      </Form>
    </div>
  )
}
