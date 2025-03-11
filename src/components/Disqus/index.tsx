'use client'
import { DiscussionEmbed } from 'disqus-react'
import { Website_URL, DisqusShortname } from '@global'
import { Chapter, User } from '@/types'

type disqusPost = {
  id: string
  title: string
  series_slug: string
}

type disqusProps = {
  post: disqusPost
}

const SeriesComments = ({ post }: disqusProps) => {
  const disqusConfig = {
    url: `${Website_URL}/series/${post.series_slug}`,
    identifier: `#${post.id}`, // Single post id
    title: post.title, // Single post title
  }
  return (
    <div className="m-5">
      <DiscussionEmbed shortname={DisqusShortname} config={disqusConfig} />
    </div>
  )
}

const AnnouncementComments = ({
  post,
}: {
  post: {
    id: string
    title: string
    slug: string
    content: string
    created_at: string
    author: User
  }
}) => {
  const disqusConfig = {
    url: `${Website_URL}/announcements/${post.slug}`,
    identifier: `#announcement-${post.id}`, // Single post id
    title: post.title, // Single post title
  }
  return (
    <div className="m-5">
      <DiscussionEmbed shortname={DisqusShortname} config={disqusConfig} />
    </div>
  )
}

type ChapterProps = {
  series: disqusPost
  chapter: Chapter
}

const ChapterComments = ({ series, chapter }: ChapterProps) => {
  const disqusConfig = {
    url: `${Website_URL}/series/${series.series_slug}/${chapter.chapter_slug}`,
    identifier: `#${series.id}-${chapter.id}`,
    title: `${series.title} - ${chapter.chapter_name}`, // Single post title
  }
  return (
    <div className="container mx-auto m-5 text-gray-50">
      <DiscussionEmbed shortname={DisqusShortname} config={disqusConfig} />
    </div>
  )
}

export { SeriesComments, ChapterComments, AnnouncementComments }
