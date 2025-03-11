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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const notice_schema = z.object({
  id: z.number(),
  title: z.string(), //
  content: z.string(), //
  author_id: z.union([z.number(), z.string()]).nullable(),
  is_pinned: z.boolean(),
})

type Notice = z.infer<typeof notice_schema>

export const NoticeEditForm = ({
  defaultValues,
}: {
  defaultValues: Notice
}) => {
  const { series } = useContext(SingleSeriesContext)
  const form = useForm<Notice>({
    resolver: zodResolver(notice_schema),
    defaultValues: notice_schema.parse(defaultValues),
  })
  async function onSubmit(data: Notice) {
    toast.promise(
      API.put('/notices/' + defaultValues.id, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      {
        loading: 'Updating notice...',
        success: 'Notice updated',
        error: 'Failed to update notice',
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Notice's title" {...field} />
              </FormControl>
              <FormDescription>
                This is going to be the title of the notice.{' '}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Editor
          initialValue={defaultValues.content}
          onChange={(content) => form.setValue('content', content)}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name={'is_pinned'}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-row items-center gap-2">
                    <Label htmlFor={'is_pinned'}>Is pinned?</Label>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        form.setValue('is_pinned', checked)
                      }
                      id="is_pinned"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Is the notice pinned to all chapters?{' '}
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
