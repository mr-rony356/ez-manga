import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Website_Local_API } from '@global'
import { Purchase, User } from '@/types'

export type userDataResponse = {
  id: string
  username: string
  email: string
  role: 'Reader' | 'Editor' | 'Admin'
  coins: number
  profile_picture: string
  patreon_account: any
}

export type UserDataResponse = {
  isLoggedIn: boolean
  user: User | undefined
}

type UsersDataResponse = {
  meta: any
  data: User[]
}

const ALLOWED_ROLES = ['Admin', 'Editor']

const checkAuth = async () => {
  const data = await getUserData()

  if (data && data.user) {
    if (!ALLOWED_ROLES.includes(data.user.role)) redirect('/login')
  }
}

const getUserData = async (): Promise<UserDataResponse> => {
  const cookieStore = cookies()
  const string_cookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
  const url = new URL('/auth/user', Website_Local_API)
  const user_data = await fetch(url, {
    credentials: 'include',
    headers: {
      cookie: string_cookies,
    },
  })

  return (await user_data.json()) as UserDataResponse
}

const getUsers = async () => {
  const url = new URL('/users', Website_Local_API)
  const users_data: UsersDataResponse = await (
    await fetch(url, {
      credentials: 'include',
    })
  ).json()
  return users_data
}

export const getUser = async (id: string) => {
  const url = new URL('/users/' + id, Website_Local_API)
  const cookieStore = cookies()
  const string_cookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
  const users_data: User = await (
    await fetch(url, {
      credentials: 'include',
      headers: {
        cookie: string_cookies,
      },
    })
  ).json()
  return users_data
}

export const getPurchases = async () => {
  const cookieStore = cookies()
  const string_cookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
  const url = new URL('/api/orders', Website_Local_API)
  const purchases: Purchase[] = await (
    await fetch(url, {
      credentials: 'include',
      headers: {
        cookie: string_cookies,
      },
    })
  ).json()
  return purchases
}

const onlyLoggedIn = async () => {}

const isLoggedIn = () => {
  return true
}

export { checkAuth, onlyLoggedIn, getUserData, getUsers, isLoggedIn }
