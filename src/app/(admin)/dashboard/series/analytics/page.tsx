import type { Metadata } from "next";
import SeriesDashboard from "./components/series-dashboard";
import { Website_Name } from "@global";

export const metadata: Metadata = {
  title: 'Series Analytics - ' + Website_Name,
}

export default function Page() {
  return (
    <>
      <SeriesDashboard />
    </>
  )
}