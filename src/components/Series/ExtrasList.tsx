'use client'
import { Chapter, Season } from '@/types'
import { fetcher } from '@/services'
import { faLock, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { get_file_url } from '@functions'
import Link from 'next/link'
import { get_time_diff, formatNumber } from './helpers'
import useSWR from 'swr'
import Image from 'next/image'

interface ChaptersListProps {
  series_id: string | number
  series_type: 'Comic' | 'Novel'
  series_slug: string
}

const ExtrasList = ({
  series_id,
  series_type,
  series_slug,
}: ChaptersListProps) => {
  const { data, error, isLoading } = useSWR<Chapter[]>(
    `/extras/${series_id.toString()}`,
    fetcher
  )

  const chapters = data

  return (
    <>
      {!isLoading && (
        <div className="space-y-4 bg-background rounded p-5">
          <ul className="grid grid-cols-1 gap-y-8">
            {chapters &&
              chapters.map((chapter) => {
                return (
                  <Link prefetch={false}
                    href={`/series/${series_slug}/${chapter.chapter_slug}`}
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
                        <div className="flex min-w-0 flex-col space-y-1">
                          <div className="flex flex-row gap-2">
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
                          <span className="bg-[#F0EDCF] shrink-0 self-start text-black text-[10px] font-bold text-foreground-100 px-2 py-1 rounded uppercase">
                            <FontAwesomeIcon icon={faLock} /> PREMIUM
                          </span>
                        )}
                      </div>
                    </li>
                  </Link>
                )
              })}
          </ul>
        </div>
      )}
    </>
  )
}

export default ExtrasList
