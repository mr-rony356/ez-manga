'use client'
import { ThemeProvider } from 'next-themes'
import { Provider as JotaiProvider } from 'jotai'
import { ParallaxProvider } from 'react-scroll-parallax'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <ParallaxProvider scrollAxis="vertical">
        <JotaiProvider>{children}</JotaiProvider>
      </ParallaxProvider>
    </ThemeProvider>
  )
}
