"use client";
import { Chapter } from "@/types";

import { buy_chapter, fetcher } from "@/services";
import {
  faCircleInfo,
  faHeadphones,
  faInfo,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactAudioPlayer from "react-audio-player";

import useSWR from "swr";

import { cn } from "@/lib/utils";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import API from "@/services/api";
import useAuthentication from "@/hooks/useAuth";

interface ChaptersListProps {
  series_slug: string;
}

const AudioChaptersList = ({ series_slug }: ChaptersListProps) => {
  const [open, setOpen] = React.useState(false);
  const [dialogState, setDialog] = React.useState<boolean>(false);
  const [value, setValue] = React.useState("");
  const { data, isLoading } = useSWR<Chapter[]>(
    `/chapter/all/${series_slug}`,
    fetcher
  );

  const [audio, setAudio] = React.useState<string>("");

  const chapters = data;

  const { data: user } = useAuthentication();

  const audio_chapters = user?.user.audio_chapters;

  async function buy_audio_chapter() {
    setDialog(false);
    toast.promise(API.post("/audio/buy", { chapter_id: value }), {
      loading: "Purchasing...",
      success: "Audio chapter purchased successfully.",
      error: "Failed to purchase audio chapter.",
    });
  }

  return (
    <div className={"flex flex-col gap-2 py-4"}>
      {audio !== "" && (
        <ReactAudioPlayer src={audio} controls className={"w-full"} />
      )}
      <h5 className={"text-muted-foreground font-semibold"}>My audios</h5>
      <ul className={"flex flex-col gap-2 "}>
        {user &&
          user.isLoggedIn &&
          user.user.audio_chapters.length > 0 &&
          user.user.audio_chapters.map((audio, index) => {
            return (
              <li
                key={index}
                className={
                  "flex flex-row gap-2 items-center p-2 bg-muted-foreground/10 rounded-lg"
                }
              >
                <Button
                  variant={"outline"}
                  onClick={() => setAudio(audio.url ? audio.url : "")}
                  className={"flex flex-row gap-1 text-xxs"}
                >
                  <FontAwesomeIcon icon={faPlay} /> Play
                </Button>
                <span className={"text-xxs font-semibold"}>
                  {audio.chapter_title
                    ? `${audio.chapter_name} - ${audio.chapter_title} - ${audio.series.title}`
                    : `${audio.chapter_name}  - ${audio.series.title}`}
                </span>
              </li>
            );
          })}
      </ul>
      <span className={"text-muted-foreground"}>
        Upon request, you can order audio chapters, which will be generated
        through AI. Some chapters might not be ready at the moment of the
        purchase, but they will be ready in a few minutes.
      </span>
      <div className={"flex flex-col gap-2 md:flex-row"}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full md:w-[200px] justify-between"
            >
              {value
                ? chapters?.find((chapter) => chapter.id.toString() === value)
                    ?.chapter_name
                : "Select chapter..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search chapter..." />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {chapters &&
                    chapters.length > 0 &&
                    chapters.map((chapter) => (
                      <CommandItem
                        key={chapter.id}
                        value={chapter.id.toString()}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === chapter.id.toString()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {chapter.chapter_name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          variant={"secondary"}
          className={"bg-purple-800"}
          onClick={() => setDialog(true)}
        >
          <FontAwesomeIcon icon={faHeadphones} className={"mr-1"} />
          Order audio chapter!
        </Button>
      </div>
      <Dialog open={dialogState} onOpenChange={setDialog}>
        <DialogContent>
          <DialogTitle>Order an audio chapter</DialogTitle>
          <DialogDescription>
            This purchase will cost you{" "}
            {chapters?.find((chapter) => chapter.id.toString() === value)
              ?.price! + 6}{" "}
            credits. Are you sure you want to proceed?
            <div className={"flex flex-row gap-1 text-xxs items-center"}>
              <FontAwesomeIcon icon={faCircleInfo} /> You will be notified upon
              completion.
            </div>
          </DialogDescription>
          <DialogFooter>
            <DialogClose />
            <Button className={"w-full"} onClick={buy_audio_chapter}>
              Order now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { AudioChaptersList };
