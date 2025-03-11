'use client'
import { User } from '@/types'
import { ReactNode, createContext, useState } from 'react'

export type SingleUserContextType = {
  user: User
}

export const SingleUserContext = createContext({} as SingleUserContextType)

export type SingleUserContextProviderProps = {
  children: ReactNode
  user: User
}

export const SingleUserContextProvider = ({
  children,
  user: initialValue,
}: SingleUserContextProviderProps) => {
  const [user, setUser] = useState<User>(initialValue)

  return (
    <SingleUserContext.Provider value={{ user }}>
      {children}
    </SingleUserContext.Provider>
  )
}
