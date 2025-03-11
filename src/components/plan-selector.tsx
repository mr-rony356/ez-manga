"use client"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useMemo, useState, type HTMLProps } from "react"
import useSWR from "swr"
import { fetcher } from "@/services"
import { env } from "@/env"
import type { Series, SubscriptionPlan } from "@/types"


type SelectorProps = {
  onValueChange?: (value: any) => void
} & HTMLProps<HTMLDivElement>

export function PlanSelector({ onValueChange, ...props }: SelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { data, isLoading, error } = useSWR(`${env.NEXT_PUBLIC_API_URL}/store/plans`, fetcher)
  useEffect(() => {
    if (onValueChange) {
      onValueChange(value)
    }
  }, [value])


  const plans: SubscriptionPlan[] = useMemo(() => {
    if (!data) return []
    return data.data
  }, [data])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between w-full', props.className)}
        >
          {value
            ? plans.find((plan) => plan.id.toString() == value)?.name
            : "Select subscription plan..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search plan..." />
          <CommandList>
            <CommandEmpty>No plan found.</CommandEmpty>
            <CommandGroup>
              {plans.length > 0 && plans.map((plan) => (
                <CommandItem
                  key={plan.id}
                  value={plan.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === plan.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {plan.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
