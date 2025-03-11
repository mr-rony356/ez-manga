'use client'
import { Input } from '@/components/ui/input'
import { AnnouncementsDashboardContext } from './Context'
import { useContext } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebounceCallback } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export const AnnouncementsHeader = () => {
  const { query, setQuery, orderBy, setOrderBy } = useContext(
    AnnouncementsDashboardContext
  )

  const debounced = useDebounceCallback(setQuery, 1000)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Link prefetch={false} href={'/dashboard/announcements/new'}>
          <Button className="flex flex-row gap-2">
            <FontAwesomeIcon icon={faPlus} /> Create new announcement
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-2 bg-background rounded p-5">
        <Input
          placeholder={'Search an announcement by title...'}
          defaultValue={query}
          onChange={(e) => debounced(e.currentTarget.value)}
        />
        <div className="flex flex-row gap-2">
          <Select defaultValue={orderBy} onValueChange={(e) => setOrderBy(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue className="bg-gray-400" placeholder="Order by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Order by</SelectLabel>
                <SelectItem value="created_at">Created at</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
