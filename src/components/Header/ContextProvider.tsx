'use client'
import { User } from '@/types'
import {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'
import { atom, useAtom } from 'jotai'
import { useCookie } from 'react-use'

export type HeaderContextType = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const HeaderContext = createContext({} as HeaderContextType)

export const HeaderProvider = ({
  children,
  initialValue,
}: {
  children: ReactNode
  initialValue: boolean
}) => {
  const [open, setOpen] = useState<boolean>(initialValue)
  const [cookie, updateCookie, deleteCookie] = useCookie('sidebar')

  useEffect(() => {
    updateCookie(open.toString())
  }, [open])

  return (
    <HeaderContext.Provider value={{ open, setOpen }}>
      {children}
    </HeaderContext.Provider>
  )
}
