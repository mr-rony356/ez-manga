"use client";
import { ChapterAPIResponse } from "@/types";
import { Slider } from "@/components/ui/slider";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeaderContext } from "../Header/ContextProvider";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type SliderProps = React.ComponentProps<typeof Slider>;

type ChapterHeaderProps = {
  API_Response: ChapterAPIResponse;
};

const ChapterHeader = ({ API_Response }: ChapterHeaderProps) => {
  const { chapter, next_chapter, previous_chapter } = API_Response;
  const [scroll, setScroll] = useState<number>(0);


  const series = chapter.series;

  return (
    <div className='flex my-10 flex-col gap-2 w-full'>

      {series && (
        <nav className="flex shadow  flex-row justify-between bg-background w-full transition-all duration-300 ease-in px-4 py-2">
          <div className="container flex flex-row gap-x-3 justify-between px-4 py-3 rounded self-start w-full">
            <Link
              prefetch={false}
              href={
                previous_chapter
                  ? `/series/${chapter.series.series_slug}/${previous_chapter.chapter_slug}`
                  : `/series/${chapter.series.series_slug}/`
              }
            >
              <Button
                variant={"outline"}
                className={"flex flex-row gap-2 items-center"}
              >
                <FontAwesomeIcon
                  size={"sm"}
                  icon={previous_chapter ? faChevronLeft : faHouse}
                />{" "}
                {previous_chapter ? "Previous" : "Home"}
              </Button>
            </Link>

            <Link
              prefetch={false}
              href={
                next_chapter
                  ? `/series/${chapter.series.series_slug}/${next_chapter.chapter_slug}`
                  : `/series/${chapter.series.series_slug}/`
              }
            >
              <Button
                variant={"outline"}
                className={"flex flex-row gap-2 items-center"}
              >
                {next_chapter ? "Next" : "Home"}{" "}
                <FontAwesomeIcon
                  size={"sm"}
                  icon={next_chapter ? faChevronRight : faHouse}
                />
              </Button>
            </Link>
          </div>
        </nav>
      )}

    </div>
  );
};

export default ChapterHeader;
