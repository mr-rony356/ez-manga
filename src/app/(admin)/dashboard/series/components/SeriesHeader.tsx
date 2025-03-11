'use client'
import { Input } from '@/components/ui/input'
import { SeriesDashboardContext } from './Context'
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
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const SeriesHeader = () => {
  const { query, setQuery, orderBy, setOrderBy, series_type, setType } =
    useContext(SeriesDashboardContext)

  const debounced = useDebounceCallback(setQuery, 1000)

  return (
    <div className="flex flex-col gap-2">

      <div className="flex flex-col gap-2 bg-background rounded p-5">
        <Input
          placeholder={'Search a series by title...'}
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
                <SelectItem value="latest">Updated at</SelectItem>
                <SelectItem value="total_views">Views</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            defaultValue={series_type}
            onValueChange={(e: 'Comic' | 'Novel' | 'All') => setType(e)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue className="bg-gray-400" placeholder="Series type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Series type</SelectLabel>
                <SelectItem value="Comic">Comic</SelectItem>
                <SelectItem value="Novel">Novel</SelectItem>
                <SelectItem value="All">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
export default SeriesHeader
