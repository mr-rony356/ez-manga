'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { fetcher } from '@/services'
import { Rating as Review } from '@/types'
import Rating from '@mui/material/Rating'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { get_time_diff } from '../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import API from '@/services/api'
import { toast } from 'sonner'
import useAuthentication from '@/hooks/useAuth'
import parse from 'html-react-parser'

export default function ReviewsList() {
  const params = useParams()

  const { data } = useAuthentication()

  const {
    data: reviews,
    error,
    isLoading,
  } = useSWR<Review[]>(`/reviews/${params.series!}`, fetcher)

  if (isLoading) {
    return <p>Loading...</p>
  }

  async function upvote(id: string | number) {
    toast.promise(API.get(`/rate/upvote/${id}`), {
      loading: 'Upvoting...',
      success: 'Upvoted!',
      error: 'Error upvoting...',
    })
  }

  async function downvote(id: string | number) {
    toast.promise(API.get(`/rate/downvote/${id}`), {
      loading: 'Downvoting...',
      success: 'Downvoted!',
      error: 'Error downvoting...',
    })
  }

  return (
    <ul className="flex flex-col gap-2 bg-background rounded p-5">
      {reviews &&
        reviews.length > 0 &&
        reviews.map((review) => (
          <li
            key={review.id}
            className="bg-muted p-4 flex flex-col lg:flex-row gap-4 rounded"
          >
            <div className="flex flex-col gap-2 items-center justify-center"></div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.user.profile_picture} />
                  <AvatarFallback>{review.user.username}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-2">
                    <span className="text-foreground font-bold">
                      {review.user.username}
                    </span>
                    <span className="bg-[#E1F0DA] dark:bg-[#212d1c] text-[#99BC85] text-[10px] font-bold text-foreground-100 px-2 py-1 rounded uppercase">
                      {review.user.role}
                    </span>
                  </div>
                  <div className="flex flex-row gap-2 text-xxs">
                    <Rating value={review.grade} readOnly size={'small'} />
                    <span className="font-medium text-muted-foreground">
                      {get_time_diff(review.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-background p-4 rounded text-wrap">
                <p
                  className="text-muted-foreground overflow-hidden"
                  style={{ wordBreak: 'break-word' }}
                >
                  {review.review}
                </p>
              </div>
              {data && data.isLoggedIn && (
                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => upvote(review.id)}
                    className="rounded bg-background text-foreground px-4 py-2 flex flex-row gap-x-2 items-center"
                  >
                    <FontAwesomeIcon color="#99BC85" icon={faThumbsUp} /> Upvote
                    ({review.upvotes.length})
                  </button>
                  <button
                    onClick={() => downvote(review.id)}
                    className="rounded bg-background text-foreground px-4 py-2 flex flex-row gap-x-2 items-center"
                  >
                    <FontAwesomeIcon color="#ff8080" icon={faThumbsDown} />
                    Downvote ({review.downvotes.length})
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      {reviews && reviews.length == 0 && (
        <span className="text-muted-foreground font-bold">
          There are no reviews yet.
        </span>
      )}
    </ul>
  )
}
