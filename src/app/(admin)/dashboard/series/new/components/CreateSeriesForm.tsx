'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { createRef, useState } from 'react'
import { SingleSeriesContextType } from '../../[id]/components/Context'
import dynamic from 'next/dynamic'
import CircularProgress from '@mui/material/CircularProgress'
import API from '@/services/api'
import { useRouter } from 'next/navigation'

const seriesFormSchema = z.object({
  title: z.string(),
  author: z.string().nullable(),
  studio: z.string().nullable(),
  release_year: z.string(),
  alternative_names: z.string(),
  badge: z.string(),
  thumbnail: z.any().optional(),
})

export type SeriesFormValues = z.infer<typeof seriesFormSchema>

const INPUT_FORM_FIELDS = [
  {
    id: 'release_year',
    label: 'Release year',
    type: 'text',
  },
  {
    id: 'badge',
    label: 'Badge',
    type: 'text',
  },
  {
    id: 'author',
    label: 'Author',
    type: 'text',
  },
  {
    id: 'studio',
    label: 'Studio',
    type: 'text',
  },
  {
    id: 'alternative_names',
    label: 'Alternative names',
    type: 'text',
  },
  {
    id: 'thumbnail',
    label: 'Cover',
    type: 'file',
  },
]

const SELECT_FORM_FIELDS = [
  {
    id: 'status',
    label: 'Status',
    options: [
      {
        name: 'Ongoing',
        value: 'Ongoing',
      },
      {
        name: 'Completed',
        value: 'Completed',
      },
      {
        name: 'Dropped',
        value: 'Dropped',
      },
      {
        name: 'Hiatus',
        value: 'Hiatus',
      },
    ],
  },
  {
    id: 'visibility',
    label: 'Visibility',
    options: [
      {
        name: 'Public',
        value: 'Public',
      },
      {
        name: 'Private',
        value: 'Private',
      },
    ],
  },
  {
    id: 'series_type',
    label: 'Series Type',
    options: [
      {
        name: 'Comic',
        value: 'Comic',
      },
      {
        name: 'Novel',
        value: 'Novel',
      },
    ],
  },
]

const CreateSeriesForm = () => {
  const methods = useForm<SeriesFormValues>({
    resolver: zodResolver(seriesFormSchema),
    mode: 'onChange',
  })
  const router = useRouter()
  const formRef = createRef<HTMLFormElement>()
  const [text, setText] = useState<string>('aaa')
  const [type, setType] = useState<SingleSeriesContextType['type']>('Comic')
  const [status, setStatus] =
    useState<SingleSeriesContextType['status']>('Ongoing')
  const [visibility, setVisibility] =
    useState<SingleSeriesContextType['visibility']>('Public')
  const [adult, setAdult] = useState<SingleSeriesContextType['adult']>(false)

  async function onSubmit(data: SeriesFormValues) {
    const formData = new FormData(formRef.current!)
    formData.append('description', text)
    formData.append('series_type', type)
    formData.append('status', status)
    formData.append('visibility', visibility)
    formData.append('adult', adult.toString())

    toast.promise(API.post(`/series/create`, formData), {
      loading: 'Creating series...',
      success: () => {
        setTimeout(() => router.push('/dashboard/series'), 1000)
        return 'Series created successfully, redirecting...'
      },
      error: 'Failed to create series',
    })
  }

  return (
    <div className="p-4 bg-background text-foreground rounded shadow-md">
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          ref={formRef}
          className="space-y-4"
        >
          <FormField
            control={methods.control}
            name={'title'}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder={'Series title'}
                    className="text-foreground font-bold"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {INPUT_FORM_FIELDS.map((form_field) => (
            <FormField
              control={methods.control}
              key={form_field.id}
              name={form_field.id as keyof SeriesFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    {form_field.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={form_field.type}
                      placeholder={form_field.label}
                      className="text-foreground font-bold"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <div className="flex flex-row gap-2">
            <Select
              defaultValue={status}
              onValueChange={(e) =>
                setStatus(e as SingleSeriesContextType['status'])
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  className="bg-gray-400"
                  placeholder="Series Status"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Series Status</SelectLabel>
                  {SELECT_FORM_FIELDS[0].options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              defaultValue={visibility}
              onValueChange={(e) =>
                setVisibility(e as SingleSeriesContextType['visibility'])
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue className="bg-gray-400" placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Series type</SelectLabel>
                  {SELECT_FORM_FIELDS[1].options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              defaultValue={type}
              onValueChange={(e) =>
                setType(e as SingleSeriesContextType['type'])
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  className="bg-gray-400"
                  placeholder="Series type"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Series type</SelectLabel>
                  {SELECT_FORM_FIELDS[2].options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 text-muted-foreground ml-4">
              <Switch
                checked={adult}
                onCheckedChange={(e) => setAdult(e)}
                id="adult"
              />
              <Label htmlFor="adult">Adult series</Label>
            </div>
          </div>
          <Separator className="bg-gray-400" />
          <Button type="submit" className="bg-slate-900 dark:bg-slate-800">
            Create
          </Button>
        </form>
      </Form>
    </div>
  )
}
export default CreateSeriesForm
