"use client";
import useSWR from "swr";
import Link from "next/link";
import TrendingIcon from "/public/trending.svg";
import ListIcon from "/public/list.svg";
import { get_file_url } from "@functions";
import Image from "next/image";
import { Series } from "@/types";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useRef, useState } from "react";
import { env } from "@/env";
import clsx from "clsx";
import {
  BookmarkFilledIcon,
  ReaderIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Book, BookmarkIcon, BookOpen, LucideTrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { tv } from "tailwind-variants";
const imageShine = tv({
  base: `relative overflow-hidden
    before:absolute before:inset-0 before:z-20
    before:translate-x-[-100%] before:skew-x-[-45deg]
    before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_45%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0.1)_55%,transparent_100%)]
    before:animate-none hover:before:animate-[shine_1s_ease-in-out]`,
});

// Add this to your existing styles or in a global CSS file
const keyframes = `
  @keyframes shine {
    0% {
      transform: translateX(-100%) skewX(-45deg);
    }
    100% {
      transform: translateX(200%) skewX(-45deg);
    }
  }
`;
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = keyframes;
  document.head.appendChild(style);
}

const fetcher = (...args: any) => fetch(...[args]).then((res) => res.json());

const chunkIntoN = (arr: Array<any>, n: number) => {
  const size = Math.ceil(arr.length / n);
  return Array.from({ length: n }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
};

const Trending = () => {
  const week = useSWR(
    env.NEXT_PUBLIC_API_URL +
      `/trending?${new URLSearchParams({
        type: "weekly",
      }).toString()}`,
    fetcher
  );

  const day = useSWR(
    env.NEXT_PUBLIC_API_URL +
      `/trending?${new URLSearchParams({
        type: "daily",
      }).toString()}`,
    fetcher
  );

  const all = useSWR(
    env.NEXT_PUBLIC_API_URL +
      `/trending?${new URLSearchParams({
        type: "all",
      }).toString()}`,
    fetcher
  );

  const [tab, setTab] = useState<"day" | "week" | "all">("week");

  const swiper = useRef<SwiperRef>(null);
  const pagination = useRef<HTMLDivElement>(null);
  const swiperSlider = swiper.current?.swiper;

  const [current, setCurrent] = useState<number>(0);

  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (swiperSlider) {
      swiperSlider.on("slideChange", () => {
        if (pagination.current) {
          setCurrent(swiperSlider.activeIndex);
        }
      });
    }
  }, [swiperSlider]);

  useEffect(() => {
    swiperSlider?.slideTo(0);
  }, [tab]);

  useEffect(() => {
    const currentData =
      tab === "week" ? week.data : tab === "day" ? day.data : all.data;

    if (!currentData) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % currentData.length;
        setSelectedSeries(currentData[nextIndex]);
        return nextIndex;
      });
    }, 100000); // 100 seconds

    // Cleanup interval on unmount or when tab/data changes
    return () => clearInterval(interval);
  }, [tab, week.data, day.data, all.data]);

  // Reset index when tab changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [tab]);

  // Initial selection effect
  useEffect(() => {
    const currentData =
      tab === "week" ? week.data : tab === "day" ? day.data : all.data;
    if (currentData && currentData.length > 0) {
      setSelectedSeries(currentData[0]);
      setCurrentIndex(0);
    }
  }, [tab, week.data, day.data, all.data]);

  // Handle manual selection
  const handleSeriesSelect = (series: Series, index: number) => {
    setSelectedSeries(series);
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col gap-3 lg:px-0">
      <div className="flex flex-row gap-6 items-center lg:mb-8 mb-4">
        <div className="flex flex-row gap-2 items-center min-w-max">
          <Image
            src={TrendingIcon}
            alt="Trending"
            className="lg:w-12 lg:h-12 w-8 h-8 inline-block lg:mr-2 mr-1"
            width={100}
            height={100}
          />
          <h1 className="text-[18px] lg:text-[41px] text-left font-extrabold text-foreground">
            Trending Now
          </h1>
        </div>
        <Separator orientation="horizontal" />
        <Tabs
          value={tab}
          className=""
          onValueChange={(value) => setTab(value as "day" | "week" | "all")}
        >
          <TabsList className="flex flex-row gap-2 self-start justify-start">
            <TabsTrigger asChild value="day">
              <button className="rounded py-1 lg:px-4 px-1 lg:w-24 w-12 text-[8px] lg:text-[12px] bg-muted-foreground/20 data-[state='active']:bg-muted-foreground/80">
                Week
              </button>
            </TabsTrigger>
            <TabsTrigger asChild value="week">
              <button className="rounded py-1 lg:px-4 px-1 lg:w-24 w-12 text-[8px] lg:text-[12px] bg-muted-foreground/20 data-[state='active']:bg-muted-foreground/80">
                Months
              </button>
            </TabsTrigger>
            <TabsTrigger asChild value="all">
              <button className="rounded py-1 lg:px-4 px-1 lg:w-24 w-12 text-[8px] lg:text-[12px] bg-muted-foreground/20 data-[state='active']:bg-muted-foreground/80">
                All time
              </button>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-full flex flex-col-reverse lg:flex-row lg:gap-6 gap-4">
        {selectedSeries && (
          <Link
            prefetch={false}
            href={`/series/${selectedSeries.series_slug}`}
            className="w-full lg:w-[60%] flex flex-col    overflow-hidden shadow-md px-4 lg:px-0"
          >
            <div className="flex gap-4">
              <div className="lg:h-[390px] ">
                <Image
                  src={get_file_url(selectedSeries.thumbnail)}
                  alt={selectedSeries.title || "Featured series thumbnail"}
                  width={240}
                  height={360}
                  className="lg:w-[265px] w-[157px] h-full object-cover object-top rounded-[4px]"
                />
              </div>
              <div className="w-[60%] lg:w-[60%]  lg:p-4 p-1 text-white flex flex-col justify-between lg:py-10 py-4">
                <div>
                  <h2 className="text-[18px] lg:text-[36px] font-normal text-left mb-2 line-clamp-1">
                    {selectedSeries.title}
                  </h2>
                  <p className="lg:!text-md text-[12px] lg:line-clamp-3 line-clamp-2 text-left text-[#9CA3AF] font-normal">
                    {selectedSeries.description}
                  </p>
                </div>

                <div className="flex flex-row lg:gap-2 gap-1 lg:text-xs text-[8px]">
                  <button className="bg-gradient-to-r from-[#FF7700] to-[#ff5714b2] text-white lg:px-4 px-2 lg:py-2 py-1 rounded-[4px] hover:bg-orange-600 transition flex items-center gap-2">
                    <BookOpen className="lg:w-4 lg:h-4 w-3 h-3" /> Read Now
                  </button>
                  <button className="bg-[#e5e7eb4f] text-white lg:text-xs text-[8px] lg:px-4 px-2 lg:py-2 py-1 rounded-[4px] hover:bg-gray-600 transition flex items-center gap-2">
                    <BookmarkIcon className="lg:w-4 lg:h-4 w-3 h-3" /> Add to
                    Library
                  </button>
                </div>
              </div>
            </div>
          </Link>
        )}
        <div className="w-full lg:w-[40%] grid grid-cols-3 lg:gap-4">
          {day.data &&
            week.data &&
            all.data &&
            (tab === "week"
              ? week.data
              : tab === "day"
              ? day.data
              : all.data
            ).map((series: Series, index: number) => (
              <div
                key={series.id}
                className="cursor-pointer lg:-mt-6"
                onClick={() => handleSeriesSelect(series, index)}
              >
                <Link
                  prefetch={false}
                  href={`/series/${series.series_slug}`}
                  className={`flex flex-col   rounded-lg overflow-hidden shadow-md p-4  pb-0 pr-3 mb-4 hover:bg-[#1D1D1D] transition-colors  `}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSeriesSelect(series, index);
                  }}
                >
                  <div className={`relative `}>
                    <Image
                      alt={series.title || "Series thumbnail"}
                      loading="lazy"
                      width={128}
                      height={192}
                      src={get_file_url(series.thumbnail)}
                      className={`object-cover object-top relative z-0 rounded-[2px] w-[98px] lg:w-[160px] h-[75px] lg:h-[115px]`}
                    />
                    <div
                      className={clsx(
                        "absolute lg:-top-3 -top-2 lg:-left-3 -left-1 font-bold text-white lg:text-xs text-[11px] lg:!w-[24px] !w-[16px] lg:!h-[24px] !h-[16px] flex items-center justify-center rounded-[4px] z-[50]",
                        index === 0 &&
                          "bg-gradient-to-r from-[#FBBF24] to-[#FFEE00]",
                        index === 1 &&
                          "bg-gradient-to-r from-[#FF8A00] to-[#D50000]",
                        index === 2 &&
                          "bg-gradient-to-r from-[#EBFF00] to-[#33FF00]",
                        index === 3 &&
                          "bg-gradient-to-r from-[#FF0A0B] to-[#FF4041]",
                        index === 4 &&
                          "bg-gradient-to-r from-[#005BEA] to-[#00C6FB]",
                        index === 5 &&
                          "bg-gradient-to-r from-[#AA00FF] to-[#F200FF]"
                      )}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="py-2 flex flex-col gap-1">
                    <h5 className="text-left text-[8px] lg:text-[13px] font-bold line-clamp-1 text-[#9CA3AF]">
                      {series.title}
                    </h5>
                    <div className="flex flex-row gap-1 max-w-[100px] flex-wrap">
                      {["Fantasy", "Adventure", "Reincarnation"].map((tag) => (
                        <span
                          key={tag}
                          className="text-[5px] bg-[#161616]  px-1 lg:py-1  rounded-[4px] text-[#9CA3AF]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className=" text-[6px] text-muted-foreground flex flex-row  items-center  gap-1 line-clamp-1">
                      <Image src={ListIcon} alt="List" className="lg:w-3 lg:h-3 w-2 h-2" />{" "}
                      {series.meta.chapters_count} chapters
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const TrendingItem = ({
  series,
  index,
}: {
  series: Series;
  index: number;
}) => {
  return (
    <Link
      prefetch={false}
      href={`/series/${series.series_slug}`}
      className="flex flex-col   rounded-lg overflow-hidden border shadow-md"
    >
      <div className="relative w-full h-[120px] lg:h-[140px]">
        <Image
          alt={series.title || "Series thumbnail"}
          loading="lazy"
          width={140}
          height={200}
          src={get_file_url(series.thumbnail)}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full z-10">
          #{index + 1}
        </div>
      </div>
      <div className="p-2 flex flex-col gap-1">
        <h5 className="text-left text-sm font-bold line-clamp-1">
          {series.title}
        </h5>
        <div className="text-xs text-muted-foreground flex flex-row gap-1 line-clamp-1">
          {"Fantasy, Adventure, Reincarnation"}
        </div>
        <div className="text-xs text-muted-foreground flex flex-row gap-1 line-clamp-1">
          <ReaderIcon className="inline" /> {series.meta.chapters_count}{" "}
          chapters
        </div>
      </div>
    </Link>
  );
};

export default Trending;
