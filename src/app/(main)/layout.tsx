import "../globals.scss";
import "swiper/css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import GoogleAnalytics from "@/components/Analytics";
import Header from "@/components/Header";
import { Manrope, Montserrat } from 'next/font/google'
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import Provider from "./ThemeProvider";
import PaypalProvider from "@/components/Paypal";
import { env } from "@/env";
import AdblockBlocker from "@/components/adblock-blocker";
import { HeaderProvider } from "@/components/Header/ContextProvider";
import HeaderDrawer from "@/components/Header/Drawer";
import Content from "@/components/Header/Content";
import StoreDialog from "@/components/store-dialog";

const manrope = Manrope({
  subsets: ["latin-ext", 'latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html
      className={`${manrope.className}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <GoogleAnalytics GA_TRACKING_ID={env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      </head>
      <PaypalProvider intent="capture">
        {env.NEXT_PUBLIC_USE_ADBLOCK_BLOCKER && <AdblockBlocker />}
        <body className="h-full">
          <Provider>
            <HeaderProvider initialValue={false}>
              <div className="flex">
                <Content>
                  <Header />
                  <HeaderDrawer />
                  <StoreDialog />
                  <div>
                    {children}
                    <Footer />
                  </div>
                </Content>
              </div>
            </HeaderProvider>
            <Toaster />
          </Provider>
        </body>
      </PaypalProvider>
    </html>
  );
}
