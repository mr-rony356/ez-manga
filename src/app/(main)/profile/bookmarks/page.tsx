import BookmarksList from '@/components/Bookmarks'
import Header from '@/components/Header'
import { onlyLoggedIn } from '@/services/server'
import { getBookmarks } from '@/services/server/series'
import { Website_Name } from '@global'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bookmarks - ' + Website_Name,
}

export default async function BookmarksPage() {
  const bookmarks = await getBookmarks()

  return (
    <>
        <BookmarksList bookmarks={bookmarks} />
    </>
  )
}
