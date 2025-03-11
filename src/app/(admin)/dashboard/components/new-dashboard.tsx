'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DateRangePicker from "@/components/ui/date-range-picker"
import {
  Eye,
  Coins,
  ShoppingCart,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader
} from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { addDays, format } from 'date-fns'
import { fetcher } from '@/services'
import clsx from 'clsx'
import { formatNumber } from '@/components/Series/helpers'
import API from '@/services/api'

interface DashboardProps {
  initialData?: any
}


export default function SeriesDashboard({ initialData }: DashboardProps) {
  const [period, setPeriod] = useState('this_month')
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('total_views')
  const [series, setSeries] = useState<any[]>([])



  // Construct the URL with query parameters
  const getUrl = (pageNum: number) => {
    const params = new URLSearchParams({
      period,
      page: pageNum.toString(),
      sort_by: sortBy,
    })

    if (period === 'custom') {
      params.append('start_date', format(dateRange.from!, 'yyyy-MM-dd'))
      params.append('end_date', format(dateRange.to!, 'yyyy-MM-dd'))
    }

    return `/api/v1/series/dashboard?${params.toString()}`
  }



  const { data, error, isLoading, isValidating, mutate } = useSWR(
    getUrl(1),
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  )

  useEffect(() => {
    if (data) {
      setSeries(state => [...state, ...data.data])
    }
  }, [data])

  const handleFilterChange = () => {
    setPage(1)
    setSeries([])
  }

  const loadMore = async () => {
    const nextPage = page + 1
    setPage(nextPage)
    const nextPageData = (await API.get(getUrl(page + 1))).data
    setSeries(state => [...state, ...nextPageData.data])
  }

  const MetricCard = ({ title, value, icon: Icon, trend }: any) => (
    <Card className={clsx(title === 'Purchases' && 'col-span-2')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between items-center">
          <div className="text-base font-bold">{formatNumber(value)}</div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            {trend > 0 ? (
              <ChevronUp className="h-4 w-4 text-green-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-red-500" />
            )}
            <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
              {Math.min(Math.abs(trend), 100)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading dashboard data
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const dashboardData = data

  if (!dashboardData) {
    return null
  }

  return (
    <div className="p-8 space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={period}
            onValueChange={(value) => {
              setPeriod(value)
              handleFilterChange()
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="this_month">This month</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          {period === 'custom' && (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={(newRange) => {
                setDateRange(newRange)
                handleFilterChange()
              }}
            />
          )}
        </div>

        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value)
            handleFilterChange()
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="total_views">Views</SelectItem>
            <SelectItem value="total_used_coins">Coins</SelectItem>
            <SelectItem value="total_bought_chapters">Purchases</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Series Grid */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {series.map((series: any) => (
          <Card key={series.id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={series.thumbnail}
                alt={series.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <Badge
                className={`absolute top-2 right-2 ${series.status === 'NEW SERIES' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
              >
                {series.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{series.title}</h3>

              <div className="space-y-4">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <MetricCard
                    title="Views"
                    value={series.metrics.views.total}
                    icon={Eye}
                    trend={series.percentageGrowth}
                  />
                  <MetricCard
                    title="Coins"
                    value={series.metrics.coins.total}
                    icon={Coins}
                    trend={(series.metrics.coins.total / (series.metrics.coins.total - series.metrics.coins.week)) * 100}
                  />
                  <MetricCard
                    title="Purchases"
                    value={series.metrics.boughtChapters.total}
                    icon={ShoppingCart}
                    trend={((series.metrics.boughtChapters.week - (series.metrics.boughtChapters.total - series.metrics.boughtChapters.week)) / (series.metrics.boughtChapters.total - series.metrics.boughtChapters.week)) * 100}
                  />
                </div>

                {/* Top Chapters */}
                <div>
                  <h4 className="font-semibold mb-2">Top Chapters</h4>
                  {series.topChapters.map((chapter: any) => (
                    <div key={chapter.id} className="flex justify-between mb-2 items-center p-2 rounded-lg">
                      <span className="truncate text-xxs">{chapter.name}</span>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>{formatNumber(chapter.views)}</span>
                        <ShoppingCart className="h-4 w-4 ml-2" />
                        <span>{formatNumber(chapter.purchaseCount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {page < dashboardData.meta.last_page && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMore}
            disabled={isValidating}
            className="w-40"
          >
            {isValidating ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}