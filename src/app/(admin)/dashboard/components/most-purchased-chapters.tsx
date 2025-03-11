// A component like the most-purchased-series.tsx, but for chapters now, using the endpoint /metrics/chapter


// Solution

'use client'
import { useContext, useEffect, useState } from 'react'
import { Chapter } from '@/types'
import useSWR from 'swr'
import { fetcher } from '@/services'
import { Website_API } from '@global'
import { CircularProgress } from '@mui/material'
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



const MostPurchasedChapters = () => {
  const { data, error } = useSWR<Chapter[]>(`${Website_API}/metrics/chapters`, fetcher)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (data) {
      const formattedData = data.map(chapter => ({
        name: chapter.chapter_name,
        purchases: chapter.meta.who_bought_count,
      }))
      setChartData(formattedData)
    }
  }, [data])

  if (error) return <div>Failed to load</div>
  if (!data) return <CircularProgress />

  return (
    <div>
      <h2>Most Purchased Chapters</h2>

      <Table>
        <TableCaption>A list of the most purchased chapters</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Purchases</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((chapter) => (
            <TableRow key={chapter.id}>
              <TableCell>{chapter.chapter_name}</TableCell>
              <TableCell>{chapter.meta.who_bought_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>
              <Button color="primary" >
                View More
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default MostPurchasedChapters

