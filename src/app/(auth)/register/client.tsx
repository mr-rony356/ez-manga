'use client'

import { signUpRequest } from '@/services/auth'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import z from 'zod'

const signUpFormSchema = z.object({
  username: z
    .string({
      required_error: 'Please, insert a valid username.',
    })
    .refine((data) => !data.includes(' '), {
      message: "You can't have a username with white spaces.",
    }),
  email: z
    .string({
      required_error: 'Please, insert an email.',
    })
    .email(),
  password: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters.',
    })
    .max(30, {
      message: 'Password must not be longer than 30 characters.',
    }),
})

type SignUpFormValues = z.infer<typeof signUpFormSchema>

export default function RegisterClient() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const router = useRouter()

  async function onSubmit(data: SignUpFormValues) {
    toast.promise(
      signUpRequest(
        data.username.trim().toLowerCase(),
        data.email.trim().toLowerCase(),
        data.password.trim()
      ),
      {
        success: () => {
          setTimeout(() => {
            router.push('/login')
          }, 1000)
          return 'You have successfully created an account! Redirecting...'
        },
        loading: `We're checking your credentials...`,
        error:
          'An error occurred while trying to log in. Please, check your credentials and try again.',
      }
    )
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
                Sign up
              </h2>
              <span className="text-muted-foreground text-center">
                Enter your email or username below to create an account.
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
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            autoCorrect="off"
                            placeholder="Example_Username"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          E-mail address
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
                    <Button
                      className="dark:bg-black bg-gray-800 w-full"
                      type="submit"
                    >
                      Sign up
                    </Button>
                    <button className="px-4 py-2 font-semibold bg-purple-399 text-foreground rounded w-full">
                      Sign in with Discord{' '}
                      <FontAwesomeIcon icon={faDiscord as IconProp} />
                    </button>
                  </div>
                </form>
              </Form>
              <Separator className="bg-gray-400 my-4" />
              <p className="text-center text-sm text-muted-foreground">
                Already a user?{' '}
                <Link prefetch={false} href="/login" className="leading-6 text-foreground">
                  Sign in right now
                </Link>
              </p>
              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <a href="#" className="text-foreground">
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
