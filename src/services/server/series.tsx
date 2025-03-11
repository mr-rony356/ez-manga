import { Chapter } from '@/components/Series/helpers'
import { AdminSeries, User } from '@/types'
import { Website_Local_API } from '@global'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Series } from '@/types'

export type BookmarksResponse = Bookmark[]

export type Bookmark = {
  badge: string
  chapters: Chapter[]
  id: number
  meta: {
    pivot_user_id: number
    pivot_series_id: number
    pivot_read_chapters: {
      read: number[]
    }
  }
  series_slug: string
  series_type: 'Comic' | 'Novel'
  thumbnail: string
  description: string
  title: string
  visibility: 'Public' | 'Private'
}

export async function getBookmarks() {
  const cookieStore = cookies()
  const string_cookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
  const url = new URL('/bookmarks', Website_Local_API)
  const bookmarks: BookmarksResponse = await (
    await fetch(url, {
      credentials: 'include',
      headers: {
        cookie: string_cookies,
      },
    })
  ).json()

  return bookmarks
}

export async function getSeries(id: number | string) {
  const cookieStore = cookies()
  const string_cookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
  const url = new URL(`/series/id/${id}`, Website_Local_API)
  const series: Series = await (
    await fetch(url, {
      credentials: 'include',
      headers: {
        cookie: string_cookies,
      },
    })
  ).json()

  return series
}

type CheckBookmarkResponse = {
  hasBookmarked: boolean
  isLoggedIn: boolean
  hasReviewed: boolean
  series?: Series
}

export async function checkBookmark(
  series_slug: string
): Promise<CheckBookmarkResponse> {
  const cookieStore = cookies()
  const string_cookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
  const token = cookieStore.get('ts-session')
  const url = new URL(`/bookmarks/${series_slug}`, Website_Local_API)
  if (!token) {
    return {
      hasBookmarked: false,
      isLoggedIn: false,
      hasReviewed: false,
    }
  }
  const isBookmarked = await (
    await fetch(url, {
      credentials: 'include',
      headers: {
        cookie: string_cookies,
      },
    })
  ).json()
  return isBookmarked
}

export async function query() {
  const url = new URL(`/query?orderBy=created_at`, Website_Local_API)
  const series: {
    meta: any
    data: Series[]
  } = await (
    await fetch(url, {
      credentials: 'include',
    })
  ).json()

  return series
}

export async function getAllSeries() {
  const cookieStore = cookies()
  const string_cookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
  const url = new URL(`/series/all`, Website_Local_API)
  const series: {
    id: number
    title: string
  }[] = await (
    await fetch(url, {
      credentials: 'include',
      headers: {
        cookie: string_cookies,
      },
    })
  ).json()

  return series
}

export async function getSeriesRanking() {
  const cookieStore = cookies()
  const string_cookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
  const url = new URL(`/income/ranking`, Website_Local_API)
  const series: {
    meta: {
      sum: number
    }
    series: {
      id: number
      title: string
      thumbnail: string
    }
    series_id: number
  }[] = await (
    await fetch(url, {
      headers: {
        cookie: string_cookies,
      },
    })
  ).json()

  return series
}

export async function getBanners() {
  const url = new URL(`/series/banners`, Website_Local_API)
  const banners: {
    id: number
    series: Series
    protagonist: string
    background: string
    banner: string
    index: number
  }[] = await (
    await fetch(url, {
      next: {
        revalidate: 0,
      },
    })
  ).json()

  return banners
}

export async function getGroups() {
  const url = new URL(`/groups`, Website_Local_API)
  const groups: {
    id: string
    name: string
  }[] = await (
    await fetch(url, {
      credentials: 'include',
    })
  ).json()

  return groups
}

export async function getAnnouncements() {
  const url = new URL(`/announcements`, Website_Local_API)
  const announcements: {
    data: {
      id: string
      title: string
      slug: string
      content: string
      created_at: string
    }[]
  } = await (await fetch(url)).json()
  return announcements
}

export async function getAnnouncement(slug: string) {
  const url = new URL(`/announcements/${slug}`, Website_Local_API)
  const announcement: {
    id: string
    title: string
    slug: string
    content: string
    created_at: string
    author: User
  } = await (
    await fetch(url, {
      next: {
        tags: [`announcement-${slug}`],
      },
    })
  ).json()
  return announcement
}
