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
import { get_file_url } from "../../../functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faClock } from "@fortawesome/free-solid-svg-icons";

export const ComicsUpdatesSlider = ({ comics }: { comics: Series[] }) => {
  return (
    <div className={"col-span-full container flex flex-col gap-3"}>
      {/*<div className={"px-3 lg:px-0"}>*/}
      {/*  <h1 className="text-base lg:text-xl text-left font-semibold text-foreground">*/}
      {/*    {" "}*/}
      {/*    Latest Comic Updates*/}
      {/*  </h1>*/}
      {/*</div>*/}
      <Carousel
        opts={{
          loop: false,
          dragFree: true,
        }}
      >
        <CarouselContent className={"px-3 lg:px-0"}>
          {comics.length > 0 &&
            comics.map((series) => {
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
                      loading="lazy"
                      alt={""}
                      height={115}
                      width={158}
                      className={
                        "aspect-[72/97] w-full h-full object-fit rounded-lg"
                      }
                      src={get_file_url(series.thumbnail)}
                    />
                  </Link>
                  <Link prefetch={false}
                    className="visited:text-[rgb(79,0,225)]"

                    href={
                      series["free_chapters"].length > 0
                        ? `/series/${series.series_slug}/${series["free_chapters"][0].chapter_slug}`
                        : `/series/${series.series_slug}`
                    }
                  >
                    <div className={"flex flex-col items-start"}>
                      <h5
                        className={"font-semibold text-xxs lg:text-sm m-0 p-0"}
                      >
                        {series["free_chapters"].length > 0 &&
                          series["free_chapters"][0].chapter_name}
                      </h5>
                      <span
                        className={
                          "text-muted-foreground line-clamp-1 self-start text-[8px] lg:text-xxs flex flex-row gap-1 items-center"
                        }
                      >
                        <FontAwesomeIcon icon={faBook} />
                        <span className={"line-clamp-1 text-left"}>
                          {series.title}
                        </span>
                      </span>
                      <span
                        className={
                          "text-muted-foreground/50 text-[8px] flex flex-row gap-1 items-center lg:text-xxs"
                        }
                      >
                        <FontAwesomeIcon icon={faClock} />

                        {series["free_chapters"].length > 0 &&
                          get_time_diff(series["free_chapters"][0].created_at)}
                      </span>
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
