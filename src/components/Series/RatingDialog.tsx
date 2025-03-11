'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Rating } from '@mui/material'
import { useState } from 'react'
import API from '@/services/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function RatingDialog({ series_id }: { series_id: number | string }) {
  const [open, setOpen] = useState<boolean>(false)
  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState<string>('')

  const router = useRouter()

  async function rate_series() {
    if (review.length < 150) {
      toast.error('Your review must be at least 150 characters long.')
      return
    }
    toast.promise(API.post('/rate', { series_id, rating, review }), {
      error: 'There was an error while uploading your review...',
      loading: 'Uploading your review...',
      success: () => {
        setOpen(false)
        setTimeout(() => router.refresh(), 1000)
        return 'Your review has been uploaded successfully!'
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button className="w-full">Rate this series</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-0 bg-white dark:bg-neutral-950 text-foreground">
        <DialogHeader>
          <DialogTitle>Rate this series</DialogTitle>
          <DialogDescription>
            Please, give us a review so we can know what you think.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Label>Rating</Label>
            <Rating
              max={5}
              size={'large'}
              value={rating}
              onChange={(event, value) => setRating(value || 5)}
            />
          </div>
          <Textarea
            placeholder="Type your message here."
            value={review}
            onChange={(e) => setReview(e.currentTarget.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={rate_series} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
