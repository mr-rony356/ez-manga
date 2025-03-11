'use client'
import { Dispatch, SetStateAction, createContext, ReactNode, useState, useEffect } from 'react';

export type SeriesDashboardContextType = {
    page: number
    setPage: Dispatch<SetStateAction<number>>
    lastPage: number
    setLastPage: Dispatch<SetStateAction<number>>
    series_type: 'Comic' | 'Novel' | 'All'
    setType: Dispatch<SetStateAction<'Comic' | 'Novel' | 'All'>>
    query: string
    setQuery: Dispatch<SetStateAction<string>>
    orderBy: string
    setOrderBy: Dispatch<SetStateAction<string>>
}

export const SeriesDashboardContext = createContext({} as SeriesDashboardContextType)

export const SeriesDashboardContextProvider = ({ children }: { children: ReactNode }) => {
    const [page, setPage] = useState<number>(1)
    const [lastPage, setLastPage] = useState<number>(1)
    const [series_type, setType] = useState<SeriesDashboardContextType['series_type']>('All')
    const [query, setQuery] = useState<string>('')
    const [orderBy, setOrderBy] = useState<string>('created_at')

    return (
        <SeriesDashboardContext.Provider value={{ page, lastPage, setLastPage, setPage, series_type, setType, query, setQuery, orderBy, setOrderBy }}>
            {children}
        </SeriesDashboardContext.Provider>
    )
}

