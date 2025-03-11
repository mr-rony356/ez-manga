import { AnnouncementComments } from '@/components/Disqus'
import { get_time_diff } from '@/components/Series/helpers'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getAnnouncement } from '@/services/server/series'
import { Website_Name } from '@global'
import { Metadata } from 'next'

type AnnouncementPageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params: { slug },
}: AnnouncementPageProps): Promise<Metadata> {
  const post = await getAnnouncement(slug)
  return {
    title: `${post.title} - ${Website_Name}`,
  }
}

const AnnouncementPage = async ({
  params: { slug },
}: AnnouncementPageProps) => {
  const post = await getAnnouncement(slug)

  return (
    <div className="min-h-screen container px-5 lg:px-0 flex flex-col gap-3">
      <div className="flex flex-col items-start gap-2">
        <div className="p-4 rounded bg-background text-muted-foreground flex flex-col gap-2 items-start justify-start">
          <h1 className="text-3xl lg:text-5xl font-bold text-foreground">
            {post.title}
          </h1>
          <div className="flex flex-row self-start gap-2 items-start justify-center p-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author.profile_picture} />
              <AvatarFallback>{post.author.username}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 justify-start">
                <span className="text-foreground text-xs font-medium">
                  {post.author.username}
                </span>
                <span className="bg-[#E1F0DA] text-[#99BC85] text-[10px] font-bold text-muted-foreground px-2 py-1 rounded w-fit uppercase">
                  {post.author.role}
                </span>
              </div>
              <span className="text-muted-foreground font-bold text-xxs">
                {get_time_diff(post.created_at)}
              </span>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>
      </div>
      <AnnouncementComments post={post} />
    </div>
  )
}
export default AnnouncementPage
