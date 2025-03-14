import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '@/app/(main)/profile/components/sidebar-nav'

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/profile/me',
  },
  {
    title: 'Bookmarks',
    href: '/profile/bookmarks',
  },
  {
    title: 'Purchases',
    href: '/profile/purchases',
  },
  {
    title: 'Subscriptions',
    href: '/profile/subscriptions',
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <>
      <div className="space-y-6 p-10 pb-16 block min-h-[80vh]">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight text-gray-200">
            Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 bg-background rounded">{children}</div>
        </div>
      </div>
    </>
  )
}
