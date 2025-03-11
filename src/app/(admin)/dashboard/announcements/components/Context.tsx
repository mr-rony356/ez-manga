'use client'
import { Dispatch, SetStateAction, createContext, ReactNode, useState, useEffect } from 'react';

export type AnnouncementsDashboardContextType = {
    page: number
    setPage: Dispatch<SetStateAction<number>>
    lastPage: number
    setLastPage: Dispatch<SetStateAction<number>>
    query: string
    setQuery: Dispatch<SetStateAction<string>>
    orderBy: string
    setOrderBy: Dispatch<SetStateAction<string>>
}

export const AnnouncementsDashboardContext = createContext({} as AnnouncementsDashboardContextType)

export const AnnouncementsDashboardContextProvider = ({ children }: { children: ReactNode }) => {
    const [page, setPage] = useState<number>(1)
    const [lastPage, setLastPage] = useState<number>(1)
    const [query, setQuery] = useState<string>('')
    const [orderBy, setOrderBy] = useState<string>('created_at')

    return (
        <AnnouncementsDashboardContext.Provider value={{ page, lastPage, setLastPage, setPage, query, setQuery, orderBy, setOrderBy }}>
            {children}
        </AnnouncementsDashboardContext.Provider>
    )
}

