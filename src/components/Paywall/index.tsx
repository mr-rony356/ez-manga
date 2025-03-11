"use client";

import { ChapterAPIResponse } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHouse } from "@fortawesome/free-solid-svg-icons";
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
import Link from "next/link";
import BuyDialog from "./Dialog";

export default function Paywall({ chapter }: { chapter: ChapterAPIResponse }) {
  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col gap-2 items-center justify-center rounded-lg shadow-lg bg-background px-4 py-8 w-fit">
        <h5 className="text-foreground text-lg text-center lg:text-xl font-bold">
          This chapter is premium!
        </h5>
        <p className="text-muted-foreground text-xs text-center lg:text-base">
          You have to be a subscriber or buy this chapter if you want to have
          access to this content.
        </p>
        <div className="flex flex-row gap-2">
          <BuyDialog response={chapter} />

          <Link prefetch={false} href={`/series/${chapter.series.series_slug}`}>
            <button className="flex flex-row gap-2 items-center rounded-xl bg-muted text-xs px-3 py-2 text-foreground transition-colors">
              <FontAwesomeIcon icon={faHouse} />
              Go back to series
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
