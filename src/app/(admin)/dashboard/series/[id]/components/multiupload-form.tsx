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
import { useAtom } from 'jotai'
import { uploadProgressAtom, tabAtom } from './ChapterManagement'

const comic_chapter_schema = z.object({
  filename: z.string(),
  series_id: z.union([z.number(), z.string()]), //
})

type ComicChapter = z.infer<typeof comic_chapter_schema>

export const MultiuploadForm = () => {
  const { series } = useContext(SingleSeriesContext)
  const [progress, setProgress] = useAtom(uploadProgressAtom)
  const [tab, setTab] = useAtom(tabAtom)

  const form = useForm<ComicChapter>({
    resolver: zodResolver(comic_chapter_schema),
    defaultValues: {
      series_id: series.id,
      filename: ''
    },
  })

  async function onSubmit(data: ComicChapter) {
    setTab('progress')
    toast.promise(
      API.post('/api/multiupload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          setProgress(e.progress!)
        },
      }),
      {
        loading: 'Creating chapter...',
        success: 'Chapters were added to the uploader queue! Just wait!',
        error: 'Failed to multiupload! Contact the developer...',
      }
    )
  }

  return (
    <Form {...form}>
      <form
        className="space-y-8 p-4 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name='filename'
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 self-center">
                <FormLabel>Chapter filename (.rar, .zip)</FormLabel>
                <Input
                  {...field}
                />
                <FormDescription>
                  The filename of the file containing the images of the chapter.
                </FormDescription>
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
