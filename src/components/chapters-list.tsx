'use client'
import { Chapter, Season } from '@/types'
import { useState, useEffect, createRef } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { fetcher, get_chapters_by_series_id } from '@/services'
import { faLock, faEye, faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { get_file_url } from '@functions'
import Link from 'next/link'
import { get_time_diff, formatNumber } from '@/components/Series/helpers'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

interface ChaptersListProps {
  seasons: Season[]
  series_id: string | number
  series_type: 'Comic' | 'Novel'
}

const ChaptersList = ({
  series_id,
  seasons,
  series_type,
}: ChaptersListProps) => {
  const [seasons_ids, setSeasons] = useState<number[]>([])
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number[]>([])

  const containerRef = createRef<HTMLDivElement>()

  const { data, error, isLoading } = useSWR<{ data: Chapter[]; meta: any }>(
    `/chapter/query?${new URLSearchParams({
      page: page.toString(),
      perPage: '30',
      series_id: series_id.toString(),
    }).toString()}`,
    fetcher
  )

  const chapters = data?.data

  useEffect(() => {
    if (data)
      setPages(Array.from({ length: data.meta.last_page }, (_, i) => i + 1))
    if (containerRef.current && data && data.meta.current_page !== 1) {
      const coords = containerRef.current.getBoundingClientRect()
      console.log(coords)
      window.scrollTo({
        behavior: 'smooth',
        top: coords.top + coords.height,
      })
    }
  }, [data])

  return (
    <>
      {!isLoading && (
        <div className="space-y-4 bg-background rounded p-5" ref={containerRef}>
          <ul className="grid grid-cols-1 gap-y-8">
            {chapters &&
              chapters.map((chapter) => {
                return (
                  <Link prefetch={false}
                    href={`/series/${chapter.series.series_slug}/${chapter.chapter_slug}`}
                    key={chapter.id}
                    className="text-foreground visited:text-muted-foreground"
                  >
                    <li key={chapter.id} className="flex justify-between">
                      <div className="flex text-left relative items-center w-full justify-start rounded overflow-hidden p-0   gap-x-3">
                        {series_type !== 'Novel' && (
                          <div className="min-h-[56px] shrink-0 rounded overflow-hidden">
                            {chapter.chapter_thumbnail && (
                              <Image
                                width={143}
                                height={86}
                                alt=""
                                src={get_file_url(chapter.chapter_thumbnail)}
                                className="w-auto h-[86px]"
                              />
                            )}
                            {!chapter.chapter_thumbnail && (
                              <Image
                                width={143}
                                height={86}
                                alt=""
                                src={`/thumbnail.jpg`}
                                className="w-auto h-[86px]"
                              />
                            )}
                          </div>
                        )}
                        <div className="flex min-w-0 self-start flex-col space-y-1">
                          <div className="flex flex-row gap-2 items-start">
                            <span className="m-0 text-[1rem] line-clamp-1 lg:max-w-none">
                              {chapter.chapter_title
                                ? `${chapter.chapter_name} - ${chapter.chapter_title}`
                                : chapter.chapter_name}
                            </span>
                          </div>
                          {!chapter.views && (
                            <span className="text-muted-foreground text-[12px] block">
                              {get_time_diff(chapter.created_at)}
                            </span>
                          )}
                          {chapter.views && (
                            <span className="m-0   text-muted-foreground text-[0.875rem] leading-[1.43] block">
                              {get_time_diff(chapter.created_at)} -{' '}
                              <FontAwesomeIcon icon={faEye} />{' '}
                              {formatNumber(chapter.views)}
                            </span>
                          )}
                        </div>
                        {chapter.price > 0 && (
                          <span className="bg-primary shrink-0 self-start text-foreground text-[10px] font-bold text-foreground-100 px-2 py-1 rounded uppercase">
                            <FontAwesomeIcon icon={faLock} /> PREMIUM
                          </span>
                        )}
                      </div>
                    </li>
                  </Link>
                )
              })}
          </ul>
          <Pagination className="gap-x-2">
            <PaginationContent>
              <PaginationItem data-has-previous={page !== 1 ? true : false}>
                <PaginationPrevious
                  onClick={() => {
                    if (page !== 1) setPage(page - 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
            <PaginationContent className="lg:hidden">
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </PaginationContent>
            <PaginationContent className="hidden lg:flex">
              {pages.map((page_item) => {
                return (
                  <PaginationItem key={page_item}>
                    <PaginationLink
                      isActive={page_item == page ? true : false}
                      onClick={() => {
                        if (page_item !== page) setPage(page_item)
                      }}
                    >
                      {page_item}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
            </PaginationContent>
            <PaginationContent>
              <PaginationItem
                data-has-next={page !== pages.length ? true : false}
              >
                <PaginationNext
                  onClick={() => {
                    if (page !== pages.length) setPage(page + 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )
}

export default ChaptersList
