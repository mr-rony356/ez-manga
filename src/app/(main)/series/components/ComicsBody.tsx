"use client";
import { useContext, useEffect, useState } from "react";
import { ComicsContext } from "./ComicsContext";
import { Series } from "@/types";
import useSWR from "swr";
import { fetcher } from "@/services";
import { get_file_url } from "@functions";
import Image from "next/image";
import Link from "next/link";
import { CircularProgress, Rating } from "@mui/material";
import { Button } from "@/components/ui/button";
import ListIcon from "/public/list.svg";
import { Star } from "lucide-react";

const ComicsBody = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const {
    page,
    series_type,
    query,
    orderBy,
    setLastPage,
    lastPage,
    order,
    tags,
    perPage,
    setPage,
    status,
  } = useContext(ComicsContext);
  const { data, error, isLoading, mutate } = useSWR<{
    data: Series[];
    meta: any;
  }>(
    `/query?page=${page}&${new URLSearchParams({
      perPage: perPage.toString(),
      series_type,
      query_string: query,
      orderBy,
      adult: "true",
      status,
      tags_ids: `[${tags.join(",")}]`,
    }).toString()}`,
    fetcher
  );

  useEffect(() => {
    if (data && data.data && data.meta) {
      if (page > 1) {
        setLastPage(data.meta.last_page);
        setSeries([...series, ...data.data]);
      } else {
        setLastPage(data.meta.last_page);
        setSeries(data.data);
      }
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [series_type, query, orderBy, order, tags, perPage, status]);

  return (
    <div className="flex flex-col gap-2 bg-[#191919] p-6 rounded-[7px] mt-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 ">
        {series.length > 0 &&
          series.map((series) => {
            return (
              <Link
                prefetch={false}
                key={series.id}
                href={`/series/${series.series_slug}`}
              >
                <div className="bg-background rounded-[6.4px] flex gap-3 border mb-2 max-h-[207px] overflow-hidden  hover:bg-[#1d1d1d] transition-all duration-200">
                  <div className="rounded flex-none overflow-hidden h-full min-h-[146px] lg:min-h-[205px] w-[100px] lg:w-[217px] relative">
                    <div className="block h-full w-full">
                      <div className="absolute inset-0">
                        <Image
                          src={get_file_url(series.thumbnail)}
                          alt={""}
                          width={640}
                          height={960}
                          className="object-cover h-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-fit grow-0 pr-2 pt-2">
                    <h1 className="text-foreground font-bold text-base line-clamp-1 text-[15px]">
                      {series.title}
                    </h1>
                    <span className="text-muted-foreground text-xxs line-clamp-1">
                      ({series.alternative_names})
                    </span>
                    <div className="flex flex-row gap-2 items-center">
                      <Rating
                        value={series.rating}
                        readOnly
                        precision={0.1}
                        size={"small"}
                      />
                      {/* {
                        series.rating>
                      }
                      <Star size={8} /> */}
                      <span className="text-[8px] font-[300] flex items-center gap-1 text-[#9DA3AF]">
                        4.5 ( 2.2k reviews )
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[8px] font-normal flex items-center gap-1">
                        {series.status === "Ongoing" && (
                          <>
                            <span className="w-[5px] h-[5px] bg-[#4CAF50] rounded-full"></span>
                            <span className="text-[#4CAF50]">
                              {series.status}
                            </span>
                          </>
                        )}
                        {series.status === "Dropped" && (
                          <>
                            <span className="w-[5px] h-[5px] bg-red-500 rounded-full"></span>
                            <span className="text-red-500">
                              {series.status}
                            </span>
                          </>
                        )}
                        {series.status === "Completed" && (
                          <>
                            <span className="w-[5px] h-[5px] bg-yellow-500 rounded-full"></span>
                            <span className="text-yellow-500">
                              {series.status}
                            </span>
                          </>
                        )}
                      </p>
                      <span className="text-muted-foreground hidden lg:flex flex-row text-[8px] gap-1 items-center line-clamp-1">
                        <Image src={ListIcon} alt="List" className="w-2 h-2" />{" "}
                        {parseInt(series.meta.chapters_count) <= 1
                          ? `${series.meta.chapters_count} chapter`
                          : `${series.meta.chapters_count} chapters`}
                      </span>
                    </div>
                    <p className="text-[#BCC0C7] text-[9px] line-clamp-6 font-[300]">
                      {series.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      {page < lastPage && (
        <Button
          className="flex flex-row gap-2 items-center bg-[#121212] text-white rounded-[4px] mt-2 !py-6"
          onClick={() => setPage(page + 1)}
        >
          Load more{" "}
          {isLoading && <CircularProgress color="inherit" size="1em" />}
        </Button>
      )}
    </div>
  );
};
export default ComicsBody;
