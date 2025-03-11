import type { Metadata } from "next";
import { ComicsContextProvider } from "../Context";
import { Comics } from "./components/comics";
import { Website_Local_API } from "@global";


export const metadata: Metadata = {
  title: "Latest updates - EZ Manga",
}

export default async function Page() {

  const comics = await (
    await fetch(
      `${Website_Local_API}/latest/comics`,
      {
        next: {
          tags: ["home"],
        },
      }
    )
  ).json()

  return (
    <div className='container mt-4'>
      <ComicsContextProvider initialValue={comics.data}>
        <Comics />
      </ComicsContextProvider>
    </div>
  )
}