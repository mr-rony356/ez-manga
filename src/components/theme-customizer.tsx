'use client'

import * as React from 'react'
import {
  CheckIcon,
  InfoCircledIcon,
  MoonIcon,
  ResetIcon,
  SunIcon,
} from '@radix-ui/react-icons'
import template from 'lodash.template'
import { Paintbrush } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useConfig } from '@/hooks/use-config'
import { ThemeWrapper } from '@/components/theme-wrapper'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Theme, themes } from '@/registry/themes'
import '@/styles/mdx.css'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ThemeCustomizer() {
  const [config, setConfig] = useConfig()
  const { resolvedTheme: mode } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center space-x-2">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="md:hidden">
            <Paintbrush className="mr-2 h-4 w-4" />
            Customize
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-6 pt-0">
          <Customizer />
        </DrawerContent>
      </Drawer>
      <div className="hidden md:flex">
        <div className="mr-2 hidden items-center space-x-0.5 lg:flex">
          {mounted ? (
            <>
              {['zinc', 'rose', 'blue', 'green', 'orange'].map((color) => {
                const theme = themes.find((theme) => theme.name === color)
                const isActive = config.theme === color

                if (!theme) {
                  return null
                }

                return (
                  <TooltipProvider key={theme.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() =>
                            setConfig({
                              ...config,
                              theme: theme.name,
                            })
                          }
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs',
                            isActive
                              ? 'border-[--theme-primary]'
                              : 'border-transparent'
                          )}
                          style={
                            {
                              '--theme-primary': `hsl(${
                                theme?.activeColor[
                                  mode === 'dark' ? 'dark' : 'light'
                                ]
                              })`,
                            } as React.CSSProperties
                          }
                        >
                          <span
                            className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full bg-[--theme-primary]'
                            )}
                          >
                            {isActive && (
                              <CheckIcon className="h-4 w-4 text-white" />
                            )}
                          </span>
                          <span className="sr-only">{theme.label}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        align="center"
                        className="rounded-[0.5rem] bg-zinc-900 text-zinc-50"
                      >
                        {theme.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </>
          ) : (
            <div className="mr-1 flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Paintbrush className="mr-2 h-4 w-4" />
              Customize
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            className="z-40 w-[340px] rounded-[0.5rem] bg-white p-6 dark:bg-zinc-950"
          >
            <Customizer />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

function Customizer() {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme: setMode, resolvedTheme: mode } = useTheme()
  const [config, setConfig] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeWrapper
      defaultTheme="zinc"
      className="flex flex-col space-y-4 md:space-y-6"
    >
      <div className="flex items-start pt-4 md:pt-0">
        <div className="space-y-1 pr-2">
          <div className="font-semibold leading-none tracking-tight">
            Customize
          </div>
          <div className="text-xs text-muted-foreground">
            Pick a style and color for your components.
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-[0.5rem]"
          onClick={() => {
            setConfig({
              ...config,
              theme: 'zinc',
              radius: 0.5,
            })
          }}
        >
          <ResetIcon />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((theme) => {
              const isActive = config.theme === theme.name

              return mounted ? (
                <Button
                  variant={'outline'}
                  size="sm"
                  key={theme.name}
                  onClick={() => {
                    setConfig({
                      ...config,
                      theme: theme.name,
                    })
                  }}
                  className={cn(
                    'justify-start',
                    isActive && 'border-2 border-primary'
                  )}
                  style={
                    {
                      '--theme-primary': `hsl(${
                        theme?.activeColor[mode === 'dark' ? 'dark' : 'light']
                      })`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={cn(
                      'mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]'
                    )}
                  >
                    {isActive && <CheckIcon className="h-4 w-4 text-white" />}
                  </span>
                  {theme.label}
                </Button>
              ) : (
                <Skeleton className="h-8 w-full" key={theme.name} />
              )
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Mode</Label>
          <div className="grid grid-cols-3 gap-2">
            {mounted ? (
              <>
                <Button
                  variant={'outline'}
                  size="sm"
                  onClick={() => setMode('light')}
                  className={cn(mode === 'light' && 'border-2 border-primary')}
                >
                  <SunIcon className="mr-1 -translate-x-1" />
                  Light
                </Button>
                <Button
                  variant={'outline'}
                  size="sm"
                  onClick={() => setMode('dark')}
                  className={cn(mode === 'dark' && 'border-2 border-primary')}
                >
                  <MoonIcon className="mr-1 -translate-x-1" />
                  Dark
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
          </div>
        </div>
      </div>
    </ThemeWrapper>
  )
}
