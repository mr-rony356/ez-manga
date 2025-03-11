import { createEnv } from '@t3-oss/env-nextjs'
import { z, ZodTypeAny } from 'zod'

export const arrayFromString = <T extends ZodTypeAny>(
  schema: T,
  min: number = 0
) => {
  return z.preprocess((obj) => {
    if (Array.isArray(obj)) {
      return obj
    } else if (typeof obj === 'string') {
      return obj.split(',')
    } else {
      return []
    }
  }, z.array(schema).min(min))
}

export const booleanFromString = <T extends ZodTypeAny>(schema: T) => {
  return z.preprocess((obj) => {
    return obj === 'true'
  }, z.boolean(schema))
}

export const env = createEnv({
  server: {
    LOCAL_API: z.string().url(),
    IS_MAINTENANCE_ENABLED: booleanFromString(z.string()),
    IS_ADS_ENABLED: booleanFromString(z.string()),
    SHOW_ADULT_SERIES: booleanFromString(z.string()),
    HOME_TEMPLATE: z.enum(['1', '2']),
    HOME_DESCRIPTION: z.string(),
    HOME_SEO_TITLE: z.string(),
    IS_GOOGLE_ANALYTICS_ENABLED: booleanFromString(z.string()),
  },
  client: {
    NEXT_PUBLIC_DISQUS_SHORTNAME: z.string(),
    NEXT_PUBLIC_WEBSITE_NAME: z.string().min(1),
    NEXT_PUBLIC_WEBSITE_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().min(1),
    NEXT_PUBLIC_DISCORD_URL: z.string().url(),
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string(),
    NEXT_PUBLIC_LOCAL_API: z.string().url(),
    NEXT_PUBLIC_USE_ADBLOCK_BLOCKER: booleanFromString(z.string()),
    NEXT_PUBLIC_SHOP_URL: z.string().url(),
    NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_ADS_SLOTS: arrayFromString(z.string().min(1), 3),
    NEXT_PUBLIC_GOOGLE_ADS_CHAPTER_SLOTS: arrayFromString(
      z.string().min(1),
      10
    ),
    NEXT_PUBLIC_USE_PAYPAL: booleanFromString(z.string()),
    NEXT_PUBLIC_USE_GOOGLE_ADSENSE: booleanFromString(z.string()),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_DISQUS_SHORTNAME: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME,
    NEXT_PUBLIC_WEBSITE_NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME,
    NEXT_PUBLIC_USE_ADBLOCK_BLOCKER: process.env.NEXT_PUBLIC_USE_ADBLOCK_BLOCKER,
    NEXT_PUBLIC_USE_GOOGLE_ADSENSE: process.env.NEXT_PUBLIC_USE_GOOGLE_ADSENSE,
    NEXT_PUBLIC_GOOGLE_ADS_CHAPTER_SLOTS:
      process.env.NEXT_PUBLIC_GOOGLE_ADS_CHAPTER_SLOTS,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_DISCORD_URL: process.env.NEXT_PUBLIC_DISCORD_URL,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    NEXT_PUBLIC_LOCAL_API: process.env.NEXT_PUBLIC_LOCAL_API,
    NEXT_PUBLIC_SHOP_URL: process.env.NEXT_PUBLIC_SHOP_URL,
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
    NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_ADS_SLOTS: process.env.NEXT_PUBLIC_GOOGLE_ADS_SLOTS,
    NEXT_PUBLIC_USE_PAYPAL: process.env.NEXT_PUBLIC_USE_PAYPAL,
  },
})
