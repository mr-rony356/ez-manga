'use client'
import {Series} from '@/types'
import {createContext, useState} from 'react'

export type ComicsContextType = {
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    comics: Series[]
    setComics: React.Dispatch<React.SetStateAction<Series[]>>
}

export const ComicsContext = createContext({} as ComicsContextType)

export const ComicsContextProvider = ({
                                          children,
                                          initialValue,
                                      }: {
    children: React.ReactNode
    initialValue: Series[]
}) => {
    const [page, setPage] = useState<number>(1)
    const [comics, setComics] = useState<Series[]>(initialValue)

    return (
        <ComicsContext.Provider
            value={{
                page,
                setPage,
                comics,
                setComics,
            }}
        >
            {children}
        </ComicsContext.Provider>
    )
}