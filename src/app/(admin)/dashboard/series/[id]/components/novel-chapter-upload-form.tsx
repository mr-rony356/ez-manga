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
const novel_chapter_schema = z.object({
  chapter_name: z.string(), //
  chapter_title: z.string(), //
  chapter_content: z.string(), //
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
})

type NovelChapter = z.infer<typeof novel_chapter_schema>

export const NovelChapterForm = () => {
  const { series } = useContext(SingleSeriesContext)
  const { data: chapters } = useSWR<Chapter[]>(
    `/chapter/all?${new URLSearchParams({
      series_id: series.id.toString(),
    }).toString()}`,
    fetcher
  )

  const form = useForm<NovelChapter>({
    resolver: zodResolver(novel_chapter_schema),
    defaultValues: {
      chapter_name: '',
      chapter_title: '',
      chapter_content: '',
      index: 0,
      series_id: series.id,
      season_id: series.seasons.length > 0 ? series.seasons[0].id : null,
      price: 0,
      release_date: null,
      chapters_to_be_freed: [],
      chapter_type: 'Novel',
    },
  })

  async function onSubmit(data: NovelChapter) {
    toast.promise(
      API.post('/chapter', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
            name="season_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Season</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger>
                      {series.seasons.find((s) => s.id === field.value)
                        ?.season_name ?? 'Select a season'}
                    </SelectTrigger>
                    <SelectContent>
                      {series.seasons.map((season) => (
                        <SelectItem
                          key={season.id}
                          value={season.id.toString()}
                          onClick={() => form.setValue('season_id', season.id)}
                        >
                          {season.season_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This is going to be the season.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Editor
          onChange={(content) => form.setValue('chapter_content', content)}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="release_date"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 self-center">
                <FormLabel>Release date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? new Date()}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The release date set for this chapter
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
                <FormLabel>Chapters to free</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left justify-start font-normal text-muted-foreground'
                        )}
                      >
                        <span>Pick the chapters</span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ScrollArea className="h-72 rounded-md border">
                      <div className="p-4 flex flex-col gap-2">
                        {chapters &&
                          chapters.map((chapter) => {
                            function handleCheck(value: boolean | string) {
                              if (value === true) {
                                form.setValue('chapters_to_be_freed', [
                                  ...field.value,
                                  chapter.id,
                                ])
                              } else {
                                form.setValue(
                                  'chapters_to_be_freed',
                                  field.value.filter(
                                    (chapter_id) => chapter_id !== chapter.id
                                  )
                                )
                              }
                            }
                            return (
                              <div
                                key={chapter.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${chapter.id}`}
                                  className="rounded-sm"
                                  onCheckedChange={(value) =>
                                    handleCheck(value)
                                  }
                                  checked={field.value.includes(chapter.id)}
                                />
                                <label
                                  htmlFor={`${chapter.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {chapter.chapter_name}
                                </label>
                              </div>
                            )
                          })}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <FormDescription>Chapters to set free.</FormDescription>
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
