import Link from "next/link";
import { HtmlHTMLAttributes, ImgHTMLAttributes } from "react";
import { Website_API } from "../../../consts";
import { tv } from "tailwind-variants";
import { get_time_diff } from "./helpers";
import Image from "next/image";
import { Chapter, Series } from "@/types";
import { get_file_url } from "@functions";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Separator } from "../ui/separator";
import { PremiumIcon } from "./premium-icon";
import { Icons } from "../Icons";
import Pin from "/public/pin.svg";
import Star from "/public/star.png";

const badge = tv({
  base: "absolute uppercase z-[1] font-semibold text-xs backdrop-blur-[1px] px-2.5 py-[7px] rounded-[5px] right-[5px] top-[5px]",
  variants: {
    color: {
      red: "bg-red-1000-67",
      green: "",
    },
  },
});

const SeriesBadge = ({
  children,
  ...props
}: HtmlHTMLAttributes<HTMLSpanElement>) => (
  <span {...props} className={badge({ color: "red" })}>
    {children}
  </span>
);

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

// Add the keyframes style to the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = keyframes;
  document.head.appendChild(style);
}

export interface SeriesItemProps {
  series: Series;
}

export interface NewSeriesItemProps {
  chapter: Chapter;
}

export const SeriesItem = ({ series }: SeriesItemProps) => {
  const {
    id,
    title,
    series_type,
    series_slug,
    thumbnail,
    free_chapters,
    paid_chapters,
    badge,
  } = series;
  return (
    <div className="flex flex-row overflow-hidden relative bg-[#101010] hover:bg-[#1D1D1D] transition-colors p-2 rounded-[8px]">
      <div
        className={`rounded flex-none overflow-hidden h-[206px] lg:min-h-[273px] w-[157px] lg:w-[208px] relative ${imageShine()}`}
      >
        <Link
          prefetch={false}
          className="block w-full"
          href={`/series/${series_slug}`}
        >
          <Image
            src={get_file_url(series.thumbnail)}
            alt={""}
            width={640}
            height={960}
            className="object-cover rounded-[4px] lg:w-[208px] w-[157px] lg:h-[273px] h-[206px]"
          />

          {/* <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/30 z-[999999] shadow-sm" />{" "}
          </div> */}
        </Link>
        {series.is_pinned && (
          <span className="rounded absolute top-1 left-1 z-50 !px-2 !py-1 bg-[#b0adad4d] flex flex-row items-center gap-2 text-[10px] text-white font-semibold">
            <Image
              src={Pin}
              alt="Pin"
              className="w-3 h-3 -mr-1"
              width={160}
              height={160}
            />
            | Pinned
          </span>
        )}
      </div>
      <div className="flex flex-col h-full  md:pr-4 lg:gap-2  px-4 lg:py-3 py-1">
        <Link prefetch={false} href={`/series/${series_slug}`}>
          <p className="text-[21px] lg:text-2xl text-foreground !text-[#A1A1A1] text-left line-clamp-1 overflow-hidden font-normal pb-1">
            {title}
          </p>
        </Link>
        <div className="space-y-0">
          <div className="flex flex-col gap-1 ">
            {/* Extra static Chapter 5 */}
            <Link
              prefetch={false}
              href={`/series/${series_slug}/chapter-5`}
              className="text-foreground bg-[#161616] visited:text-muted-foreground p-1 lg:py-[6px] rounded-[2px] pl-5"
            >
              <div className="flex justify-between items-center text-sm !text-[#D6D4D4]">
                <span className="text-[10px] lg:text-[14px] font-normal flex flex-row gap-2 items-center line-clamp-1 !font-manrope">
                  Chapter 15{" "}
                  <Separator orientation="vertical" className="h-3" />
                  <Icons.coin className="w-3 h-3" />
                </span>
                <span className="flex text-[#FF642B] justify-between items-center lg:text-[10px] text-[6px] pr-2">
                  new
                </span>
              </div>
            </Link>

            {/* Existing paid chapters from backend */}
            {paid_chapters &&
              paid_chapters.length > 0 &&
              paid_chapters.map((chapter) => {
                const timeText = get_time_diff(chapter.created_at);
                return (
                  <Link
                    prefetch={false}
                    href={`/series/${series_slug}/${chapter.chapter_slug}`}
                    key={chapter.id}
                    className="text-foreground bg-[#161616] visited:text-muted-foreground p-1 py-[6px] rounded-[2px] pl-5 lg:min-w-[250px] min-w-[190px]"
                  >
                    <div className="flex justify-between items-center text-sm !text-[#D6D4D4]">
                      <span className="text-[10px] lg:text-[14px] font-normal flex flex-row gap-2 items-center line-clamp-1 !font-manrope">
                        {chapter.chapter_name}{" "}
                        <Separator orientation="vertical" className="h-3" />
                        <Icons.coin className="w-3 h-3" />
                      </span>
                      <span
                        className={`flex justify-between items-center lg:text-[10px] text-[6px] pr-2 ${
                          timeText === "new"
                            ? "text-orange-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {timeText}
                      </span>
                    </div>
                  </Link>
                );
              })}
            <Separator className="lg:my-2 my-1 mb-2 lg:mb-0" />
          </div>
          <div className="flex flex-col gap-1 pb-1">
            {free_chapters &&
              free_chapters.length > 0 &&
              free_chapters.map((chapter) => {
                const timeText = get_time_diff(chapter.created_at);
                return (
                  <Link
                    prefetch={false}
                    href={`/series/${series_slug}/${chapter.chapter_slug}`}
                    key={chapter.id}
                    className="text-foreground bg-[#161616] visited:text-muted-foreground p-1 py-[6px] rounded-[2px] pl-5 lg:min-w-[250px] min-w-[190px]"
                  >
                    <div className="flex justify-between items-center text-sm !text-[#D6D4D4]">
                      <span className="text-[10px] lg:text-[14px] font-normal flex flex-row gap-2 items-center line-clamp-1 !font-manrope">
                        {chapter.chapter_name}{" "}
                        <Separator orientation="vertical" className="h-3" />
                      </span>
                      <span
                        className={`flex justify-between items-center lg:text-[10px] text-[6px] pr-2 ${
                          timeText === "new"
                            ? "text-[#49A64D]"
                            : "text-muted-foreground"
                        }`}
                      >
                        {timeText}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
