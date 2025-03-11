"use client";
import { EditableSeries, Tag, User } from "@/types";
import { useAutocomplete } from "@mui/material";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ComicsContext } from "./ComicsContext";

type Series = {
  id: number;
  title: string;
};

const ComicsGenreSelector = ({ all_tags }: { all_tags: Tag[] }) => {
  const { tags, setTags } = useContext(ComicsContext);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "editable-series-hook",
    multiple: true,
    options: all_tags,
    isOptionEqualToValue: (option, value) => {
      if (option.id === value.id) return true;
      else return false;
    },
    getOptionLabel: (option) => option.name,
    autoComplete: true,
    onChange: (event, value) => handleValue(value),
  });

  const handleValue = (value: Tag[]) => {
    const only_ids = value.map((value) => value.id);
    setTags(only_ids);
  };

  return (
    <div className="flex-col gap-4">
      <div className="text-foreground relative text-md">
        <div {...getRootProps()}>
          <div
            ref={setAnchorEl}
            className="bg-[#1b1b1b] rounded p-2 flex flex-row flex-wrap"
          >
            <ul className="flex flex-row gap-2 flex-wrap">
              {value.map((option: Tag, index: number) => {
                const { onDelete, key, ...props } = getTagProps({ index });
                return (
                  <li
                    className="flex flex-row text-xxs py-1 px-4 bg-foreground rounded gap-x-3 items-center"
                    key={key}
                    {...props}
                  >
                    <span>{option.name}</span>
                    <Cross1Icon onClick={onDelete} />
                  </li>
                );
              })}
            </ul>
            <Input
              className="w-fit ml-4 p-0 bg-transparent focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 border-0 placeholder:text-[15px] placeholder:text-[#A1A1AA]"
              {...getInputProps()}
              placeholder={"Filter by genre"}
            />
          </div>
        </div>
        {groupedOptions.length > 0 ? (
          <ul
            className="w-full absolute bg-[rgb(20,20,20)] overflow-auto max-h-[250px] rounded shadow-[rgba(0,0,0,0.15)_0px_2px_8px] z-[1] mx-auto my-0 p-0 inset-x-0"
            {...getListboxProps()}
          >
            {(groupedOptions as Tag[]).map((option, index) => (
              <li
                {...getOptionProps({ option, index })}
                key={option.name}
                className={`py-[7px] px-[12px] flex aria-[selected='true']:font-semibold aria-[selected='true']:bg-[#2b2b2b] hover:bg-[#003b57] hover:cursor-pointer`}
              >
                <span className="flex-grow grow-1">{option.name}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default ComicsGenreSelector;
