import { useForm } from 'react-hook-form'
import z from 'zod'
import Editor from '@/components/Editor'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { SingleSeriesContext } from './Context'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Chapter } from '@/types'
import useSWR from 'swr'
import { fetcher } from '@/services'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import API from '@/services/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { tabAtom, uploadProgressAtom } from './ChapterManagement'
import { useAtom } from 'jotai'
const comic_chapter_schema = z.object({
  chapter_name: z.string(), //
  chapter_title: z.string(), //
  chapter: z.instanceof(File).optional(),
  chapter_thumbnail: z.instanceof(File).optional(),
  index: z.number(), //
  series_id: z.union([z.number(), z.string()]), //
  season_id: z.union([z.number(), z.string()]).nullable(),
  price: z
    .number()
    .nonnegative()
    .refine((v) => typeof v === 'number', {
      message: 'Price must be a number',
    }), //
  release_date: z.date().nullable(),
  chapters_to_be_freed: z.array(z.number()),
  chapter_type: z.enum(['Comic', 'Novel']), //
  use_discord_webhook: z.boolean()
})

type ComicChapter = z.infer<typeof comic_chapter_schema>

export const ComicChapterForm = () => {
  const { series } = useContext(SingleSeriesContext)
  const [progress, setProgress] = useAtom(uploadProgressAtom)
  const [tab, setTab] = useAtom(tabAtom)
  const { data: chapters } = useSWR<Chapter[]>(
    `/chapter/all?${new URLSearchParams({
      series_id: series.id.toString(),
    }).toString()}`,
    fetcher
  )

  const form = useForm<ComicChapter>({
    resolver: zodResolver(comic_chapter_schema),
    defaultValues: {
      chapter_name: '',
      chapter_title: '',
      index: 0,
      series_id: series.id,
      season_id: series.seasons.length > 0 ? series.seasons[0].id : null,
      price: 0,
      release_date: null,
      chapters_to_be_freed: [],
      chapter_type: 'Comic',
      use_discord_webhook: false
    },
  })

  async function onSubmit(data: ComicChapter) {
    setTab('progress')
    toast.promise(
      API.post('/chapter', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          setProgress(e.progress!)
        },
      }),
      {
        loading: 'Creating chapter...',
        success: 'Chapter created',
        error: 'Failed to create chapter',
      }
    )
  }

  return (
    <Form {...form}>
      <form
        className="space-y-8 p-4 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="chapter_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chapter name</FormLabel>
              <FormControl>
                <Input placeholder="Chapter XXX..." {...field} />
              </FormControl>
              <FormDescription>
                This is going to be the name of the chapter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chapter_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chapter title</FormLabel>
              <FormControl>
                <Input placeholder="The return of the hero..." {...field} />
              </FormControl>
              <FormDescription>
                This is going to be the title of the chapter.{' '}
                <strong>Optional</strong>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chapter index</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    onChange={(a) =>
                      form.setValue('index', parseFloat(a.currentTarget.value))
                    }
                  />
                </FormControl>
                <FormDescription>
                  This is going to be the index of the chapter, which is the
                  order.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chapter price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    onChange={(a) =>
                      form.setValue('price', parseInt(a.currentTarget.value))
                    }
                  />
                </FormControl>
                <FormDescription>
                  This is going to be the price of the chapter.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="use_discord_webhook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Use Discord Webhook?</FormLabel>
                <FormControl>
                  <Select onValueChange={value => field.onChange(value === 'true')} value={field.value ? 'true' : 'false'}>
                    <SelectTrigger>
                      {field.value ? 'Notify on Discord' : 'Do not notify'}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='true'>Notify on Discord</SelectItem>
                      <SelectItem value='false'>Do not notify</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Specify whether the webhook should be used or not.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="release_date"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 self-center">
                <FormLabel>Chapter file (.rar, .zip)</FormLabel>
                <Input
                  onChange={(event) => {
                    if (!event) return
                    form.setValue('chapter', event.target.files![0])
                  }}
                  type={'file'}
                />
                <FormDescription>
                  The file containing the images of the chapter.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chapters_to_be_freed"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 self-center">
                <FormLabel>Chapter thumbnail</FormLabel>
                <Input
                  onChange={(event) => {
                    if (!event) return
                    form.setValue('chapter_thumbnail', event.target.files![0])
                  }}
                  type={'file'}
                />
                <FormDescription>The chapter thumbnail image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
