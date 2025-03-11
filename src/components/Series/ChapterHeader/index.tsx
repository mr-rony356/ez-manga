"use client";
import { useEffect } from "react";
import { updateChapterViews } from "@/services";
import { get_file_url } from "@functions";
import { useRouter } from "next/navigation";
import { ChapterAPIResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { navbarState } from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import {
  faChevronLeft,
  faChevronRight,
  faGear,
  faHouse,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import ChaptersSwiper from "../ChaptersSwiper";
import { ReaderSettings } from "../reader-settings";
import Link from "next/link";

type ChapterHeaderProps = {
  API_Response: ChapterAPIResponse;
};

export const swiperState = atom<boolean>(false);
export const settingsState = atom<boolean>(false);

const ChapterHeader = ({ API_Response }: ChapterHeaderProps) => {
  const router = useRouter();
  const { chapter, next_chapter, previous_chapter } = API_Response;

  const state = useAtomValue(navbarState);
  const setSwiper = useSetAtom(swiperState);
  const setSettings = useSetAtom(settingsState);
  const series = chapter.series;

  useEffect(() => {
    mapKeyEvents();
    (async () => {
      await updateChapterViews(series.series_slug, chapter.chapter_slug);
    })();
  }, []);

  const mapKeyEvents = () => {
    document.addEventListener("keydown", function (e) {
      const searchBar = document.getElementById("searchbar")!;
      if (searchBar === document.activeElement) return;
      if (e.key == "ArrowRight") {
        if (next_chapter)
          router.push(
            `/series/${series.series_slug}/${next_chapter?.chapter_slug}`
          );
      }
      if (e.key == "ArrowLeft") {
        if (previous_chapter)
          router.push(
            `/series/${series.series_slug}/${previous_chapter?.chapter_slug}`
          );
      }
    });
  };

  return (
    <>
      {series && (
        <nav
          data-limit={state}
          className="flex shadow flex-row lg:mb-4 justify-between items-center  transition-all duration-300 ease-in"
        >
          <div
            className={"flex flex-row container justify-between items-center "}
          >
            <div className="flex flex-row gap-x-3 justify-center grow-0 px-4 py-3 rounded self-start">
              <Link
                prefetch={false}
                href={
                  previous_chapter
                    ? `/series/${chapter.series.series_slug}/${previous_chapter.chapter_slug}`
                    : `/series/${chapter.series.series_slug}/`
                }
              >
                <Button variant={"outline"}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
              </Link>
              <div className="max-h-12">
                <Image
                  alt={"series thumb"}
                  loading="lazy"
                  width={35}
                  height={40}
                  src={get_file_url(series.thumbnail)}
                  className="rounded h-full w-[35px]"
                />
              </div>
              <div className="hidden lg:block lg:min-w-[240px]">
                <h1 className="font-semibold font-sans text-foreground text-xs">
                  {chapter.chapter_name}
                </h1>
                <h2 className="font-semibold font-sans text-muted-foreground text-xxs">
                  {series && series.title}
                </h2>
              </div>
            </div>
            <Link
              prefetch={false}
              href={`/series/${chapter.series.series_slug}`}
            >
              <Button
                variant={"outline"}
                className="flex flex-row items-center gap-1"
              >
                <FontAwesomeIcon icon={faHouse} />
                <span className="hidden lg:block text-xxs">Home</span>
              </Button>
            </Link>
            <div className="flex flex-row gap-x-3 justify-center grow-0 px-4 py-3 rounded">
              {chapter.chapter_type === "Novel" && (
                <Button
                  variant={"outline"}
                  onClick={() => setSettings((state) => !state)}
                >
                  <FontAwesomeIcon icon={faGear} />
                </Button>
              )}
              <Button
                variant={"outline"}
                onClick={() => setSwiper((state) => !state)}
              >
                <FontAwesomeIcon icon={faList} />
              </Button>
              <Link
                prefetch={false}
                href={
                  next_chapter
                    ? `/series/${chapter.series.series_slug}/${next_chapter.chapter_slug}`
                    : `/series/${chapter.series.series_slug}/`
                }
              >
                <Button variant={"outline"}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      )}
      <ChaptersSwiper />
      <ReaderSettings />
    </>
  );
};

export default ChapterHeader;
