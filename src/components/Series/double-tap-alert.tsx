'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { getCookie, hasCookie, setCookie } from 'cookies-next'
import { useEffect, useState } from 'react'

export function DoubleTapAlert() {
  const [seen, setSeen] = useState<boolean>(false)

  const seenAlert = hasCookie('seenDoubleTapAlert')

  useEffect(() => {
    if (!seenAlert) {
      setSeen(true)
      setCookie('seenDoubleTapAlert', 'true', {
        maxAge: 60 * 60 * 24 * 365,
      })
    }
  }, [])

  return (
    <AlertDialog open={seen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tips!</AlertDialogTitle>
          <AlertDialogDescription>
            You can toggle the navbar state by double tapping the screen if you
            are on mobile or double clicking if you are on desktop. Be aware
            that you cannot hide it if you are at the top of the page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setSeen(false)}>
            I understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
