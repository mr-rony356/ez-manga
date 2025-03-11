'use client'
import Link from 'next/link'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { logInRequest } from '@/services'
import PasswordRecoveryDialog from '@/components/password-recovery'
import { env } from "@/env";
import { Icons } from '@/components/Icons'
const signInFormSchema = z.object({
  email: z.string({
    required_error: 'Please, insert an email.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})

type SignInFormValues = z.infer<typeof signInFormSchema>

export default function LoginClient() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: SignInFormValues) {
    toast.promise(logInRequest(data.email.trim(), data.password.trim()), {
      success: () => {
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
        return 'Logged in successfully! Redirecting...'
      },
      loading: `We're checking your credentials...`,
      error:
        'An error occurred while trying to log in. Please, check your credentials and try again.',
    })
  }

  return (
    <>
      <div className="grid grid-cols-12 h-full min-h-screen">
        <div className="col-span-12 bg-background flex flex-col items-center h-full justify-center">
          <div className="flex flex-col justify-center px-6 py-12  shadow-md  lg:px-12 w-fit h-fit rounded bg-background shrink-0 lg:min-w-[540px]">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center items-center">
              <img
                className="mx-auto h-12 w-auto"
                src="/icon.png"
                alt="Your Company"
              />
              <h2 className="mt-2 text-center text-lg lg:text-2xl font-bold text-foreground">
                Sign in to your account
              </h2>
              <span className="text-muted-foreground text-center">
                Enter your email or username below to log into your account.
              </span>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Username / e-mail address
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            autoCorrect="off"
                            placeholder="example@example.com"
                            className="text-xs"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Your password
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            autoCorrect="off"
                            type="password"
                            className="text-xs"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-2">
                    <Button type="submit">Sign in</Button>
                  </div>
                </form>
              </Form>
              <div className="flex flex-row gap-2 items-center my-4">
                <Separator />
                <span className='text-xxs  shrink-0 text-muted-foreground'>

                  OR LOGIN WITH
                </span>
                <Separator />
              </div>
              <div className="flex flex-col gap-2">

                <Link prefetch={false} href={`${env.NEXT_PUBLIC_API_URL}/discord/redirect`}>
                  <Button variant={'outline'} className='flex flex-row gap-2 items-center w-full'>
                    Discord{' '}
                    <FontAwesomeIcon icon={faDiscord as IconProp} />
                  </Button>
                </Link>
                <Link prefetch={false} href={`${env.NEXT_PUBLIC_API_URL}/discord/redirect`}>
                  <Button variant={'outline'} className='flex flex-row gap-2 items-center w-full'>
                    Google{' '}
                    <Icons.google className='h-full w-4' />
                  </Button>
                </Link>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Not a user?{' '}
                <Link prefetch={false} href="/register" className="leading-6 text-foreground">
                  Register yourself now
                </Link>
              </p>
              <div className="text-sm text-foreground flex items-center justify-center">
                <PasswordRecoveryDialog />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
