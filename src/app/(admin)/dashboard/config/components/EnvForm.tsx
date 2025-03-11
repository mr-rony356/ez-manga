'use client'
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
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z, { ZodTypeAny } from 'zod'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { booleanFromString, env } from '@/env'
import API from '@/services/api'
import { Website_URL } from '@global'

const envSchema = z.record(z.string().transform((v) => v.trim()))

const newEnvSchema = z.object<Record<keyof typeof env, ZodTypeAny>>({
  NEXT_PUBLIC_DISQUS_SHORTNAME: z.string().transform((v) => v.trim()),
  HOME_DESCRIPTION: z.string().transform((v) => v.trim()),
  HOME_SEO_TITLE: z.string().transform((v) => v.trim()),
  NEXT_PUBLIC_WEBSITE_NAME: z.string().transform((v) => v.trim()),
  NEXT_PUBLIC_WEBSITE_URL: z
    .string()
    .url()
    .transform((v) => v.trim()),
  NEXT_PUBLIC_LOCAL_API: z
    .string()
    .url()
    .transform((v) => v.trim()),
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .transform((v) => v.trim()),
  NEXT_PUBLIC_DISCORD_URL: z
    .string()
    .url()
    .transform((v) => v.trim()),
  NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID: z
    .string()
    .refine((v) => v.startsWith('ca-'), {
      message: 'Client ID must start with "ca-"',
    }),
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v.startsWith('G-'), {
      message: 'ID must start with "G-"',
    }),
  NEXT_PUBLIC_GOOGLE_ADS_SLOTS: z
    .string()
    .transform((v) => v.trim().replaceAll(' ', ''))
    .refine((v) => /^([0-9])+(,?[0-9])*$/.test(v), {
      message: `The value can only contain numbers and commas, but cannot end in a comma. Example: "1,2,3"`,
    }),
  NEXT_PUBLIC_GOOGLE_ADS_CHAPTER_SLOTS: z
    .string()
    .transform((v) => v.trim().replaceAll(' ', ''))
    .refine((v) => /^([0-9])+(,?[0-9])*$/.test(v), {
      message: `The value can only contain numbers and commas, but cannot end in a comma. Example: "1,2,3"`,
    }),
  LOCAL_API: z
    .string()
    .url()
    .transform((v) => v.trim()),
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().transform((v) => v.trim()),
  IS_MAINTENANCE_ENABLED: booleanFromString(z.string()),
  NEXT_PUBLIC_USE_GOOGLE_ADSENSE: booleanFromString(z.string()),
  SHOW_ADULT_SERIES: booleanFromString(z.string()),
  IS_ADS_ENABLED: booleanFromString(z.string()),
  IS_GOOGLE_ANALYTICS_ENABLED: booleanFromString(z.string()),
  NEXT_PUBLIC_USE_PAYPAL: booleanFromString(z.string()),
  HOME_TEMPLATE: z.enum(['1', '2']),
  NEXT_PUBLIC_SHOP_URL: z
      .string()
      .url()
      .transform((v) => v.trim()),
    NEXT_PUBLIC_USE_ADBLOCK_BLOCKER: booleanFromString(z.string()),
})

type VariableData = {
  label: string
  description: string
} & (
  | {
      type: 'text' | 'boolean'
    }
  | {
      type: 'options'
      options: {
        label: string
        value: string
      }[]
    }
)

const envNames: Record<keyof typeof env, VariableData> = {
  NEXT_PUBLIC_DISQUS_SHORTNAME: {
    type: 'text',
    label: 'Disqus shortname',
    description: 'Disqus shortname'
  },
  NEXT_PUBLIC_USE_ADBLOCK_BLOCKER: {
    type: 'boolean',
    label: 'Use Adblock Blocker',
    description: 'Enable or disable Adblock Blocker',
  },
  NEXT_PUBLIC_SHOP_URL: {
      type: 'text',
      label: 'Shop URL',
      description: 'URL of the shop',
    },
  NEXT_PUBLIC_GOOGLE_ADS_CHAPTER_SLOTS: {
    label: 'Google Ads Chapter Slots',
    description: 'Ad slots for Google AdSense on chapter pages',
    type: 'text',
  },
  HOME_DESCRIPTION: {
    label: 'Home Description',
    description: 'Description for the homepage',
    type: 'text',
  },
  HOME_SEO_TITLE: {
    label: 'Home SEO Title',
    description: 'SEO Title for the homepage',
    type: 'text',
  },
  IS_ADS_ENABLED: {
    label: 'Use Ads',
    description: 'Enable or disable ads',
    type: 'boolean',
  },
  IS_GOOGLE_ANALYTICS_ENABLED: {
    label: 'Use Google Analytics',
    description: 'Enable or disable Google Analytics',
    type: 'boolean',
  },
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: {
    label: 'Google Analytics ID',
    description: 'Google Analytics ID',
    type: 'text',
  },
  HOME_TEMPLATE: {
    label: 'Home Template',
    description: 'Choose a template for the homepage',
    type: 'options',
    options: [
      { label: 'Template 1', value: '1' },
      { label: 'Template 2', value: '2' },
    ],
  },
  NEXT_PUBLIC_USE_PAYPAL: {
    label: 'Use PayPal',
    description: 'Enable or disable PayPal',
    type: 'boolean',
  },
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: {
    label: 'PayPal Client ID',
    description: 'PayPal Client ID',
    type: 'text',
  },
  NEXT_PUBLIC_WEBSITE_NAME: {
    label: 'Website Name',
    description: 'Name of the website',
    type: 'text',
  },
  NEXT_PUBLIC_WEBSITE_URL: {
    label: 'Website URL',
    description: 'URL of the website',
    type: 'text',
  },
  NEXT_PUBLIC_LOCAL_API: {
    label: 'Local API',
    description: 'URL of the local API',
    type: 'text',
  },
  NEXT_PUBLIC_API_URL: {
    label: 'API URL',
    description: 'URL of the API',
    type: 'text',
  },
  NEXT_PUBLIC_DISCORD_URL: {
    label: 'Discord URL',
    description: 'URL of the Discord server',
    type: 'text',
  },
  NEXT_PUBLIC_USE_GOOGLE_ADSENSE: {
    label: 'Use Google AdSense',
    description: 'Enable or disable Google AdSense',
    type: 'boolean',
  },
  NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID: {
    label: 'Google Ads Client ID',
    description: 'Client ID for Google AdSense',
    type: 'text',
  },
  NEXT_PUBLIC_GOOGLE_ADS_SLOTS: {
    label: 'Google Ads Slots',
    description: 'Ad slots for Google AdSense',
    type: 'text',
  },
  LOCAL_API: {
    label: 'Local API',
    description: 'URL of the local API',
    type: 'text',
  },
  IS_MAINTENANCE_ENABLED: {
    label: 'Maintenance Mode',
    description: 'Enable or disable maintenance mode',
    type: 'boolean',
  },
  SHOW_ADULT_SERIES: {
    label: 'Show Adult Series',
    description: 'Enable or disable adult series',
    type: 'boolean',
  },
}

export default function EnvForm({ env }: { env: Record<string, string> }) {
  const form = useForm({
    resolver: zodResolver(newEnvSchema),
    mode: 'onChange',
    defaultValues: env,
  })

  const parsedEnv = newEnvSchema.parse(env)

  async function update_env(values: z.infer<typeof envSchema>) {
    try {
      await API.post(`${Website_URL}/api/website`, values)
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
    <div className="bg-background p-4 rounded">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(update_env)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center"
        >
          
          <span className={'text-foreground font-semibold col-span-full'}>
            Frontend environment
          </span>
          {Object.entries(parsedEnv).map(([key]) => {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => {
                  const variable = envNames[key as keyof typeof envNames]
                  switch (variable.type) {
                    case 'text': {
                      return (
                        <FormItem className="col-span-full lg:col-span-1">
                          <FormLabel>{variable.label}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            {variable.description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )
                    }
                    case 'boolean': {
                      return (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={field.value === 'true'}
                              onCheckedChange={(checked) =>
                                form.setValue(key, checked.toString())
                              }
                              id={key}
                            />
                            <Label htmlFor={key}>{variable.label}</Label>
                          </div>
                          <FormDescription>
                            {' '}
                            {variable.description}{' '}
                          </FormDescription>
                        </div>
                      )
                    }
                    case 'options': {
                      return (
                        <div className="flex flex-col gap-2">
                          <FormLabel>{variable.label}</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(e) => form.setValue(key, e)}
                          >
                            <SelectTrigger>
                              <SelectValue>
                                {
                                  variable.options.find(
                                    (option) => option.value === field.value
                                  )?.label
                                }
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {variable.options.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {variable.description}
                          </FormDescription>
                        </div>
                      )
                    }
                    default: {
                      return <Input {...field} />
                    }
                  }
                }}
              />
            )
          })}
          <Button
            variant={'destructive'}
            type="submit"
            className="col-span-full"
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  )
}
