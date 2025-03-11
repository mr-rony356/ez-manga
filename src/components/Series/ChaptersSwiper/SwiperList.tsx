"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { formatNumber, get_time_diff } from "../helpers";
import useChapters from "@/hooks/useChapters";
import { createRef, useEffect, useRef } from "react";
import { get_file_url } from "@functions";
import useSWR from "swr";
import { usePathname } from "next/navigation";
import { fetcher } from "@/services";
import { Chapter } from "@/types";

interface ChaptersContentProps {
  open: boolean;
}

const ChaptersListing = ({ open }: ChaptersContentProps) => {
  const pathname = usePathname();

  const series_slug = pathname.split("/")[2];

  const chapter_slug = pathname.split("/")[3];

  const {
    data: chapters,
    error,
    isLoading,
  } = useSWR<Chapter[]>(`/chapter/all/${series_slug}`, fetcher);

  const currentChapter = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (open && !isLoading) {
      setTimeout(() => {
        if (currentChapter.current !== null) {
          currentChapter.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 500);
    }
  }, [open, isLoading]);

  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-4">
      {chapters &&
        chapters.map((chapter) => {
          return (
            <Link prefetch={false}
              href={`/series/${series_slug}/${chapter.chapter_slug}`}
              key={chapter.id}
            >
              <li
                key={chapter.id}
                ref={
                  chapter_slug === chapter.chapter_slug ? currentChapter : null
                }
                data-state-current={`${chapter_slug === chapter.chapter_slug ? "true" : "false"
                  }`}
                className="flex data-[state-current='true']:bg-gray-700 text-left relative items-center w-full justify-start bg-background shadow-black rounded overflow-hidden p-0   gap-x-3"
              >
                <div className="min-h-[56px] shrink-0">
                  {chapter.chapter_thumbnail && (
                    <img
                      src={get_file_url(chapter.chapter_thumbnail)}
                      className="w-auto h-[86px]"
                    />
                  )}
                </div>
                <div className="flex min-w-0 my-[6px] flex-col">
                  <span className="m-0   text-[1rem] line-clamp-1 text-foreground">
                    {chapter.chapter_title
                      ? `${chapter.chapter_name} - ${chapter.chapter_title}`
                      : chapter.chapter_name}
                  </span>
                  {!chapter.views && (
                    <span className="m-0   text-muted-foreground text-[0.875rem] leading-[1.43] block">
                      {get_time_diff(chapter.created_at)}
                    </span>
                  )}
                  {chapter.views && (
                    <span className="m-0   text-muted-foreground text-[0.875rem] leading-[1.43] block">
                      {get_time_diff(chapter.created_at)} -{" "}
                      <FontAwesomeIcon icon={faEye} />{" "}
                      {formatNumber(chapter.views)}
                    </span>
                  )}
                </div>
              </li>
            </Link>
          );
        })}
    </ul>
  );
};

interface ChaptersListProps {
  open: boolean;
}

const ChaptersList = ({ open }: ChaptersListProps) => {
  return (
    <>
      <ChaptersListing open={open} />
    </>
  );
};

export default ChaptersList;
