'use client'
import {Form, FormControl, FormField, FormItem, FormLabel} from '@/components/ui/form'

import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import z from 'zod'
import {toast} from 'sonner'
import API from "@/services/api";

const envSchema = z.record(z.string())

export default function BackendEnvForm({env}: { env: Record<string, string> }) {
    const form = useForm({
        resolver: zodResolver(envSchema),
        mode: 'onChange',
        defaultValues: env,
    })

    async function update_env(values: z.infer<typeof envSchema>) {
        try {
            await API.post('/v2/config', values)
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
        <div className="bg-background p-4 rounded text-muted-foreground">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(update_env)} className="space-y-4">
                    <span className={'text-foreground font-semibold'}>Backend environment</span>
                    {Object.entries(env).map(([key, value]) => (
                        <FormField
                            key={key}
                            control={form.control}
                            name={key}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{key}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Example..." {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button variant={'destructive'} type="submit">
                        Save
                    </Button>
                </form>
            </Form>
        </div>
    )
}
