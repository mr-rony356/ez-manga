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
import { toast } from 'sonner'
import API from '@/services/api'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import useAuthentication from '@/hooks/useAuth'

const notice_schema = z.object({
  title: z.string(), //
  content: z.string(), //
  author_id: z.union([z.number(), z.string()]),
  series_id: z.union([z.number(), z.string()]),
  is_pinned: z.boolean(),
})

type Notice = z.infer<typeof notice_schema>

export const NoticeUploadForm = () => {
  const { series } = useContext(SingleSeriesContext)

  const { data } = useAuthentication()

  const form = useForm<Notice>({
    resolver: zodResolver(notice_schema),
    defaultValues: {
      title: '',
      content: '',
      author_id: data?.user.id || 1,
      series_id: series.id,
      is_pinned: false,
    },
  })
  async function onSubmit(data: Notice) {
    toast.promise(API.post('/notices', data), {
      loading: 'Uploading notice...',
      success: 'Notice uploaded!',
      error: 'Failed to upload notice!',
    })
  }

  return (
    <>
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
          <Editor onChange={(content) => form.setValue('content', content)} />
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
                    Is the series pinned to all chapters?{' '}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  )
}
