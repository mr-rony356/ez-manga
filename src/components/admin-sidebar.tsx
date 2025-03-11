'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Logo from "./logo"

import {
  Calendar,
  Home,
  Inbox,
  Plus,
  Search,
  Settings,
  Users,
  Coins,
  BarChart2,
  BookOpen,
  FileText,
  TrendingUp,
  Activity,
  Library,
  PieChart,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/auth/client"
import useAuthentication from "@/hooks/useAuth"


interface MenuItemType {
  title: string
  url: string
  icon: any
  roles?: string[]
}

interface MenuGroupType {
  title: string
  roles: string[]
  children: MenuItemType[]
  action?: {
    title: string
    icon: any
    url: string
  }
}


const menu: MenuGroupType[] = [
  {
    title: 'Dashboard',
    roles: ['Admin', 'Editor'],
    children: [
      {
        title: "Home",
        url: "/dashboard",
        roles: ["Admin", "Editor"],
        icon: Home,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        roles: ["Admin"],
        icon: BarChart2,
      },
    ]
  },
  {
    title: 'Series',
    roles: ['Admin', 'Editor'],
    action: {
      title: "Add Series",
      icon: Plus,
      url: "/dashboard/series/new"
    },
    children: [
      {
        title: "All Series",
        url: "/dashboard/series",
        icon: Library,
      },
      {
        title: "Genres",
        url: "/dashboard/genres",
        icon: FileText,
      },
      {
        title: "Analytics",
        url: "/dashboard/series/analytics",
        icon: PieChart,
      },
    ]
  },
  {
    title: 'Coins',
    roles: ['Admin', 'Editor'],
    children: [
      {
        title: "Coins Overview",
        url: "/dashboard/coins",
        icon: Coins,
      },
      {
        title: "Transactions",
        url: "/dashboard/coins/transactions",
        icon: Activity,
      },
    ]
  },
  {
    title: 'Users',
    roles: ['Admin'],
    children: [
      {
        title: "All Users",
        url: "/dashboard/users",
        icon: Users,
      },
    ]
  },
]

export function AppSidebar() {

  const { data, error, isLoading } = useAuthentication()

  const role = data?.user.role


  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-2 items-center mt-4">
        <Logo />
      </SidebarHeader>
      <SidebarSeparator className="my-2" />
      <SidebarContent className="pl-2">
        {
          !isLoading ? menu.map((group) => {
            if (!group.roles.includes(role!)) return null
            return (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                {group.action && (
                  <SidebarGroupAction asChild>
                    <Link href={group.action.url} prefetch={false}>

                      <group.action.icon className="w-5 h-5" />
                      <span className="sr-only">{group.action.title}</span>

                    </Link>
                  </SidebarGroupAction>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.children.map((item) => {
                      if (item.roles && !item.roles.includes(role!)) return null
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link href={item.url}>
                              <item.icon className="w-5 h-5" />
                              <span className="text-xs">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )

          }) :
            <SidebarMenu>
              {Array.from({ length: 3 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton />
                </SidebarMenuItem>
              ))}
              <SidebarSeparator />
              {Array.from({ length: 4 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
        }

      </SidebarContent>





    </Sidebar>
  )
}