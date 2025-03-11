'use client'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { fetcher } from '@/services'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import API from '@/services/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import TextEditor from '@/components/Editor'

export const AnnouncementCreateBody = () => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const router = useRouter()

  const createAnnouncement = async () => {
    try {
      await API.post('/announcements', { title, content })
      toast.success('Announcement created successfully')
      router.push('/dashboard/announcements')
    } catch (error) {
      toast.error('Failed to create announcement')
    }
  }

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-12 lg:col-span-10">
        <div className="flex flex-col gap-2">
          <Input
            className="bg-background"
            value={title}
            placeholder={'Announcement title'}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <TextEditor onChange={setContent} />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-2">
        <div className="flex flex-col gap-2 p-4 rounded bg-background">
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => createAnnouncement()}
              className="bg-blue-400 hover:bg-blue-700"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
