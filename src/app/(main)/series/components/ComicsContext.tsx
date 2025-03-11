'use client'
import { createContext, useState } from 'react'

export type ComicsContextType = {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  lastPage: number
  setLastPage: React.Dispatch<React.SetStateAction<number>>
  series_type: 'Comic' | 'Novel' | 'All'
  setType: React.Dispatch<React.SetStateAction<'Comic' | 'Novel' | 'All'>>
  query: string
  setQuery: React.Dispatch<React.SetStateAction<string>>
  orderBy: string
  setOrderBy: React.Dispatch<React.SetStateAction<string>>
  order: string
  setOrder: React.Dispatch<React.SetStateAction<string>>
  tags: number[]
  setTags: React.Dispatch<React.SetStateAction<number[]>>
  perPage: number
  setPerPage: React.Dispatch<React.SetStateAction<number>>
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
}

export const ComicsContext = createContext({} as ComicsContextType)

export const ComicsContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(2)
  const [series_type, setType] =
    useState<ComicsContextType['series_type']>('Comic')
  const [query, setQuery] = useState<string>('')
  const [orderBy, setOrderBy] = useState<string>('created_at')
  const [order, setOrder] = useState<string>('desc')
  const [status, setStatus] = useState<string>('All')
  const [tags, setTags] = useState<number[]>([])
  const [perPage, setPerPage] = useState<number>(21)
  return (
    <ComicsContext.Provider
      value={{
        page,
        lastPage,
        setLastPage,
        setPage,
        series_type,
        setType,
        query,
        setQuery,
        orderBy,
        setOrderBy,
        order,
        setOrder,
        tags,
        setTags,
        perPage,
        setPerPage,
        status,
        setStatus,
      }}
    >
      {children}
    </ComicsContext.Provider>
  )
}
