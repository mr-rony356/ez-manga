"use client";

import { useContext, ReactNode } from "react";
import { HeaderContext } from "./ContextProvider";

export default function Content({ children }: { children: ReactNode }) {
  const { open } = useContext(HeaderContext);

  //data-[open=true]:lg:pl-64 data-[open=false]:lg:pl-[64px]

  return (
    <main
      data-open={open}
      className="w-full transition-all duration-300 ease-in "
    >
      {children}
    </main>
  );
}

export function AdminContent({ children }: { children: ReactNode }) {
  const { open } = useContext(HeaderContext);

  return (
    <main
      data-open={open}
      className="w-full transition-all duration-300 ease-in data-[open=true]:lg:pl-64 data-[open=false]:lg:pl-[64px]"
    >
      {children}
    </main>
  );
}
