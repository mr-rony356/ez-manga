"use client";

import { Dispatch, Fragment, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { settingsState } from "./ChapterHeader";
import { useLocalStorage } from "usehooks-ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  PlusIcon,
  MinusIcon,
  FontSizeIcon,
  FontFamilyIcon,
  LineHeightIcon,
  FontStyleIcon,
} from "@radix-ui/react-icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TEXT_SIZES = ["extra-small", "small", "medium", "large", "extra-large"];
const TEXT_COLORS = ["primary", "red", "orange", "blue", "green"];
const TEXT_ALIGNMENTS = ["left", "right", "center", "justify"];
const TEXT_LEADINGS = ["none", "tight", "snug", "normal", "relaxed", "loose"];
const FONT_FAMILIES = ["sans", "serif", "mono", "roboto"];
const TEXT_SPACING = ["1em", "2em", "4em", "6em", "8em", "10em"];

const FONT_FAMILY = [
  {
    label: "Montserrat",
    class: "montserrat",
  },
  {
    label: "Open Sans",
    class: "open-sans",
  },
  {
    label: "Times New Roman",
    class: "times-new-roman",
  },
  {
    label: "Helvetica",
    class: "helvetica",
  },
  {
    label: "Baskervville",
    class: "baskervville-regular",
  },
  {
    label: "Century Schoolbook",
    class: "century-schoolbook",
  },
  {
    label: "Comic Sans",
    class: "comic-sans",
  },
  {
    label: "Generic Sans",
    class: "font-sans",
  },
  {
    label: "Generic Serif",
    class: "font-serif",
  },
  {
    label: "Generic Mono",
    class: "font-mono",
  },
  {
    label: "Roboto",
    class: "font-roboto",
  },
];

const READER_THEMES = [
  "bg-background text-foreground",
  "bg-amber-200 light:text-foreground dark:text-background",
  "bg-slate-300 light:text-foreground dark:text-background",
  "bg-amber-100 text-zinc-800",
  "bg-neutral-700",
];

export const ReaderSettings = () => {
  const [open, setOpen] = useAtom(settingsState);
  const [align, setAlign] = useLocalStorage("align", "left");
  const [color, setColor] = useLocalStorage("color", "primary");
  const [size, setSize] = useLocalStorage<number>("size", 18);
  const [height, setHeight] = useLocalStorage<number>("height", 24);
  const [leading, setLeading] = useLocalStorage("leading", "normal");
  const [font, setFont] = useLocalStorage("font", "baskervville-regular");
  const [theme, setTheme] = useLocalStorage(
    "reader_theme",
    "bg-background text-foreground"
  );

  const [spacing, setSpacing] = useLocalStorage("spacing", "0px");

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed  inset-0 bg-background/75 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed  inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-hidden bg-background py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-base font-semibold leading-6 text-foreground">
                        Reader Settings
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-xs leading-none">
                            Reader settings
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Style the text the way you want.
                          </p>
                        </div>
                        <div className="flex flex-row flex-wrap gap-x-2 gap-y-4 lg:gap-4">
                          <div className="col-span-4 lg:col-span-2 flex flex-row justify-between items-center gap-4">
                            <ToggleGroup
                              value={align}
                              type={"single"}
                              onValueChange={(value: string) => setAlign(value)}
                            >
                              <ToggleGroupItem
                                className={"border"}
                                value={"left"}
                              >
                                <TextAlignLeftIcon />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                className={"border"}
                                value={"right"}
                              >
                                <TextAlignRightIcon />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                className={"border"}
                                value={"center"}
                              >
                                <TextAlignCenterIcon />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                className={"border"}
                                value={"justify"}
                              >
                                <TextAlignJustifyIcon />
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                          <div className="flex col-span-4 lg:col-span-2 flex-row items-center gap-2">
                            <Label htmlFor="color" className="text-xs">
                              <FontSizeIcon />
                            </Label>
                            <div
                              className={"flex gap-2 items-center flex-wrap"}
                            >
                              <Button
                                onClick={() => setSize((size) => size + 1)}
                                variant={"outline"}
                              >
                                <PlusIcon />
                              </Button>
                              <Button
                                onClick={() =>
                                  setSize((size) => Math.max(1, size - 1))
                                }
                                variant={"outline"}
                              >
                                <MinusIcon />
                              </Button>
                            </div>
                          </div>
                          <div className="col-span-4 w-full lg:col-span-2 flex flex-row justify-start items-center gap-4">
                            <Label htmlFor="size" className="text-xs">
                              <FontStyleIcon />
                            </Label>
                            <ToggleGroup
                              value={theme}
                              type={"single"}
                              className={"flex-wrap w-full justify-start"}
                              onValueChange={(value: string) => setTheme(value)}
                            >
                              {READER_THEMES.map((theme, index) => (
                                <ToggleGroupItem
                                  key={index}
                                  className={`border ${theme.replaceAll(
                                    "_",
                                    " "
                                  )} `}
                                  value={theme}
                                >
                                  <strong>A</strong>a
                                </ToggleGroupItem>
                              ))}
                            </ToggleGroup>
                          </div>

                          <div className="flex order-3 lg:order-4 col-span-4 flex-row items-center gap-4">
                            <Label htmlFor="color" className="text-xs">
                              <LineHeightIcon />
                            </Label>
                            <div className={"flex gap-2 items-center"}>
                              <Button
                                onClick={() => setHeight((size) => size + 1)}
                                variant={"outline"}
                              >
                                <PlusIcon />
                              </Button>
                              <Button
                                onClick={() =>
                                  setHeight((size) => Math.max(1, size - 1))
                                }
                                variant={"outline"}
                              >
                                <MinusIcon />
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-4 col-span-4 items-center order-3 ">
                            <Label htmlFor="size" className="text-xs">
                              <FontFamilyIcon />
                            </Label>
                            <Select
                              value={font}
                              onValueChange={(value) => setFont(value)}
                            >
                              <SelectTrigger className="col-span-2 w-full text-xs">
                                <SelectValue placeholder="Select font family">
                                  <span
                                    className={cn(
                                      (
                                        FONT_FAMILY.find(
                                          (f) => f.class === font
                                        ) || {}
                                      ).class,
                                      "pr-4"
                                    )}
                                  >
                                    {
                                      (
                                        FONT_FAMILY.find(
                                          (f) => f.class === font
                                        ) || {}
                                      ).label
                                    }
                                  </span>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {FONT_FAMILY.map((font, index) => (
                                    <SelectItem
                                      key={font.class}
                                      value={font.class}
                                      className={font.class}
                                    >
                                      {font.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
