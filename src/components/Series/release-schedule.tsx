'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ReleaseSchedule as ReleaseScheduleType, WeekDays } from '@/types'

export const ReleaseSchedule = ({
  schedule,
}: {
  schedule: ReleaseScheduleType
}) => {
  function getArrayFromObject(obj: Record<WeekDays, boolean>) {
    return Object.keys(obj).filter((key) => obj[key as WeekDays]) as WeekDays[]
  }

  return (
    <ToggleGroup type="multiple" value={getArrayFromObject(schedule)}>
      <ToggleGroupItem
        className="data-[state=on]:bg-[#99BC85] data-[state=on]:text-primary data-[state=off]:bg-[#ff8080]"
        value={'sun'}
      >
        S
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state=on]:bg-[#99BC85] data-[state=on]:text-primary data-[state=off]:bg-[#ff8080]"
        value={'mon'}
      >
        M
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state=on]:bg-[#99BC85] data-[state=on]:text-primary data-[state=off]:bg-[#ff8080]"
        value={'tue'}
      >
        T
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state=on]:bg-[#99BC85] data-[state=on]:text-primary data-[state=off]:bg-[#ff8080]"
        value={'wed'}
      >
        W
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state=on]:bg-[#99BC85] data-[state=on]:text-primary data-[state=off]:bg-[#ff8080]"
        value={'thu'}
      >
        T
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state=on]:bg-[#99BC85] data-[state=on]:text-primary data-[state=off]:bg-[#ff8080]"
        value={'fri'}
      >
        F
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state=on]:bg-[#99BC85] data-[state=on]:text-primary data-[state=off]:bg-[#ff8080]"
        value={'sat'}
      >
        S
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
