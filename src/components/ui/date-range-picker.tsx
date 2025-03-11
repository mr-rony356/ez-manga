import React, { useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { type DateRange } from 'react-day-picker'

interface DateRangePickerProps {
  dateRange: {
    from: Date
    to: Date
  }
  onDateRangeChange: (range: { from: Date; to: Date }) => void
}

export default function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(dateRange.from, "LLL dd, y")} -{" "}
            {format(dateRange.to, "LLL dd, y")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{
              from: dateRange.from,
              to: dateRange.to
            }}
            onSelect={(selectedRange: DateRange | undefined) => {
              if (selectedRange?.from && selectedRange?.to) {
                onDateRangeChange({
                  from: selectedRange.from,
                  to: selectedRange.to
                })
                setOpen(false)
              }
            }}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}