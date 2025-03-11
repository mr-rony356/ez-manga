'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ReleaseSchedule as ReleaseScheduleType } from '@/types'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect, useState } from 'react'

type WeekDays = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export const ReleaseSchedule = ({}: {}) => {
  const form = useFormContext()

  function getArrayFromObject(obj: Record<WeekDays, boolean>) {
    return Object.keys(obj).filter((key) => obj[key as WeekDays]) as WeekDays[]
  }

  function getObjectFromArray(arr: WeekDays[]) {
    return arr.reduce((acc, cur) => {
      acc[cur] = true
      return acc
    }, {} as Record<WeekDays, boolean>)
  }

  const [schedule, set_schedule] = useState<WeekDays[]>(
    form.getValues('release_schedule' as any)
      ? getArrayFromObject(form.getValues('release_schedule'))
      : []
  )

  return (
    <>
      <FormField
        control={form.control}
        name="release_schedule"
        render={({ field }) => (
          <ToggleGroup
            type="multiple"
            defaultValue={
              field.value
                ? getArrayFromObject(field.value as Record<WeekDays, boolean>)
                : []
            }
            onValueChange={(value) => {
              form.setValue(
                'release_schedule',
                getObjectFromArray(value as WeekDays[])
              )
            }}
          >
            <ToggleGroupItem
              className="data-[state=on]:bg-green-600 data-[state=on]:text-primary data-[state=off]:bg-red-600"
              value={'sun'}
            >
              Sunday
            </ToggleGroupItem>
            <ToggleGroupItem
              className="data-[state=on]:bg-green-600 data-[state=on]:text-primary data-[state=off]:bg-red-600"
              value={'mon'}
            >
              Monday
            </ToggleGroupItem>
            <ToggleGroupItem
              className="data-[state=on]:bg-green-600 data-[state=on]:text-primary data-[state=off]:bg-red-600"
              value={'tue'}
            >
              Tuesday
            </ToggleGroupItem>
            <ToggleGroupItem
              className="data-[state=on]:bg-green-600 data-[state=on]:text-primary data-[state=off]:bg-red-600"
              value={'wed'}
            >
              Wednesday
            </ToggleGroupItem>
            <ToggleGroupItem
              className="data-[state=on]:bg-green-600 data-[state=on]:text-primary data-[state=off]:bg-red-600"
              value={'thu'}
            >
              Thursday
            </ToggleGroupItem>
            <ToggleGroupItem
              className="data-[state=on]:bg-green-600 data-[state=on]:text-primary data-[state=off]:bg-red-600"
              value={'fri'}
            >
              Friday
            </ToggleGroupItem>
            <ToggleGroupItem
              className="data-[state=on]:bg-green-600 data-[state=on]:text-primary data-[state=off]:bg-red-600"
              value={'sat'}
            >
              Saturday
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      />
    </>
  )
}
