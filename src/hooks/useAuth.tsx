import { fetcher } from '@/services'
import { UserDataResponse } from '@/types'
import useSWRImmutable from 'swr/immutable'

export default function useAuthentication() {
  const { data, error, isLoading, mutate } = useSWRImmutable<UserDataResponse>(
    '/auth/user',
    fetcher
  )

  return { data, error, isLoading, mutate }
}

export async function logOut() {
  await fetch('/api/logout')
}
