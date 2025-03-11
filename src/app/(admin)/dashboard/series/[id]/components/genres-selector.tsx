'use client'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getSeries, getTags, updateSeries } from "@/services"
import { Tag } from '@/types'
import { useState, useEffect, useContext } from 'react';

export type GenreCheckboxProps = {
    id: number;
    name: string;
}

import { Dispatch, SetStateAction, createContext } from "react"
import {Checkbox} from "@/components/ui/checkbox";
import {SeriesDashboardContext} from "@/app/(admin)/dashboard/series/components/Context";
import {SingleSeriesContext} from "@/app/(admin)/dashboard/series/[id]/components/Context";

export type GenresContextType = {
    tags_ids: number[]
    setTagsIds: Dispatch<SetStateAction<number[]>>
}

export const GenresContext = createContext({} as GenresContextType)



const GenreCheckbox = ({ id, name }: GenreCheckboxProps) => {



    const { tags_ids, setTagsIds } = useContext(GenresContext)

    function handleCheck(value: boolean | string) {
        if (value === true) {
            setTagsIds((state) => [...state, id])
        } else {
            setTagsIds((state) => state.filter(genre_id => genre_id !== id))
        }
    }

    return (
        <>
            <div className="flex items-center space-x-2 pl-4 pr-4">
                <Checkbox id={`${id}`} className="rounded-sm" onCheckedChange={(value) => handleCheck(value)} checked={tags_ids.includes(id)} />
                <label
                    htmlFor={`${id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {name}
                </label>
            </div>
        </>
    )
}



export default function GenresSelector() {
    const  {  series } = useContext(SingleSeriesContext)

    const [tags, setTags] = useState<Tag[]>([])

    const [tags_ids, setTagsIds] = useState<number[]>(series.tags.map(tag => tag.id))

    useEffect(() => {
        (async () => {
            const tags = await getTags();
            setTags(tags)
        })()
    }, [])

    useEffect(() => {

        (async () => {

            await updateSeries({
                tags_ids, id: series.id
            });
        })();


    }, [tags_ids])


    return (
        <GenresContext.Provider value={{ tags_ids, setTagsIds }}>
            <Popover>
                <PopoverTrigger asChild>
                    <div className={'bg-card p-2 rounded flex flex-row justify-between'}>
                        {series.tags && <span className="line-clamp-1">{`${series.tags.map(tag => tag.name).join(', ')}...`}</span>}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-col gap-3">
                        <label className="py-1.5 px-6 text-sm font-semibold">Genres</label>
                        <ScrollArea className="h-[400px]">
                            <div className="flex flex-col gap-3">
                                {tags && tags.map(tag => <GenreCheckbox id={tag.id} name={tag.name} key={tag.id} />)}
                            </div>
                        </ScrollArea>
                    </div>
                </PopoverContent>
            </Popover>
        </GenresContext.Provider>
    )



}