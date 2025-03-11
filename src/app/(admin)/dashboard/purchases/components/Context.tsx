'use client'
import {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'

export type LogsDashboardContextType = {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  lastPage: number
  setLastPage: Dispatch<SetStateAction<number>>
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  orderBy: string
  setOrderBy: Dispatch<SetStateAction<string>>
  from: Date
  setFrom: Dispatch<SetStateAction<Date>>
  to: Date
  setTo: Dispatch<SetStateAction<Date>>
}

export const LogsDashboardContext = createContext(
  {} as LogsDashboardContextType
)

export const UsersDashboardContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [query, setQuery] = useState<string>('')
  const [orderBy, setOrderBy] = useState<string>('created_at')
  const [from, setFrom] = useState<Date>(new Date('2021-01-01'))
  const [to, setTo] = useState<Date>(new Date())

  return (
    <LogsDashboardContext.Provider
      value={{
        from,
        setFrom,
        to,
        setTo,
        page,
        lastPage,
        setLastPage,
        setPage,
        query,
        setQuery,
        orderBy,
        setOrderBy,
      }}
    >
      {children}
    </LogsDashboardContext.Provider>
  )
}
