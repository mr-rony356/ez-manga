"use client";
import { Input } from "@/components/ui/input";
import { ComicsContext } from "./ComicsContext";
import { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ComicsGenreSelector from "./ComicsGenreSelector";
import { Tag } from "@/types";

const ComicsHeader = ({ tags }: { tags: Tag[] }) => {
  const {
    query,
    setQuery,
    orderBy,
    setOrderBy,
    series_type,
    setType,
    status,
    setStatus,
  } = useContext(ComicsContext);

  const debounced = useDebounceCallback(setQuery, 1000);

  return (
    <div className="bg-[#101010] p-6 rounded-[7px]">
      <div className="flex flex-col gap-3  rounded">
        <Input
          placeholder={
            "Search a series by title, alternative name, studio, author..."
          }
          defaultValue={query}
          onChange={(e) => debounced(e.currentTarget.value)}
          className=" rounded-[5px] !py-5 placeholder:text-[16px] bg-[#151515] placeholder:text-[#A1A1AA] "
        />
        <div className="flex flex-row gap-2">
          <Select defaultValue={orderBy} onValueChange={(e) => setOrderBy(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue className="bg-gray-400" placeholder="Order by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Order by</SelectLabel>
                <SelectItem value="created_at">Created at</SelectItem>
                <SelectItem value="latest">Updated at</SelectItem>
                <SelectItem value="total_views">Views</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select defaultValue={status} onValueChange={(e) => setStatus(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue className="bg-gray-400" placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Series Status</SelectLabel>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Hiatus">Hiatus</SelectItem>
                <SelectItem value="Dropped">Dropped</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ComicsGenreSelector all_tags={tags} />
      </div>
    </div>
  );
};
export default ComicsHeader;
