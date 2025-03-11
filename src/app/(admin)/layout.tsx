import "../globals.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { HeaderProvider } from "@/components/Header/ContextProvider";
import Header, { AdminHeader } from "@/components/Header";
import { GeistSans } from "geist/font/sans";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import Provider from "../(main)/ThemeProvider";
import PaypalProvider from "@/components/Paypal";
import { redirect } from "next/navigation";
import { AuthContextProvider } from "@/auth/client";
import { auth } from "@/auth/server";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin-sidebar"

const AllowedRoles = ["Admin", "Editor"];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await auth();
  if (!AllowedRoles.includes(user!.role)) redirect("/");
  return (
    <html
      className={`${GeistSans.className}`}
      lang="en"
      suppressHydrationWarning
    >
      <head></head>
      <AuthContextProvider userData={user}>
        <PaypalProvider intent="capture">
          <body className="h-full">
            <Provider>
              <SidebarProvider>
                <AppSidebar />
                <main className="flex flex-col w-full">

                  <AdminHeader />

                  {children}
                  <Footer />

                </main>
              </SidebarProvider>
              <Toaster />
            </Provider>
          </body>
        </PaypalProvider>
      </AuthContextProvider>
    </html>
  );
}
