'use client'

import { fetcher } from '@/services/api'
import useSWR from 'swr'
import { Skeleton } from '../ui/skeleton'
import { User } from '@/types'
import { get_time_diff } from './helpers'
import { Avatar, AvatarImage } from '../ui/avatar'
import { useState } from 'react'
import clsx from 'clsx'
import { Separator } from '@/components/ui/separator'
import { Button } from '../ui/button'

type NoticesListProps = {
  series_id: number | string
}

type Notice = {
  id: number
  title: string
  content: string
  author_id: number | string | null
  is_pinned: boolean
  created_at: string
  updated_at: string
  author: User
}

export const NoticesList = ({ series_id }: NoticesListProps) => {
  const {
    data: notices,
    isLoading,
    error,
  } = useSWR<Notice[]>(`/series/${series_id}/notices`, fetcher)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full p-2 rounded" />
        <Skeleton className="h-20 w-full p-2 rounded" />
        <Skeleton className="h-20 w-full p-2 rounded" />
        <Skeleton className="h-20 w-full p-2 rounded" />
        <Skeleton className="h-20 w-full p-2 rounded" />
        <Skeleton className="h-20 w-full p-2 rounded" />
        <Skeleton className="h-20 w-full p-2 rounded" />
        <Skeleton className="h-20 w-full p-2 rounded" />
        <Skeleton className="h-20 w-full p-2 rounded" />
        <Skeleton className="h-20 w-full p-2 rounded" />
        <Skeleton className="h-20 w-full p-2 rounded" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4 py-5">
        <ul className="grid grid-cols-1 gap-y-3">
          {notices &&
            notices.map((notice) => {
              return <NoticeItem notice={notice} key={notice.id} />
            })}
        </ul>
      </div>
    </>
  )
}

type NoticeItemProps = {
  notice: Notice
}

export const NoticeItem = ({ notice }: NoticeItemProps) => {
  const [showMore, setShowMore] = useState(false)

  return (
    <li key={notice.id} className="bg-muted shadow-md p-4 rounded-md">
      <div className="flex flex-col lg:flex-row justify-between">
        <span className="text-base lg:text-lg font-bold">{notice.title}</span>
        <span className="hidden lg:block text-xxs lg:text-sm text-muted-foreground">
          {get_time_diff(notice.created_at)}
        </span>
      </div>
      <div className="flex flex-row gap-2 justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <Avatar className="h-6 w-6 border-primary/50 border">
            <AvatarImage src={notice.author.profile_picture} />
          </Avatar>
          <span className="text-xxs text-foreground/50">
            {notice.author.username}
          </span>
        </div>
        <span className="text-xxs lg:text-sm text-muted-foreground lg:hidden">
          {get_time_diff(notice.created_at)}
        </span>
      </div>
      <div
        className={clsx('text-sm mt-2 text-muted-foreground', {
          'line-clamp-3': !showMore,
        })}
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />
      <div className="flex flex-row gap-3 items-center">
        <span className="w-full h-[0.5px] bg-foreground/10" />
        <Button
          className="text-xxs hover:bg-background/25"
          variant="outline"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'Show less' : 'Show more'}
        </Button>
        <span className="w-full h-[0.5px] bg-foreground/10" />
      </div>
    </li>
  )
}
