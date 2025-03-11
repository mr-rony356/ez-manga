import { Website_Name } from "@global";
import clsx from "clsx";
import Link from "next/link";
import type { PropsWithoutRef } from "react";

export default function Logo({ className }: { className?: string }) {

  return (

    <Link prefetch={false} href={"/"} className={"shrink-0 flex flex-row gap-2 items-center"}>
      <img
        src="/wetried_only.png"
        className={clsx("h-6 shrink-0 mr-3  lg:group-data-[open=false]:duration-500  opacity-100 lg:group-data-[open=false]:animate-out lg:group-data-[open=false]:slide-out-to-left-full", className)}
        alt={`${Website_Name} Logo`}
      />
    </Link>
  )
}