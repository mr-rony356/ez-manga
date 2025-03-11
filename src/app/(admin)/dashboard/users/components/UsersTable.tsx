'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table'
import { useContext, useEffect } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/services'
import { Series, User } from '@/types'
import CircularProgress from '@mui/material/CircularProgress'
import Image from 'next/image'
import { UsersDashboardContext } from './Context'
import UsersPagination from './UsersPagination'
import Link from 'next/link'

export default function UsersTable() {
  const { page, role, query, orderBy, setLastPage, lastPage } = useContext(
    UsersDashboardContext
  )
  const { data, error, isLoading } = useSWR<{ data: User[]; meta: any }>(
    `/users/query?${new URLSearchParams({
      page: page.toString(),
      role,
      query,
      orderBy,
    }).toString()}`,
    fetcher
  )

  useEffect(() => {
    setLastPage(data?.meta['last_page'])
  }, [data])

  if (isLoading) {
    return (
      <div className="flex">
        <CircularProgress />
      </div>
    )
  }

  if (data) {
    const users = data.data
    return (
      <div className="space-y-2">
        <Table className="bg-background rounded">
          <TableCaption className="text-muted-foreground">{`Showing ${page} out of ${lastPage} page(s).`}</TableCaption>
          <TableHeader>
            <TableRow className="divide-gray-800 border-gray-800 text-muted-foreground">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead className="text-right">Role</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-200">
            {users.length > 0 &&
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="divide-gray-800 border-gray-800"
                >
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell className="flex flex-row gap-2 items-center">
                    {user.username}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right">{user.role}</TableCell>
                  <TableCell className="text-right">
                    <Link prefetch={false} href={`/dashboard/users/${user.id}`}>
                      <button className="bg-slate-600 text-gray-200 rounded px-6 py-2 text-[12px]">
                        Edit
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <UsersPagination />
      </div>
    )
  }
}
