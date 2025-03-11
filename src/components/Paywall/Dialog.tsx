"use client";

import { ChapterAPIResponse } from "@/types";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { buy_chapter } from "@/services";
import { clear_cache } from "@/lib/actions";

const BuyDialog = ({ response }: { response: ChapterAPIResponse }) => {
  const router = useRouter();

  const { chapter, series } = response;

  async function buyChapter() {
    toast.promise(buy_chapter(response.chapter.id), {
      error: "An error occured while buying the chapter!",
      success: async () => {
        await clear_cache(`${series.series_slug}-${chapter.chapter_slug}`);
        setTimeout(() => router.refresh(), 1500);
        return "The chapter was successfully bought! Redirecting...";
      },
      loading: "Buying chapter...",
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex flex-row gap-2 items-center rounded-xl bg-cyan-700 text-xs px-3 py-2 hover:bg-cyan-950 text-foreground transition-colors">
          <FontAwesomeIcon icon={faCartShopping} />
          Buy chapter
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-muted border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            You are buying the chapter {chapter.chapter_name} for{" "}
            {chapter.price} coins
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            This action cannot be undone. This will permanently cost your coins.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-red-600 text-foreground hover:bg-red-600 hover:text-muted-foreground">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={buyChapter}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BuyDialog;
