'use client'
import { Fragment, useContext, useEffect, useState } from 'react'
import { Discord_URL } from '@global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Transition } from '@headlessui/react'
import { useTheme } from 'next-themes'
import { HeaderContext } from '../ContextProvider'
import Link from 'next/link'
import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import { Separator } from '@/components/ui/separator'

export default function DrawerFooter() {
  const { theme, setTheme } = useTheme()
  const { open, setOpen } = useContext(HeaderContext)

  const [mounted, setMounted] = useState<boolean>(false)



  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className='flex flex-col gap-2'>
      <div className="flex flex-col gap-2">
        <span className="w-full h-[1px] bg-background"></span>
        <div className="flex flex-row gap-2 group-data-[open=false]:justify-center group-data-[open=true]:justify-between">
          <Link prefetch={false}
            href={Discord_URL}
            className="text-xs flex flex-row gap-2 items-center p-2 hover:bg-background text-muted-foreground transition-all ease-in rounded"
          >
            <FontAwesomeIcon icon={faDiscord as IconProp} />
            <Transition.Root
              show={open}
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <span className="group-data-[open=false]:opacity-0">Discord</span>
            </Transition.Root>
          </Link>
          {mounted && <button
            onClick={() =>
              theme === 'dark' ? setTheme('light') : setTheme('dark')
            }
            className="text-muted-foreground text-xs flex flex-row gap-2 items-center p-2 hover:bg-background transition-all ease-in rounded group-data-[open=false]:hidden"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>}
        </div>
      </div>
      <Separator />
    </div>
  )
}
