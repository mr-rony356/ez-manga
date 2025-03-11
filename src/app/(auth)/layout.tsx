import '../globals.scss'
import 'react-toastify/dist/ReactToastify.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import GoogleAnalytics from '@/components/Analytics'
import { HeaderProvider } from '@/components/Header/ContextProvider'
import HeaderDrawer from '@/components/Header/Drawer'
import Header from '@/components/Header'
import Content from '@/components/Header/Content'
import { GeistSans } from 'geist/font/sans'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'
import Provider from '../(main)/ThemeProvider'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      className={`${GeistSans.className}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <GoogleAnalytics GA_TRACKING_ID="G-3NN66WSFQK" />
      </head>
      <body className="dark:bg-grey-custom h-full">
        <Provider>
          <div className="w-full">{children}</div>
          <Toaster />
        </Provider>
      </body>
    </html>
  )
}
