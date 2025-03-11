'use client'
import { Series } from '@/types'
import { useEffect, useMemo, useState, type HTMLProps } from "react"
import { useAutocomplete } from '@mui/material'
import useSWR from 'swr'
import { fetcher } from '@/services'
import { env } from '@/env'
import { Input } from '../ui/input'
import { Cross1Icon } from '@radix-ui/react-icons'


type SelectorProps = {
  defaultSeries: Series[],
  onValueChange?: (value: Series[]) => void
} & HTMLProps<HTMLDivElement>

export default function SeriesSelector({ defaultSeries, onValueChange, ...props }: SelectorProps) {
  const { data, isLoading, error } = useSWR(`${env.NEXT_PUBLIC_API_URL}/series/all`, fetcher)
  const [selectedSeries, setSelectedSeries] = useState<Series[]>(defaultSeries)
  useEffect(() => {
    if (onValueChange) {
      onValueChange(selectedSeries)
    }
  }, [selectedSeries])
  const series: Series[] = useMemo(() => {
    if (!data) return []
    return data
  }, [data])
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'series-selector',
    value: selectedSeries,
    multiple: true,
    options: series,
    isOptionEqualToValue: (option, value) => {
      if (option.id === value.id) return true
      else return false
    },
    getOptionLabel: (option) => option.title,
    getOptionKey: (option) => option.id,
    onChange: (event, value) => setSelectedSeries(value),
    autoComplete: true,
  })
  return (
    <div className='relative' {...props}>
      <div {...getRootProps()}>
        <div ref={setAnchorEl} className="bg-background p-4">
          <ul className="flex flex-row gap-2 flex-wrap">
            {value.map((option: Series, index: number) => {
              const { onDelete, key, ...props } = getTagProps({ index })
              return (
                <li
                  className="flex flex-row text-xxs p-2 bg-background rounded gap-x-3 items-center"
                  key={key}
                  {...props}
                >
                  <span>{option.title}</span>
                  <Cross1Icon onClick={onDelete} />
                </li>
              )
            })}
          </ul>
          <Input
            className="mt-2 placeholder:text-xxs"
            {...getInputProps()}
            placeholder={'Add a series...'}
          />
        </div>
      </div>
      {groupedOptions.length > 0 ? (
        <ul
          className="w-full absolute bg-muted overflow-auto max-h-[250px] z-50 rounded p-4"
          {...getListboxProps()}
        >
          {(groupedOptions as Series[]).map((option, index) => {

            return (
              <li
                {...getOptionProps({ option, index })}
                key={option.id}

                className={`py-[7px] px-[12px] flex gap-2 group aria-[selected='true']:font-semibold rounded hover:bg-muted-foreground/10 hover:cursor-pointer`}
              >
                <span key={option.id + 'selected'} className='group-aria-[selected=true]:flex hidden items-center p-1 bg-green-200 text-green-700 rounded text-[8px] font-bold'>SELECTED</span>
                <span key={option.id + 'title'} className="flex-grow grow-1">{option.title}</span>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}