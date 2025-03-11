'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import API from '@/services/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import z from 'zod'
import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CreateProductFormValues } from './CreateBody'
import SeriesAPI from '@/services/v2/series'
import { useAtomValue } from 'jotai'
import { seriesAtom } from './CreateBody'
import SeriesSelector from "@/components/Series/series-selector";
export default function CreatePlanBody() {
  const form = useFormContext<CreateProductFormValues>()
  const series = useAtomValue(seriesAtom)


  return (
    <div className="flex flex-col gap-2">
      <FormField
        control={form.control}
        name="plan.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subscription Plan Name</FormLabel>
            <FormControl>
              <Input placeholder="Example..." {...field} />
            </FormControl>
            <FormDescription>
              This will be the public display name of the subscription plan.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="plan.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subscription Plan Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormDescription>
              This will be the description of the subscription plan.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="plan.status"
        render={({ }) => (
          <FormItem>
            <FormLabel>Plan status</FormLabel>
            <FormControl>
              <Select
                onValueChange={(e) =>
                  form.setValue(
                    'plan.status',
                    e as 'ACTIVE' | 'INACTIVE' | 'CREATED'
                  )
                }
              >
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="CREATED">Created</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <SeriesSelector defaultSeries={[]} />
    </div>
  )
}
