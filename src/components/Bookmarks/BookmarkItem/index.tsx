'use client'
import { Button } from '@/components/ui/button'
import { get_time_diff } from '@/components/Series/helpers'

import { Bookmark } from '@/services/server/series'
import { get_file_url } from '@functions'
import parse from 'html-react-parser'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { bookmarkSeries, markAllAsRead } from '@/services'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { ScrollArea } from '@/components/ui/scroll-area'
const BookmarkItem = ({ bookmark }: { bookmark: Bookmark }) => {
  const router = useRouter()

  const hasReadChapters = !!(
    bookmark.meta &&
    bookmark.meta.pivot_read_chapters &&
    bookmark.meta.pivot_read_chapters.read
  )

  const unread_chapters = bookmark.chapters.filter(
    (chapter) => !bookmark.meta.pivot_read_chapters.read.includes(chapter.id)
  )

  const read_chapters = bookmark.chapters.filter((chapter) =>
    bookmark.meta.pivot_read_chapters.read.includes(chapter.id)
  )

  async function unbookmark() {
    await toast.promise(bookmarkSeries(bookmark.series_slug), {
      pending: `We're removing this series from your bookmarks...`,
      error:
        'There was an error while adding the series to your bookmarks, try again later...',
      success: `We're removed this series from your bookmarks!`,
    })
    router.refresh()
  }

  async function mark_all_as_read() {
    await toast.promise(markAllAsRead(bookmark.id.toString()), {
      pending: `We're marking all chapters as read...`,
      error:
        'There was an error while marking all chapters as read, try again later...',
      success: `We're marked all chapters as read!`,
    })
    router.refresh()
  }

  return (
    <div className="w-full shadow-xl">
      <div className="flex flex-col p-5 gap-y-2">
        <div className="flex flex-row gap-3">
          <div className="rounded shrink-0 h-full w-[60px] lg:w-[60px] relative">
            <img
              className="rounded h-full w-[120px] lg:w-[220px]"
              src={get_file_url(bookmark.thumbnail)}
            />
          </div>
          <div>
            <h5 className="font-bold text-foreground text-xs md:text-bg line-clamp-1 overflow-ellipsis">
              {bookmark.title}
            </h5>
            <div className="text-muted-foreground text-xxs md:text-sm line-clamp-2">
              {parse(bookmark.description)}
            </div>
            {hasReadChapters && (
              <span className="text-muted-foreground text-xs font-bold">
                {`${Math.round(
                  (bookmark.meta.pivot_read_chapters.read.length /
                    bookmark.chapters.length) *
                  100
                )}% read`}
              </span>
            )}
          </div>
        </div>
        <div className={'flex flex-row flex-wrap gap-2'}>
          <Button
            variant={'outline'}
            onClick={mark_all_as_read}
            className={
              'text-xs w-full lg:w-fit bg-green-700 hover:bg-green-700/50'
            }
          >
            Mark all as read &#9989;
          </Button>
          <Button
            variant={'destructive'}
            onClick={unbookmark}
            className={'text-xs w-full lg:w-fit'}
          >
            Remove bookmark &#10060;
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-3">
          <div
            className={
              'flex flex-col gap-3 overflow-y-auto bg-muted/50 rounded p-4'
            }
          >
            <span className={'font-bold text-muted-foreground'}>
              Read chapters
            </span>
            <ScrollArea className={'h-[120px]'}>
              <ul className="flex flex-col gap-3 w-full overflow-y-auto">
                {hasReadChapters &&
                  read_chapters.length > 0 &&
                  read_chapters.map((chapter) => {
                    return (
                      <li key={chapter.id}>
                        <div className="flex flex-row gap-3">
                          <div className="flex flex-col gap-1 items-start justify-between">
                            <Link prefetch={false}
                              href={`/series/${bookmark.series_slug}/${chapter.chapter_slug}`}
                            >
                              <span className="text-foreground font-semibold">
                                {chapter.chapter_name}
                              </span>
                            </Link>
                            <span className={'text-muted-foreground text-xxs'}>
                              <FontAwesomeIcon icon={faClock} />{' '}
                              {get_time_diff(chapter.created_at)}
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
              </ul>
            </ScrollArea>
          </div>
          <div
            className={
              'flex flex-col gap-3 overflow-y-auto bg-muted rounded p-4'
            }
          >
            <span className={'font-bold text-muted-foreground'}>
              Unread chapters
            </span>
            <ScrollArea className={'h-[120px]'}>
              <ul className="flex flex-col gap-3 w-full">
                {hasReadChapters &&
                  unread_chapters.length > 0 &&
                  unread_chapters.map((chapter) => {
                    return (
                      <li key={chapter.id}>
                        <div className="flex flex-row gap-3">
                          <div className="flex flex-col gap-1 items-start justify-between">
                            <Link prefetch={false}
                              href={`/series/${bookmark.series_slug}/${chapter.chapter_slug}`}
                            >
                              <span className="text-foreground font-semibold">
                                {chapter.chapter_name}
                              </span>
                            </Link>
                            <span className={'text-muted-foreground text-xxs'}>
                              <FontAwesomeIcon icon={faClock} />{' '}
                              {get_time_diff(chapter.created_at)}
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookmarkItem
