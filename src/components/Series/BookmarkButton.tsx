"use client";
import useSWR from "swr";
import { bookmarkSeries, fetcher, updateSeriesViews } from "@/services";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type BookmarkButtonData = {
  hasBookmarked: boolean;
  series_slug: string;
};

const BookmarkButton = ({
  data: { hasBookmarked, series_slug },
}: {
  data: BookmarkButtonData;
}) => {
  const router = useRouter();

  async function bookmark() {
    toast.promise(bookmarkSeries(series_slug), {
      loading: hasBookmarked
        ? `We're removing this series from your bookmarks...`
        : `We're adding this series to your bookmarks!`,
      error:
        "There was an error while adding the series to your bookmarks, try again later...",
      success: hasBookmarked
        ? `We're removed this series from your bookmarks!`
        : `Successfully added this series to your bookmarks!`,
    });

    router.refresh();
  }

  useEffect(() => {
    (async () => {
      await updateSeriesViews(series_slug);
    })();
  }, []);

  return (
    <>
      {hasBookmarked && (
        <Button
          onClick={() => bookmark()}
          variant={"secondary"}
          className="w-full"
        >
          Unbookmark
        </Button>
      )}
      {!hasBookmarked && (
        <Button
          onClick={() => bookmark()}
          variant={"secondary"}
          className="w-full"
        >
          Bookmark
        </Button>
      )}
    </>
  );
};

export default BookmarkButton;
