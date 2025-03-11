'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Chapter } from '@/types'
import { fetcher } from '@/services'
import useSWR from 'swr'
import { SingleSeriesContext } from '@/app/(admin)/dashboard/series/[id]/components/Context'
import { useContext, useState } from 'react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useAtom, atom, useSetAtom, useAtomValue } from 'jotai'
import API from '@/services/api'
import { CircularProgress } from '@mui/material'
import { Toggle } from '@/components/ui/toggle'
import { NovelChapterForm } from './novel-chapter-upload-form'
import { ComicChapterForm } from './comic-chapter-upload-form'
import { ComicChapterEditForm } from './comic-chapter-edit-form'
import { NovelChapterEditForm } from './novel-chapter-edit-form'
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
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { MultiuploadForm } from './multiupload-form'
import UploadingProgress from './uploading-progress'

const ChaptersSelector = () => {
  const { series } = useContext(SingleSeriesContext)

  const { data: chapters } = useSWR<Chapter[]>(
    `/chapter/all?${new URLSearchParams({
      series_id: series.id.toString(),
    }).toString()}`,
    fetcher
  )

  async function deleteChapter(id: number) {
    await API.delete(`/chapter/`, {
      data: { id },
    })
    toast.success('Chapter successfully deleted!')
  }

  const setChapter = useSetAtom(chapterAtom)
  const setTab = useSetAtom(tabAtom)

  return (
    chapters &&
    chapters.map((chapter) => (
      <div key={chapter.id}>
        <div className="flex justify-between text-sm">
          <span>{chapter.chapter_name}</span>
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
                  <AlertDialogAction onClick={() => deleteChapter(chapter.id)}>
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
                const data = await API.get(`/chapter/${chapter.id}`)
                setChapter(data.data)
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

const chapterAtom = atom<Chapter | null>(null)
export const uploadProgressAtom = atom<number>(0)
export const tabAtom = atom<'upload' | 'edit' | 'none' | 'view' | 'loading' | 'progress'>('none')

export default function ChapterManagement() {
  const chapter = useAtomValue(chapterAtom)
  const [tab, setTab] = useAtom(tabAtom)

  const [chapter_type, setType] = useState<'Novel' | 'Comic' | 'Multiupload'>('Novel')

  return (
    <div className={'bg-background p-4 rounded grid grid-cols-12 gap-2'}>
      <ScrollArea className="h-72 rounded-md border col-span-full lg:col-span-4">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium text-muted-foreground leading-none">
            Chapters
          </h4>

          <div className={'flex flex-col items-center justify-center'}>
            <span
              className={'text-muted-foreground cursor-pointer'}
              onClick={() => setTab('upload')}
            >
              New chapter +
            </span>
            <Separator className="my-2" />
          </div>

          <ChaptersSelector />
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
                <div className="flex flex-row gap-2">
                  <Toggle
                    value={'Comic'}
                    pressed={chapter_type === 'Comic'}
                    onPressedChange={(v) => setType(v ? 'Comic' : 'Novel')}
                  >
                    Comic
                  </Toggle>
                  <Toggle
                    value={'Novel'}
                    pressed={chapter_type === 'Novel'}
                    onPressedChange={(v) => setType(v ? 'Novel' : 'Comic')}
                  >
                    Novel
                  </Toggle>
                  <Toggle
                    value={'Multiupload'}
                    pressed={chapter_type === 'Multiupload'}
                    onPressedChange={(v) => setType(v ? 'Multiupload' : 'Comic')}
                  >
                    Multiupload
                  </Toggle>
                </div>
                <Separator />
                {chapter_type === 'Novel' ? (
                  <NovelChapterForm />
                ) : chapter_type === 'Multiupload' ? (<MultiuploadForm />) : (
                  <ComicChapterForm />
                )}
              </div>
            </TabsContent>
            <TabsContent value={'edit'}>
              {chapter &&
                (chapter.chapter_type === 'Comic' ? (
                  <ComicChapterEditForm defaultValues={chapter} />
                ) : (
                  <NovelChapterEditForm defaultValues={chapter} />
                ))}
            </TabsContent>
            <TabsContent value={'view'}>
              {chapter && chapter.chapter_content && (
                <div
                  dangerouslySetInnerHTML={{ __html: chapter.chapter_content }}
                ></div>
              )}
            </TabsContent>
            <TabsContent value="loading">
              <div className="flex flex-col items-center justify-center">
                <CircularProgress />
              </div>
            </TabsContent>
            <TabsContent value="progress">
              <UploadingProgress />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  )
}
