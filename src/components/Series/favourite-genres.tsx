"use client";

import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import useSWR from "swr";
import { fetcher } from "@/services";
import { Series, Tag } from "@/types";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { get_file_url } from "../../../functions";

export const FavouriteGenres = () => {
  const {
    data: tags,
    error,
    isLoading,
  } = useSWR<Tag[]>("/popular_tags", fetcher);
  const [value, setValue] = useState<number>(0);

  const {
    data: query,
    isLoading: loading,
    error: err,
  } = useSWR<{ data: Series[] }>(
    tags
      ? `/query?${new URLSearchParams({
        tags_ids: `[${value}]`,
      }).toString()}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (tags && tags.length > 0) {
      setValue(tags[0].id);
    }
  }, [tags]);

  if (isLoading) return null;
  if (error) return null;

  return (
    <div className={"container flex flex-col gap-2 px-3 col-span-full"}>
      <h5 className={"text-foreground self-start text-lg font-bold"}>Favourite genres</h5>
      <Tabs
        value={value.toString()}
        className={"self-start"}
        onValueChange={(value) => setValue(parseInt(value))}
      >
        <TabsList className={"flex flex-row flex-wrap overflow-hidden h-fit "}>
          {tags &&
            tags.slice(0, 5).map((tag) => (
              <TabsTrigger
                className={"text-xxs lg:text-sm"}
                value={tag.id.toString()}
                key={tag.id}
              >
                {tag.name}
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>
      <Carousel
        opts={{
          loop: false,
        }}
      >
        <CarouselContent className={"px-3 lg:px-0"}>
          {query &&
            !loading &&
            query.data.length > 0 &&
            query.data.map((series) => {
              return (
                <CarouselItem
                  className={"basis-[35%] lg:basis-1/5 flex flex-col gap-2"}
                  key={series.id}
                >
                  <Link prefetch={false}

                    href={`/series/${series.series_slug}/`}
                    className={"flex flex-col gap-2"}
                  >
                    <Image
                      loading="lazy"
                      width={158}
                      height={115}
                      alt={""}
                      className={
                        "aspect-[72/97] w-full h-full object-fit rounded-lg"
                      }
                      src={get_file_url(series.thumbnail)}
                    />
                    <div className={"flex flex-col items-center"}>
                      <h5
                        className={
                          "text-foreground font-semibold text-xxs lg:text-sm m-0 p-0 line-clamp-2 text-center"
                        }
                      >
                        {series.title}
                      </h5>
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          {loading &&
            new Array(5).map((_, index) => (
              <CarouselItem
                className={"basis-[35%] lg:basis-1/5 flex flex-col gap-2"}
                key={index}
              >
                <Skeleton
                  className={
                    "aspect-[72/97] w-full h-full object-fit rounded-lg"
                  }
                />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className={"hidden lg:flex"} />
        <CarouselNext className={"hidden lg:flex"} />
      </Carousel>
    </div>
  );
};
