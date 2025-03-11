"use client";

import { Series } from "@/types";
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

export const ComingSoon = ({ series }: { series: Series[] }) => {
  return (
    <div className={"col-span-full container flex flex-col gap-3"}>
      <div className={"px-3 lg:px-0"}>
        <h1 className="text-xl text-left font-semibold text-foreground">
          {" "}
          Coming soon
        </h1>
      </div>
      <Carousel
        opts={{
          loop: false,
        }}
      >
        <CarouselContent className={"px-3 lg:px-0"}>
          {series.length > 0 &&
            series.map((series) => {
              return (
                <CarouselItem
                  className={"basis-[35%] lg:basis-1/5 flex flex-col gap-2"}
                  key={series.id}
                >
                  <Link prefetch={false}
                    href={`/series/${series.series_slug}`}
                    className={"flex flex-col gap-2"}
                  >
                    <Image
                      width={720}
                      height={970}
                      alt={""}
                      className={
                        "aspect-[72/97] w-full h-full object-fit rounded-lg"
                      }
                      src={series.thumbnail}
                    />
                    <div className={"flex flex-col items-start"}>
                      <h5
                        className={
                          "text-foreground font-semibold text-xxs lg:text-base m-0 p-0"
                        }
                      >
                        {series.title}
                      </h5>
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
        </CarouselContent>
        <CarouselPrevious className={"hidden lg:flex"} />
        <CarouselNext className={"hidden lg:flex"} />
      </Carousel>
    </div>
  );
};
