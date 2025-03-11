import { Website_Name } from "@global";
import { Metadata } from "next";
import SeriesTable from "./components/SeriesTable";
import { SeriesDashboardContextProvider as ContextProvider } from "./components/Context";
import SeriesHeader from "./components/SeriesHeader";

export const metadata: Metadata = {
    title: 'Series - ' + Website_Name
}




const SeriesDashboardIndex = () => {
    return (
        <ContextProvider>
            <div className="min-h-screen container space-y-2">
                <SeriesHeader />
                <SeriesTable />
            </div>
        </ContextProvider>
    )
}
export default SeriesDashboardIndex;