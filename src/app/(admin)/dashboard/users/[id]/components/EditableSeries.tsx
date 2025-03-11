'use client'
import { EditableSeries } from '@/types'
import { useAutocomplete } from '@mui/material'
import { Cross1Icon } from '@radix-ui/react-icons'
import { useContext, useEffect, useState } from 'react'
import { syncEditableSeries } from '@/services/users'
import { SingleUserContext } from './Context'
import { Input } from '@/components/ui/input'

const UserEditableSeries = ({ series }: { series: EditableSeries[] }) => {
  const { user } = useContext(SingleUserContext)

  const [series_ids, setSeries] = useState<number[]>(
    user.editable_series.map((series) => series.id)
  )

  useEffect(() => {
    const Update = async () => {
      await syncEditableSeries(user.id, series_ids)
    }

    Update()
  }, [series_ids, user.id])

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
    id: 'editable-series-hook',
    defaultValue: [...user.editable_series],
    multiple: true,
    options: series,
    isOptionEqualToValue: (option, value) => {
      if (option.id === value.id) return true
      else return false
    },
    getOptionLabel: (option) => option.title,
    autoComplete: true,
    onChange: (event, value) => handleValue(value),
  })

  const handleValue = (value: EditableSeries[]) => {
    const only_ids = value.map((value) => value.id)
    setSeries(only_ids)
  }

  return (
    <div className="rounded bg-background p-4 flex flex-col gap-4">
      <h1 className="font-bold text-muted-foreground">{`User's series`}</h1>
      <div className="text-foreground relative text-md">
        <div {...getRootProps()}>
          <div ref={setAnchorEl} className="bg-background p-4">
            <ul className="flex flex-row gap-2 flex-wrap">
              {value.map((option: EditableSeries, index: number) => {
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
              className="mt-2"
              {...getInputProps()}
              placeholder={'Add a series...'}
            />
          </div>
        </div>
        {groupedOptions.length > 0 ? (
          <ul
            className="w-full absolute bg-[rgb(20,20,20)] overflow-auto max-h-[250px] rounded shadow-[rgba(0,0,0,0.15)_0px_2px_8px] z-[1] mx-auto my-0 p-0 inset-x-0"
            {...getListboxProps()}
          >
            {(groupedOptions as EditableSeries[]).map((option, index) => (
              <li
                {...getOptionProps({ option, index })}
                key={option.title}
                className={`py-[7px] px-[12px] flex aria-[selected='true']:font-semibold aria-[selected='true']:bg-[#2b2b2b] hover:bg-[#003b57] hover:cursor-pointer`}
              >
                <span className="flex-grow grow-1">{option.title}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default UserEditableSeries
