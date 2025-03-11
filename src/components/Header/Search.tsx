"use client";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import { fetcher } from "@/services";
import { Series } from "@/types";
import { useDebounceCallback, useOnClickOutside } from "usehooks-ts";
import CircularProgress from "@mui/material/CircularProgress";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { get_file_url } from "@functions";
import Image from "next/image";

export default function HeaderSearch() {
  const rootRef = useRef(null);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [series, setSeries] = useState<Series[]>([]);
  const { data, isLoading, error } = useSWR<{ data: Series[] }>(
    `/query?${new URLSearchParams({ adult: "true", query_string: query })}`,
    fetcher
  );
  const debounced = useDebounceCallback(setQuery, 1000);

  useOnClickOutside(rootRef, () => {
    setQuery("");
    setSeries([]);
    setOpen(false);
  });

  useEffect(() => {
    if (query === "") setSeries([]);
    if (data && query !== "") {
      setSeries(data.data);
      setOpen(true);
    }
  }, [data]);

  return (
    <div
      className="rounded-xl overflow-hidden w-full lg:w-fit border"
      ref={rootRef}
    >
      <div className="flex">
        <div className="text-white w-full lg:w-fit rounded relative text-md px-2 bg-[#1B1B1B]">
          <div>
            <div className="flex flex-row gap-2 items-center justify-center relative z-[2] w-full">
              <FontAwesomeIcon icon={faSearch} className="text-[#545454]" />
              <input
                className="bg-transparent w-full text-xs flex flex-row items-center  font-semibold text-[#fafafa] placeholder:text-[#545454] placeholder:text-xs h-[40px] !py-[6px] px-[6px] min-w-[30px] flex-grow grow-1 border-0  focus:outline-none focus:ring-0"
                onChange={(e) => debounced(e.target.value)}
                placeholder={"Search "}
              />
              {isLoading && (
                <CircularProgress
                  color="inherit"
                  size="1em"
                  className="absolute right-[0]"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Transition
        show={open}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute bg-background p-4 top-[60px] shadow-md rounded w-[300px]">
          <ul className="flex flex-col text-foreground gap-2 w-full">
            {series.length > 0 &&
              series.map((s) => {
                return (
                  <Link
                    prefetch={false}
                    key={s.id}
                    href={`/series/${s.series_slug}`}
                  >
                    <li className="flex items-center gap-2">
                      <div className="relative max-w-[32px] max-h-12 overflow-hidden rounded shrink-0">
                        <Image
                          width={32}
                          height={48}
                          alt=""
                          src={get_file_url(s.thumbnail)}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="text-xs">{s.title}</p>
                        <p className="text-xxs text-muted-foreground">
                          {s.meta.chapters_count} chapters
                        </p>
                      </div>
                    </li>
                  </Link>
                );
              })}
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export interface SeriesOptionType {
  title: string;
  thumbnail: string;
  series_slug: string;
  series_type: string;
  description: string;
  meta: {
    total_chapters: string;
  };
  alternative_names: string;
}
