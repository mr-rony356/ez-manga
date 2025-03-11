import axios from 'axios'

interface PurgeCacheBody {
  tags?: string[]
  hosts?: string[]
  prefixes?: string[]
  files?: string[]
}

const WebsiteZoneID = process.env.CLOUDFLARE_ZONE_ID!

const CloudflareAPI = axios.create({
  baseURL: 'https://api.cloudflare.com/client/v4',
  headers: {
    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN!}`,
  },
})

export async function purge_cloudflare_cache(...urls: string[]): Promise<void> {
  await CloudflareAPI.post(`/zones/${WebsiteZoneID}/purge_cache`, {
    files: urls,
  } as PurgeCacheBody)
}

export default CloudflareAPI
