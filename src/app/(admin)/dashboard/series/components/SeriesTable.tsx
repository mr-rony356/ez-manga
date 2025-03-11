'use client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useContext, useEffect } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/services'
import { Series } from '@/types'
import CircularProgress from '@mui/material/CircularProgress'
import Image from 'next/image'
import { SeriesDashboardContext } from './Context'
import SeriesPagination from './SeriesPagination'
import Link from 'next/link'

export default function SeriesTable() {
  const { page, series_type, query, orderBy, setLastPage, lastPage } =
    useContext(SeriesDashboardContext)
  const { data, error, isLoading } = useSWR<{ data: Series[]; meta: any }>(
    `/admin/query?${new URLSearchParams({
      page: page.toString(),
      series_type,
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
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <CircularProgress color={'inherit'} />
      </div>
    )
  }

  if (data) {
    const series = data.data
    return (
      <div className="space-y-2">
        <Table className="bg-background rounded">
          <TableCaption className="text-muted-foreground">{`Showing ${page} out of ${lastPage} page(s).`}</TableCaption>

          <TableHeader>
            <TableRow className="divide-gray-800 border-gray-800 text-muted-foreground">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Visibility</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-200">
            {series.length > 0 &&
              series.map((series) => (
                <TableRow
                  key={series.id}
                  className="divide-gray-800 border-gray-800"
                >
                  <TableCell className="font-medium">{series.id}</TableCell>
                  <TableCell className="flex flex-row gap-2 items-center">
                    <Image
                      alt=""
                      src={series.thumbnail}
                      className="rounded"
                      width={30}
                      height={48}
                    />
                    {series.title} ({series.series_type})
                  </TableCell>
                  <TableCell>{series.status}</TableCell>
                  <TableCell className="text-right">
                    {series.visibility}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link prefetch={false} href={`/dashboard/series/${series.id}`}>
                      <button className="bg-slate-600 text-gray-200 rounded px-6 py-2 text-[12px]">
                        Edit
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <SeriesPagination />
      </div>
    )
  }
}
