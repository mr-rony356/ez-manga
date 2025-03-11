"use client";

import type { Series } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { get_time_diff } from "@/components/Series/helpers";
import Link from "next/link";
import Image from "next/image";
import { get_file_url } from "../../../functions";
import StarIcons from "/public/starts.svg";

export function NewSeriesSlider({ series }: { series: Series[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center mb-4">
        <Image
          src={StarIcons}
          alt="Star"
          className="w-8 h-8 lg:w-10 lg:h-10"
          width={20}
          height={20}
        />
        <h1 className="text-[18px] lg:text-[41px] font-bold">
          Fresh New Series{" "}
          <span className="text-primary text-lg font-normal">
            ({series.length})
          </span>
        </h1>
      </div>
      <Carousel
        opts={{
          loop: false,
          dragFree: true,
        }}
      >
        <CarouselContent className={"px-3 lg:px-0"}>
          {series.length > 0 &&
            series.map((series) => {
              return (
                <CarouselItem
                  className={"basis-[50%] lg:basis-1/5 flex flex-col gap-2"}
                  key={series.id}
                >
                  <Link
                    prefetch={false}
                    href={`/series/${series.series_slug}`}
                    className={"flex flex-col gap-2 relative"}
                  >
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-[#ff7700d9] to-[#ff5714c9] text-white px-3 py-1 rounded-[8px] lg:text-xs text-xxs font-medium z-10">
                      NEW
                    </div>
                    <Image
                      loading="lazy"
                      alt={""}
                      height={380}
                      width={270}
                      className={
                        "w-[175px] h-[245px] lg:w-[305px] lg:h-[432px] object-cover rounded-[8px] ring-2 ring-[#1c1c1cb8] border border-[#1c1c1c]"
                      }
                      src={get_file_url(series.thumbnail)}
                    />
                  </Link>
                  <div className="flex flex-col gap-1 text-left">
                    <h1 className="lg:text-xl !text-[#dddddd] font-normal line-clamp-1 text-[14px]!font-manrope">
                      {series.title}
                    </h1>
                    <p className="lg:text-[22px] !text-[#969595] text-[13px]">
                      1 day ago
                    </p>
                  </div>
                </CarouselItem>
              );
            })}
        </CarouselContent>
        {/* <CarouselPrevious className={"hidden lg:flex"} />
        <CarouselNext className={"hidden lg:flex"} /> */}
      </Carousel>
    </div>
  );
}
