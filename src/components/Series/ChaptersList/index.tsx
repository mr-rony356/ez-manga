"use client";
import { Chapter, Season } from "@/types";
import { useState, useEffect, createRef, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buy_chapter, fetcher } from "@/services";
import {
  faLock,
  faEye,
  faCoins,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get_file_url } from "@functions";
import Link from "next/link";
import { get_time_diff, formatNumber } from "@/components/Series/helpers";
import { ArrowDownIcon, ArrowUpIcon, SpeakerLoudIcon } from "@radix-ui/react-icons";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import useAuthentication from "@/hooks/useAuth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { clear_cache } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "usehooks-ts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


const ChapterItem = ({ chapter }: { chapter: Chapter }) => {
  const { data: auth } = useAuthentication();
  const bought_chapters = auth?.user.bought_chapters as Chapter[];

  return (
    <li key={chapter.id} className="flex justify-between">
      <div className="flex text-left relative items-center w-full justify-start rounded overflow-hidden p-4 bg-secondary shadow gap-x-3">
        {chapter.chapter_thumbnail && (
          <div className="h-[86px] w-[143px] shrink-0 rounded relative overflow-hidden">
            <Image
              loading="lazy"
              width={143}
              height={86}
              alt=""
              src={get_file_url(chapter.chapter_thumbnail)}
            />
          </div>
        )}
        <div className="flex min-w-0 flex-col self-start">
          <div className="flex flex-row gap-2 items-start">
            <span className="m-0 text-xs line-clamp-1 lg:max-w-none">
              {chapter.chapter_name}
            </span>
            {auth?.isLoggedIn &&
              bought_chapters?.some((ch) => ch.id == chapter.id) && (
                <>
                  {chapter.price > 0 && (
                    <span className="bg-primary shrink-0 self-start text-background text-[10px] font-bold  px-2 py-1 rounded uppercase">
                      <FontAwesomeIcon icon={faLockOpen} /> UNLOCKED
                    </span>
                  )}
                </>
              )}
            {auth?.isLoggedIn &&
              !bought_chapters?.some((ch) => ch.id == chapter.id) &&
              chapter.price > 0 && (
                <span className="bg-orange-600 shrink-0 self-start text-white text-[10px] font-bold  px-2 py-1 rounded uppercase">
                  {chapter.price}{" "}
                  <FontAwesomeIcon color={"yellow"} icon={faCoins} />{" "}
                </span>
              )}
            {!auth?.isLoggedIn && chapter.price > 0 && (
              <span className="bg-orange-600 shrink-0 self-start text-white text-[10px] font-bold  px-2 py-1 rounded uppercase">
                {chapter.price} <FontAwesomeIcon color={"yellow"} icon={faCoins} />{" "}
              </span>
            )}
          </div>
          {chapter.chapter_title && <span className='text-muted-foreground/70 text-xxs line-clamp-1 '>
            {chapter.chapter_title}
          </span>}
          {!chapter.views && (
            <span className="text-muted-foreground/50  text-[10px] block">
              {get_time_diff(chapter.created_at)}
            </span>
          )}
          {chapter.views && (
            <span className="m-0 text-muted-foreground text-[10px] block">
              {get_time_diff(chapter.created_at)} -{" "}
              <FontAwesomeIcon icon={faEye} /> {formatNumber(chapter.views)}
            </span>
          )}
        </div>

      </div>
    </li>
  );
};

interface ChaptersListProps {
  seasons: Season[];
  series_id: string | number;
  series_type: "Comic" | "Novel";
}

const ChaptersList = ({
  series_id,
  seasons,
  series_type,
}: ChaptersListProps) => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([]);
  const [order, setOrder] = useState<string>("desc");

  const containerRef = createRef<HTMLDivElement>();

  const { data, isLoading } = useSWR<{ data: Chapter[]; meta: any }>(
    `/chapter/query?${new URLSearchParams({
      page: page.toString(),
      perPage: "30",
      query,
      order,
      series_id: series_id.toString(),
    }).toString()}`,
    fetcher
  );

  const { data: premium, isLoading: isLoadingPremium } = useSWR<{ data: Chapter[]; meta: any }>(
    `/api/chapters/paid?${new URLSearchParams({
      query,
      order,
      series_id: series_id.toString(),
    }).toString()}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setPages(Array.from({ length: data.meta.last_page }, (_, i) => i + 1));
      setLastPage(data.meta.last_page);
    }
  }, [data]);
  const chapters = data?.data;
  const premiumChapters = premium?.data;


  const debounced = useDebounceCallback(setQuery, 1000)



  return (
    <>

      <div className="flex flex-row gap-2">
        <Input className='placeholder:text-xxs' placeholder='Filter by chapter name, chapter title...' onChange={e => debounced(e.currentTarget.value)} />
        <ToggleGroup
          type="single"
          onValueChange={(value) => setOrder(value)}
          defaultValue={'desc'}
        >
          <ToggleGroupItem
            variant={'outline'}
            value="asc"
          >
            <ArrowUpIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            variant={'outline'}
            value="desc"
          >
            <ArrowDownIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {!isLoading ? (
        <div className="space-y-4 py-5" ref={containerRef}>

          <>
            <ul className="grid grid-cols-1 gap-3">
              {chapters && premiumChapters &&
                [...premiumChapters, ...chapters].map((chapter) => {
                  return (
                    <ChapterWrapper chapter={chapter} key={chapter.id}>
                      <ChapterItem chapter={chapter} />
                    </ChapterWrapper>
                  );
                })}
            </ul>
          </>
          <Pagination className="gap-x-2">
            <PaginationContent>
              <PaginationItem data-has-previous={page !== 1}>
                <PaginationPrevious
                  onClick={() => {
                    if (page !== 1) setPage(page - 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
            <PaginationContent className="flex">
              {page > 3 &&
                pages.slice(0, 1).map((page_item) => {
                  return (
                    <PaginationItem key={page_item}>
                      <PaginationLink
                        isActive={page_item == page}
                        onClick={() => {
                          if (page_item !== page) setPage(page_item);
                        }}
                      >
                        {page_item}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
            </PaginationContent>
            {page > 2 && (
              <PaginationContent>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              </PaginationContent>
            )}
            <PaginationContent className="flex">
              {pages.slice(Math.max(page - 2, 0), page + 1).map((page_item) => {
                return (
                  <PaginationItem key={page_item}>
                    <PaginationLink
                      isActive={page_item == page}
                      onClick={() => {
                        if (page_item !== page) setPage(page_item);
                      }}
                    >
                      {page_item}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            </PaginationContent>
            {page < lastPage - 2 && (
              <PaginationContent>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              </PaginationContent>
            )}
            <PaginationContent className="flex">
              {page < lastPage - 1 &&
                pages.slice(-1).map((page_item) => {
                  return (
                    <PaginationItem key={page_item}>
                      <PaginationLink
                        isActive={page_item == page}
                        onClick={() => {
                          if (page_item !== page) setPage(page_item);
                        }}
                      >
                        {page_item}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
            </PaginationContent>
            <PaginationContent>
              {page < lastPage && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (page !== pages.length) setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      ) : (
        <div className="space-y-4">
          {new Array(30).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full p-2 rounded" />
          ))}
        </div>
      )}
    </>
  );
};

const ChapterWrapper = ({
  children,
  chapter,
}: {
  children: React.ReactNode;
  chapter: Chapter;
}) => {
  const { data: auth, isLoading } = useAuthentication();
  const bought_chapters = auth?.user.bought_chapters;

  const router = useRouter();

  async function buyChapter() {
    if (auth && !auth.isLoggedIn) return router.push("/login");
    toast.promise(buy_chapter(chapter.id), {
      error: "An error occured while buying the chapter!",
      success: async () => {
        await clear_cache(
          `${chapter.series.series_slug}-${chapter.chapter_slug}`
        );
        setTimeout(
          () =>
            router.push(
              `/series/${chapter.series.series_slug}/${chapter.chapter_slug}`
            ),
          1500
        );
        return "The chapter was successfully bought! Redirecting...";
      },
      loading: "Buying chapter...",
    });
  }

  if (auth && auth.isLoggedIn && !isLoading && (auth!.user.is_staff_reader || auth!.user.role === 'Admin' || auth!.user.role === 'Editor')) {
    return (
      <Link prefetch={false}

        href={`/series/${chapter.series.series_slug}/${chapter.chapter_slug}`}
        className="text-foreground visited:text-[rgb(79,0,225)]"
      >
        {children}
      </Link>
    );
  }

  if (
    (chapter.price > 0 && auth && !auth!.isLoggedIn) ||
    (chapter.price > 0 &&
      auth &&
      auth!.isLoggedIn &&
      !bought_chapters?.some((ch) => ch.id == chapter.id))
  ) {
    return (
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogTitle>This is a premium chapter!</DialogTitle>
          <DialogDescription>
            This chapter is locked. You need to unlock it to read it.
          </DialogDescription>
          <div className={"flex flex-col gap-2"}>
            <Button variant={"outline"} onClick={buyChapter}>
              Buy chapter ({chapter.price} coins)
            </Button>
            <DialogClose>
              <Button className={"w-full"} variant={"destructive"}>
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Link prefetch={false}

        href={`/series/${chapter.series.series_slug}/${chapter.chapter_slug}`}
        className="text-foreground visited:text-[rgb(79,0,225)]"
      >
        {children}
      </Link>
    );
  }
};

export default ChaptersList;
