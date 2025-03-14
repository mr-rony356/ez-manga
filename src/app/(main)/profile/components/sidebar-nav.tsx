'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link prefetch={false}
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-background hover:bg-background'
              : 'hover:bg-transparent hover:underline',
            'justify-start',
            'text-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
