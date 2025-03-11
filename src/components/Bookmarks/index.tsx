import { Bookmark } from '@/services/server/series'
import BookmarkItem from './BookmarkItem'

export default function BookmarksList({
  bookmarks,
}: {
  bookmarks: Bookmark[]
}) {
  return (
    <div className="grid grid-cols-1 gap-3 mt-3">
      {bookmarks &&
        bookmarks.length > 0 &&
        bookmarks.map((bookmark) => (
          <BookmarkItem bookmark={bookmark} key={bookmark.id} />
        ))}
      {bookmarks && bookmarks.length == 0 && (
        <div className="col-span-full p-4">
          <p className="text-center text-foreground">No bookmarks yet!</p>
          <p className=" text-center text-muted-foreground">
            You can start bookmarking series accessing their pages and pressing
            the bookmark button!
          </p>
        </div>
      )}
    </div>
  )
}
