"use client";

import type { Series } from "@/types";
import { get_file_url } from "../../../functions";
import Image from "next/image";
import Link from "next/link";
import completedStar from "/public/completedStart.svg";

export function CompletedSeries({ series }: { series: Series[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row lg:gap-2 gap-1 items-center lg:mb-6 mb-4">
        <Image
          src={completedStar}
          alt="Star"
          className="lg:w-10 lg:h-10 w-8 h-6"
          width={20}
          height={20}
        />
        <h1 className="lg:text-5xl text-[19px] font-bold uppercase">
          Our completed{" "}
          <span className="text-orange-500 lg:text-2xl text-[14px] capitalize">
            Series !
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-5 lg:gap-4 gap-2 px-3 lg:px-0">
        {series.length > 0 &&
          series.map((series) => (
            <div
              key={series.id}
              className="flex flex-col lg:mb-10 mb-4 lg:gap-6 gap-2"
            >
              <Link
                prefetch={false}
                href={`/series/${series.series_slug}`}
                className="relative"
              >
                <Image
                  loading="lazy"
                  alt=""
                  height={300}
                  width={220}
                  className="w-full aspect-[72/97] object-cover rounded-[6px]"
                  src={get_file_url(series.thumbnail)}
                />
              </Link>
              <div className="flex flex-col gap-1 text-left">
                <h2 className="lg:text-[27px]  !font-manrope  text-[10px] !text-[#C6C6C6] font-normal line-clamp-1">
                  {series.title}
                </h2>
                <p className="text-[#C9C9CC] text-[8px] lg:text-[18px] !font-manrope font-normal">
                  Completed with{" "}
                  <span className="text-orange-500">120 chapter</span>{" "}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
