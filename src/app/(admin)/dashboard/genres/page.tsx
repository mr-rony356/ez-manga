import { getTags } from "@/services"
import { Website_Name } from "@global"
import { Metadata } from "next"
import GenresDashboard from "./components/genres-dashboard";

export const metadata: Metadata = {
    title: 'Genres - ' + Website_Name
}

export default async function GenresPage() {
    const tags = await getTags();

    return (
        <div className='p-4'>
            <GenresDashboard />
        </div>
    )
}