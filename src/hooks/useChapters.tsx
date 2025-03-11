'use client';
import useSWR from "swr";
import { fetcher } from "@/services";
import { useParams } from "next/navigation";
import { Series } from "@/types";

export default function useChapters() {

    const { series, chapter } = useParams();





    const { data, isLoading, error } = useSWR<Series>(`/series/${series}`, fetcher);



    return {
        data,
        isLoading,
        error,
        series,
        chapter
    }

}