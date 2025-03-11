'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/Icons"
import Logo from "@/components/logo"
import Link from "next/link"
import { env } from "@/env"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { logInRequest } from "@/services"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const signInFormSchema = z.object({
  email: z.string().email({
    message: 'Please, insert a valid email.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})

type SignInFormValues = z.infer<typeof signInFormSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <Logo className='lg:hidden' />
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your EZ Manga account.
                </p>
              </div>
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
                          E-mail
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-row gap-2 border rounded px-4 items-center">
                            <Icons.user className='h-full w-4' />
                            <Input

                              {...field}
                              type="email"
                              placeholder="john.doe@example.com"
                              className='border-0'
                            />
                          </div>
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
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-row gap-2 border rounded px-4 items-center">
                            <Icons.lock className='h-full w-4' />
                            <Input
                              {...field}
                              type="password"
                              placeholder="***********"
                              className='border-0'
                            />
                          </div>
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



              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 uppercase text-xxs bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">

                <Link prefetch={false} href={`${env.NEXT_PUBLIC_API_URL}/google/redirect`}>
                  <Button variant="outline" className="w-full">
                    <Icons.google className='h-full w-4' />

                    <span className="sr-only">Login with Google</span>
                  </Button>
                </Link>
                <Link prefetch={false} href={`${env.NEXT_PUBLIC_API_URL}/discord/redirect`}>
                  <Button variant="outline" className="w-full">
                    <Icons.discord className='h-full w-4' />
                    <span className="sr-only">Login with Discord</span>
                  </Button>
                </Link>

              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </div>
          <div className="relative hidden bg-muted/20 md:block lg:flex items-center justify-center">
            <Logo className='h-full w-36' />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
