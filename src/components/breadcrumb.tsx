'use client'
import {
  Breadcrumb as Root,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumb({ page_name }: { page_name?: string }) {
  const route = usePathname()
  function generatePaths(route: string) {
    const paths: { path: string; label: string }[] = []
    const unparsed_paths = route.split('/').filter((path) => path !== '')
    unparsed_paths.forEach((path, index) => {
      if (index == 0)
        return paths.push({
          path: `/${path}`,
          label: `${path.charAt(0).toUpperCase()}${path.slice(1)}`,
        })
      var parsed_path: string = ''
      for (let i = 0; i <= index; i++) {
        parsed_path += `/${unparsed_paths[i]}`
      }
      return paths.push({
        path: parsed_path,
        label: `${path.charAt(0).toUpperCase()}${path.slice(1)}`,
      })
    })
    return paths
  }
  const paths = generatePaths(route)
  return (
    <Root className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link prefetch={false} href="/">Homepage</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {paths.map((path, index) => {
          if (index != paths.length - 1) {
            return (
              <div className="flex flex-row gap-2 items-center" key={path.path}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link prefetch={false} href={path.path}>{path.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </div>
            )
          } else {
            return (
              <BreadcrumbItem key={path.path}>
                <BreadcrumbPage>
                  {page_name ? page_name : path.label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )
          }
        })}
      </BreadcrumbList>
    </Root>
  )
}
