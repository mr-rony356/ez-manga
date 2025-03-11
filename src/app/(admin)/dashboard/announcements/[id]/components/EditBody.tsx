'use client'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { fetcher } from '@/services'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import API from '@/services/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { clear_cache } from '@/lib/actions'
import TextEditor from '@/components/Editor'

export const AnnouncementEditBody = () => {
  const { id } = useParams()
  const { data, error, isLoading } = useSWR(`/announcements/${id}`, fetcher)
  const router = useRouter()
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  useEffect(() => {
    if (data) {
      setTitle(data.title)
      setContent(data.content)
    }
  }, [data])

  async function updateAnnouncement() {
    toast.promise(
      API.post(`/announcements/${id}`, {
        title,
        content,
      }),
      {
        loading: 'Updating...',
        success: 'Announcement updated successfully!',
        error: 'Error updating announcement',
      }
    )
    await clear_cache(`announcement-${data.slug}`)
  }

  async function deleteAnnouncement() {
    toast.promise(API.delete(`/announcements/${id}`), {
      loading: 'Deleting...',
      success: 'Announcement deleted successfully!',
      error: 'Error deleting announcement!',
    })
    router.push('/dashboard/announcements')
  }

  if (!isLoading) {
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
            {content !== '' && (
              <TextEditor initialValue={content} onChange={setContent} />
            )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-2">
          <div className="flex flex-col gap-2">
            <Button onClick={() => updateAnnouncement()}>Save</Button>
            <Button onClick={() => deleteAnnouncement()}>Delete</Button>
          </div>
        </div>
      </div>
    )
  }

  return <div className="container min-h-screen p-4 bg-background"></div>
}
