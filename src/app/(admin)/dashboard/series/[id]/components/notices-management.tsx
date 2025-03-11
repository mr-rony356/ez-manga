'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Series, User } from '@/types'
import { fetcher } from '@/services'
import useSWR from 'swr'
import { SingleSeriesContext } from '@/app/(admin)/dashboard/series/[id]/components/Context'
import { useContext } from 'react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useAtom, atom, useSetAtom, useAtomValue } from 'jotai'
import API from '@/services/api'
import { CircularProgress } from '@mui/material'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { NoticeEditForm } from './notice-edit-form'
import { NoticeUploadForm } from './notices-upload-form'

type Notice = {
  id: number
  title: string
  content: string
  author_id: number | string | null
  is_pinned: boolean
  created_at: string
  updated_at: string
}

const NoticesSelector = () => {
  const { series } = useContext(SingleSeriesContext)

  const { data: notices } = useSWR<Notice[]>(
    `/series/${series.id}/notices`,
    fetcher
  )

  async function delete_notice(id: number) {
    await API.delete(`/notices/${id}`)
    toast.success('Chapter successfully deleted!')
  }

  const setNotice = useSetAtom(noticeAtom)
  const setTab = useSetAtom(tabAtom)

  return (
    notices &&
    notices.map((notice) => (
      <div key={notice.id}>
        <div className="flex justify-between text-sm">
          <span>{notice.title}</span>
          <div className={'flex flex-row gap-2 items-center'}>
            <AlertDialog>
              <AlertDialogTrigger>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-square-x hover:text-red-700 cursor-pointer transition-all ease-in-out"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the chapter and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => delete_notice(notice.id)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-square-pen hover:text-amber-600 cursor-pointer transition-all ease-in-out"
              onClick={async () => {
                setTab('loading')
                const data = await API.get(`/notices/${notice.id}`)
                setNotice(data.data)
                setTab('edit')
              }}
            >
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
          </div>
        </div>
        <Separator className="my-2" />
      </div>
    ))
  )
}

const noticeAtom = atom<Notice | null>(null)
const tabAtom = atom<'upload' | 'edit' | 'none' | 'view' | 'loading'>('none')

export default function NoticesManagement() {
  const notice = useAtomValue(noticeAtom)
  const [tab, setTab] = useAtom(tabAtom)

  return (
    <div className={'bg-background p-4 rounded grid grid-cols-12 gap-2'}>
      <ScrollArea className="h-72 rounded-md border col-span-full lg:col-span-4">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium text-muted-foreground leading-none">
            Notices
          </h4>
          <div className={'flex flex-col items-center justify-center'}>
            <span
              className={'text-muted-foreground cursor-pointer'}
              onClick={() => setTab('upload')}
            >
              New notice +
            </span>
            <Separator className="my-2" />
          </div>
          <NoticesSelector />
        </div>
      </ScrollArea>
      <div className="col-span-full lg:col-span-8">
        <ScrollArea className="h-full rounded-md p-4 border col-span-full lg:col-span-4">
          <Tabs value={tab}>
            <TabsContent value="none">
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-muted-foreground">
                  Select an option to view content.
                </span>
              </div>
            </TabsContent>
            <TabsContent value={'upload'}>
              <div className="flex flex-col justify-center gap-2 items-center">
                <NoticeUploadForm />
              </div>
            </TabsContent>
            <TabsContent value={'edit'}>
              {notice && <NoticeEditForm defaultValues={notice} />}
            </TabsContent>
            <TabsContent value={'view'}></TabsContent>
            <TabsContent value="loading">
              <div className="flex flex-col items-center justify-center">
                <CircularProgress />
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  )
}
