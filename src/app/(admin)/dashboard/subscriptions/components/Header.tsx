'use client'
import { Input } from '@/components/ui/input'
import { LogsDashboardContext, LogsDashboardContextType } from './Context'
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
import { format } from 'date-fns'
import { CalendarIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const SubscriptionsHeader = () => {
  const { query, setQuery, orderBy, setOrderBy, to, setTo, from, setFrom } =
    useContext(LogsDashboardContext)

  const debounced = useDebounceCallback(setQuery, 1000)

  return (
    <div className="flex flex-col gap-2 bg-background rounded p-5">
      <Input
        placeholder={'Search a user by name, e-mail, etc...'}
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
              <SelectItem value="email">E-mail</SelectItem>
              <SelectItem value="role">Role</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal text-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {from ? format(from, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={from}
              onSelect={(e) => setFrom(e || new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal text-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {to ? format(to, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={to}
              onSelect={(e) => setTo(e || new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
export default SubscriptionsHeader
