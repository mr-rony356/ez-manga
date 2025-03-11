export const Website_Name = process.env.NEXT_PUBLIC_WEBSITE_NAME
export const Website_API = process.env.NEXT_PUBLIC_API_URL
export const Website_Local_API = process.env.NEXT_PUBLIC_LOCAL_API
export const Website_Country = process.env.NEXT_PUBLIC_COUNTRY
export const Website_Locale = process.env.NEXT_PUBLIC_LOCALE
export const Website_URL = process.env.NEXT_PUBLIC_WEBSITE_URL!
export const DisqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!
export const CDN_Url = process.env.NEXT_PUBLIC_CDN_URL
export const Discord_URL = process.env.NEXT_PUBLIC_DISCORD_URL!
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
export const PATREON_CLIENT_ID = process.env.NEXT_PUBLIC_PATREON_CLIENT_ID!

export const ADS_SLOTS = [
  '8273491786',
  '7143995526',
  '7163271279',
  '7511745979',
  '9135980534',
  '6055409671',
]

export const queryOrderBy = [
  {
    name: 'Updated at',
    value: 'latest',
  },
  {
    name: 'Created at',
    value: 'created_at',
  },
  {
    name: 'Title',
    value: 'title',
  },
  {
    name: 'Trending',
    value: 'total_views',
  },
]

export const queryOrder = [
  {
    name: 'Ascending',
    value: 'asc',
  },
  {
    name: 'Descending',
    value: 'desc',
  },
]

export const status = [
  {
    name: 'All',
    value: 'All',
  },
  {
    name: 'Ongoing',
    value: 'Ongoing',
  },
  {
    name: 'Hiatus',
    value: 'Hiatus',
  },
  {
    name: 'Dropped',
    value: 'Dropped',
  },
  {
    name: 'Completed',
    value: 'Completed',
  },
  {
    name: 'Canceled',
    value: 'Canceled',
  },
]

export const series_types = [
  {
    name: 'Novel',
    value: 'Novel',
  },
  {
    name: 'Comic',
    value: 'Comic',
  },
  {
    name: 'All',
    value: 'All',
  },
]

export const series_visibility = [
  {
    name: 'Public',
    value: 'Public',
  },
  {
    name: 'Private',
    value: 'Private',
  },
]

export const perPageValues = [
  {
    name: '12',
    value: 12,
  },
  {
    name: '18',
    value: 18,
  },
  {
    name: '24',
    value: 24,
  },
  {
    name: '36',
    value: 36,
  },
  {
    name: '48',
    value: 48,
  },
  {
    name: '60',
    value: 60,
  },
]
