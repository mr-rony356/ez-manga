"use client";

import { Chapter, Series } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { get_time_diff } from "@/components/Series/helpers";
import Link from "next/link";
import { atom, useAtom, useAtomValue } from "jotai";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { get_file_url } from "@functions";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faClock } from "@fortawesome/free-solid-svg-icons";

const chaptersType = atom<"free_chapters" | "paid_chapters">("free_chapters");

export const NovelsUpdatesSlider = ({ novels }: { novels: Series[] }) => {
  const [value, setValue] = useAtom(chaptersType);

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={"col-span-full container flex flex-col gap-3"}>
      <div
        className={
          "px-3 lg:px-0 flex flex-col lg:flex-row gap-2 self-center lg:self-start"
        }
      >
        {/*<h1 className="text-base lg:text-xl text-left font-semibold text-foreground">*/}
        {/*  {" "}*/}
        {/*  Latest Novel Updates*/}
        {/*</h1>*/}
        {mounted && (
          <Tabs
            value={value}
            className={"self-center lg:self-start"}
            onValueChange={(value) =>
              setValue(value as typeof chaptersType.init)
            }
          >
            <TabsList className={"h-fit self-center lg:self-start"}>
              <TabsTrigger
                className={"text-[8px] lg:text-xxs px-8"}
                value={"free_chapters"}
              >
                Free
              </TabsTrigger>
              <TabsTrigger
                className={
                  "text-[8px] lg:text-xxs px-8 flex flex-row items-center gap-1"
                }
                value={"paid_chapters"}
              >
                Paid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      <Carousel
        opts={{
          loop: false,
          dragFree: true,
        }}
      >
        <CarouselContent className={"px-3 lg:px-0"}>
          {novels.length > 0 &&
            novels.map((series) => {
              return <SeriesCarouselSlide series={series} key={series.id} />;
            })}
        </CarouselContent>
        <CarouselPrevious className={"hidden lg:flex"} />
        <CarouselNext className={"hidden lg:flex"} />
      </Carousel>
    </div>
  );
};

export const SeriesCarouselSlide = ({ series }: { series: Series }) => {
  const key = useAtomValue(chaptersType);

  if (series[key].length === 0) return null;

  return (
    <CarouselItem
      className={"basis-[35%] lg:basis-1/5 flex flex-col gap-2"}
      key={series.id}
    >
      <Link prefetch={false}

        href={`/series/${series.series_slug}`}
        className={"flex flex-col relative gap-2"}
      >
        {key === "paid_chapters" && (
          <span className="bg-[#FFC5C5] absolute top-2 left-2 z-10 self-start dark:bg-[#5b2e30] dark:bg-opacity-70 backdrop-blur text-[#ff8080] text-[10px] font-bold text-foreground-100 px-2 py-1 rounded uppercase">
            Paid
          </span>
        )}
        <Image
          loading="lazy"
          alt={""}
          height={115}
          sizes={"20vw"}
          width={158}
          className={"aspect-[72/97] w-full h-full object-fit rounded-lg"}
          src={get_file_url(series.thumbnail)}
        />
      </Link>
      <Link prefetch={false}
        className="visited:text-[rgb(79,0,225)]"

        href={
          series[key].length > 0
            ? `/series/${series.series_slug}/${series[key][0].chapter_slug}`
            : `/series/${series.series_slug}`
        }
      >
        <div className={"flex flex-col items-start"}>
          <h5
            className={
              "w-fit font-semibold self-start text-xxs lg:text-sm m-0 p-0 flex flex-col lg:flex-row gap-1 items-start lg:items-center justify-between"
            }
          >
            {series[key].length > 0 && series[key][0].chapter_name}
          </h5>
          <span
            className={
              "text-muted-foreground line-clamp-1 self-start text-[10px] lg:text-xxs flex flex-row gap-1 items-center"
            }
          >
            <FontAwesomeIcon icon={faBook} />
            <span className={"line-clamp-1 text-left"}>{series.title}</span>
          </span>
          <span
            className={
              "text-muted-foreground/50 text-[8px] flex flex-row gap-1 items-center lg:text-xxs"
            }
          >
            <FontAwesomeIcon icon={faClock} />
            {series[key].length > 0 && get_time_diff(series[key][0].created_at)}
          </span>
        </div>
      </Link>
    </CarouselItem>
  );
};
