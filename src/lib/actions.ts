'use server'
import API from '@/services/api'
import { purge_cloudflare_cache } from '@/services/cloudflare'
import { Token } from '@/types'
import { Website_Local_API } from '@global'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
export async function authenticate(data: { email: string; password: string }) {
  const cookie_store = cookies()
  const { token } = (await API.post<Token>(`${Website_Local_API}/login`, data))
    .data
  cookie_store.set('_r', token, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function purge_cf_cache(...urls: string[]) {
  await purge_cloudflare_cache(...urls)
}

export async function clear_cache(key: string) {
  await revalidateTag(key)
}
