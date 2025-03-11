// Build me a client component that will use recharts, shadcn, etc to show the most purchased series, using SWR and using the api endpoint /metrics/series
// The component should have a title, a chart showing the most purchased series, and a table with the series data.


// Solution
'use client'
import { useContext, useEffect, useState } from 'react'
import { Series } from '@/types'
import useSWR from 'swr'
import { fetcher } from '@/services'
import { Website_API } from '@global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'


import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Icons } from '@/components/Icons'
import type { PaginatedResults } from '@/lib/utils'
import Image from 'next/image'
import { get_file_url } from '../../../../../functions';





export const MostPurchasedSeries = () => {
  const { data, error, isLoading } = useSWR<PaginatedResults<Series>>(
    `/metrics/series`,
    fetcher
  )

  return (
    <div className='flex flex-col gap-2 w-full p-4 border rounded'>
      <div className="flex flex-row gap-2 items-center">
        <Icons.book className="h-full w-8" />
        <h5 className='font-bold text-lg'>Top earning series</h5>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead className='text-center'>Chapters</TableHead>
            <TableHead className='text-center'>Avg. Points/Chapter</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            isLoading ? null :
              data?.data.map(series => (
                <TableRow key={series.series_slug}>
                  <TableCell className='text-xs'>
                    <Image alt={`Thumbnail for series ${series.title}`} className='inline mr-2 rounded' src={get_file_url(series.thumbnail)} width={30} height={30} />
                    {series.title}
                  </TableCell>
                  <TableCell>{series.total_used_coins}</TableCell>
                  <TableCell className='text-center'>{series.meta.chapters_count}</TableCell>
                  <TableCell className='text-center'>{Math.round(series.total_used_coins / parseInt(series.meta.chapters_count))}</TableCell>
                </TableRow>))
          }
        </TableBody>


      </Table>

    </div>
  )
}


