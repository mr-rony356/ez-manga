"use client";
import { useContext, useState } from "react";
import { ComicsContext } from "./Context";
import { SeriesItem } from "@/components/Series";
import { Series } from "@/types";
import { Website_API } from "@global";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import fire from "/public/fire.svg";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const HomeComics = () => {
  const { page, setPage, comics, setComics } = useContext(ComicsContext);

  const [isLoading, setLoading] = useState(false);

  async function getMoreSeries() {
    setPage(page + 1);
    setLoading(true);
    const new_comics: Series[] = (
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
    ).data;

    setComics([...comics, ...new_comics]);
    setLoading(false);
  }

  return (
    <>
      <div className="col-span-12 bg-gray-850 rounded space-y-2 container px-5 lg:px-0">
        <div className="flex flex-row items-center justify-between gap-4 relative">
          <h1 className="text-[19px]  lg:text-[41px] text-left font-bold tracking-tighter md:text-6xl lg:leading-[1.1] font-manrope">
            {" "}
            <div className="flex flex-row items-center lg:gap-2 gap-1 my-6 ml-2 ">
              <Image
                src={fire}
                alt="fire"
                className="object-contain lg:mr-2 lg:w-[40px] lg:h-[40px] w-[25px] h-[25px]"
                width={40}
                height={40}
                quality={100}
              />
              Last Updates
            </div>
          </h1>
          <Link
            href="/latest"
            className="shrink-0 bg-[#161616] py-1 lg:px-4 px-2 rounded-xl"
          >
            <span className="shrink-0 text-muted-foreground lg:text-xl text-[13px] flex flex-row items-center gap-2">
              Show More <ArrowUpRight className="w-6 h-6 text-[#B6B6B6]" />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 lg:gap-y-8 gap-y-6">
          {comics &&
            comics.length > 0 &&
            comics.map((chapter) => (
              <SeriesItem series={chapter} key={chapter.id} />
            ))}
        </div>
      </div>
    </>
  );
};
export default HomeComics;
