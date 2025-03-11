'use client'
import { Dispatch, SetStateAction, createContext, ReactNode, useState, useEffect } from 'react';

export type UsersDashboardContextType = {
    page: number
    setPage: Dispatch<SetStateAction<number>>
    lastPage: number
    setLastPage: Dispatch<SetStateAction<number>>
    role: 'Reader' | 'Editor' | 'Admin' | 'All'
    setRole: Dispatch<SetStateAction<UsersDashboardContextType['role']>>
    query: string
    setQuery: Dispatch<SetStateAction<string>>
    orderBy: string
    setOrderBy: Dispatch<SetStateAction<string>>
}

export const UsersDashboardContext = createContext({} as UsersDashboardContextType)

export const UsersDashboardContextProvider = ({ children }: { children: ReactNode }) => {
    const [page, setPage] = useState<number>(1)
    const [lastPage, setLastPage] = useState<number>(1)
    const [role, setRole] = useState<UsersDashboardContextType['role']>('All')
    const [query, setQuery] = useState<string>('')
    const [orderBy, setOrderBy] = useState<string>('created_at')

    return (
        <UsersDashboardContext.Provider value={{ page, lastPage, setLastPage, setPage, role, setRole, query, setQuery, orderBy, setOrderBy }}>
            {children}
        </UsersDashboardContext.Provider>
    )
}

