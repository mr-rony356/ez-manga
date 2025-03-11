"use client";
import { useContext, useState } from "react";
import { ComicsContext } from "@/app/(main)/Context";
import { SeriesItem } from "@/components/Series";
import { Series } from "@/types";
import { Website_API } from "@global";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { FireIcon } from "@heroicons/react/24/outline";

export const Comics = () => {
  const { page, setPage, comics, setComics } = useContext(ComicsContext);

  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function getMoreSeries() {
    setPage(page + 1);
    setLoading(true);
    const response = (
      await (
        await fetch(
          `${Website_API}/query?${new URLSearchParams({
            series_type: "Comic",
            perPage: "12",
            adult: "true",
            order: "desc",
            orderBy: "latest",
            page: (page + 1).toString(),
          }).toString()}`,
          {
            next: {
              tags: ["home"],
            },
          }
        )
      ).json()
    )

    const new_comics: Series[] = response.data;


    if (response.meta.last_page === response.meta.current_page) {
      setHasMore(false);
    }

    setComics([...comics, ...new_comics]);
    setLoading(false);
  }

  return (
    <>
      <div className="col-span-12 bg-gray-850 rounded space-y-2 container px-5 lg:px-0">
        <div className="flex flex-row items-center gap-4 relative">
          <h1 className="text-xl shrink-0 lg:text-3xl text-left font-bold leading-tight text-foreground tracking-tighter md:text-6xl lg:leading-[1.1]">
            {" "}
            <Icons.fire className='text-yellow-200 inline w-12 h-12 mr-2' />
            Latest updates
          </h1>
          <Separator orientation="horizontal" />

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3">
          {comics &&
            comics.length > 0 &&
            comics.map((chapter, index) => (
              <SeriesItem series={chapter} key={index} />
            ))}
        </div>
        <Button disabled={!hasMore} onClick={getMoreSeries} className='w-full'>
          <div className='flex justify-center items-center gap-2'>
            {isLoading ? <Icons.spinner className='animate-spin' /> : <FireIcon className='w-6 h-6' />}
            <span className='text-sm'>{hasMore ? 'Load more' : 'No more series'}</span>
          </div>
        </Button>
      </div>
    </>
  );
};

