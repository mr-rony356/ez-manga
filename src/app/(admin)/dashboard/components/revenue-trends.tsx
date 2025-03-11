'use client'

import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import useSWR from 'swr'
import type { Metrics } from './website-metrics'
import { fetcher } from '@/services'
import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatNumber } from '../../../../components/Series/helpers';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Area, AreaChart, XAxis } from 'recharts'
import { addHours, getMonth, set, } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { atom, useAtom, useAtomValue } from 'jotai'
import type { DateRange } from 'react-day-picker'

const start_date = atom<Date>(new Date())
const end_date = atom<Date>(new Date())
const tab = atom<string>('today')


const chartConfig = {
  total_income: {
    label: "Income",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


const TodayMetricsScreen = () => {
  const { data, isLoading, error } = useSWR<Metrics>(
    "/website/metrics",
    fetcher
  );

  const today_data = useMemo(() => {
    if (!data) return null
    return data.daily_metrics[data.daily_metrics.length - 1]
  }, [data])

  if (isLoading) {
    return (
      <>
        Loading...
      </>
    )
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3'>
      <Card className='p-4'>
        <CardContent className='mt-4'>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center gap-3">
              <span>Revenue</span>
              <Separator dir='horizontal' />
              <span>{today_data?.total_income}</span>
            </div>
            <div className="flex flex-row justify-between items-center gap-3">
              <span>Views</span>
              <Separator dir='horizontal' />
              <span>{formatNumber(today_data?.total_views!)}</span>
            </div>
            <div className="flex flex-row justify-between items-center gap-3">
              <span className='shrink-0'>Released chapters</span>
              <Separator dir='horizontal' />
              <span>{today_data?.released_chapters}</span>
            </div>
            <div className="flex flex-row justify-between items-center shrink-0">
              <span className='shrink-0'>Bought coins</span>
              <Separator dir='horizontal' />
              <span>{formatNumber(today_data?.total_bought_coins!)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

const WeekMetricsScreen = () => {
  const { data, isLoading, error } = useSWR<Metrics>(
    "/website/metrics",
    fetcher
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    const today = data.daily_metrics[data.daily_metrics.length - 1]
    return data.daily_metrics.filter((metric) => metric.day >= today.day - 6);
  }, [data]);


  return (<>
    <Card className={"col-span-full"}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-base">Income/day - Last 7 days</CardTitle>
          <CardDescription className="text-xs">
            Showing income per day in the current month.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >

          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total_income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total_income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              type="category"
              padding={{ left: 20, right: 20 }}
              interval={1}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = addHours(new Date(value), 6);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = addHours(new Date(value), 6);

                    return new Date(date).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total_income"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-total_income)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  </>)
}

const MonthMetricsScreen = () => {
  const { data, isLoading, error } = useSWR<Metrics>(
    "/website/metrics",
    fetcher
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.daily_metrics.filter((metric) => metric.month === getMonth(new Date()));
  }, [data]);


  return (<>
    <Card className={"col-span-full"}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-base">Income/day - Month</CardTitle>
          <CardDescription className="text-xs">
            Showing income per day in the current month.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >

          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total_income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total_income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              type="category"
              padding={{ left: 20, right: 20 }}
              interval={1}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = addHours(new Date(value), 6);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = addHours(new Date(value), 6);

                    return new Date(date).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total_income"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-total_income)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  </>)
}

const CustomMetricsScreen = () => {

  const start = useAtomValue(start_date)
  const end = useAtomValue(end_date)

  const { data, isLoading, error } = useSWR<{
    metrics: any[]
  }>(
    start && end ? "/metrics/custom?start_date=" + start.toISOString() + "&end_date=" + end.toISOString() : null,
    fetcher
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.metrics;
  }, [data]);



  return (<>
    <Card className={"col-span-full"}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-base">Income/day - Custom</CardTitle>
          <CardDescription className="text-xs">
            Showing income per day in the current month.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >

          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total_income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total_income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              type="category"
              padding={{ left: 20, right: 20 }}
              interval={1}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = addHours(new Date(value), 6);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = addHours(new Date(value), 6);

                    return new Date(date).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total_income"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-total_income)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  </>)
}


export function RevenueTrends() {

  const [currentTab, setTab] = useAtom(tab)

  const [start, setStart] = useAtom(start_date)
  const [end, setEnd] = useAtom(end_date)

  function setDate(data: DateRange | undefined) {
    if (!data) return
    const { from, to } = data
    setStart(from || new Date())
    setEnd(to || new Date())
    setTab('custom')
  }

  return (
    <Tabs value={currentTab} onValueChange={setTab} >
      <div className='flex flex-col gap-2 p-4'>
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
          <h5 className='text-lg'>Revenue trends</h5>
          <TabsList>
            <TabsTrigger value='today'>Today</TabsTrigger>
            <TabsTrigger value='week'>Last 7 days</TabsTrigger>
            <TabsTrigger value='month'>This month</TabsTrigger>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    "justify-start text-left font-normal flex flex-row gap-2",
                    !start && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  Custom
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="range"
                  selected={{ from: start, to: end }}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </TabsList>
        </div>
        <TabsContent value='today'>
          <TodayMetricsScreen />
        </TabsContent>
        <TabsContent value='week'>
          <WeekMetricsScreen />
        </TabsContent>
        <TabsContent value='month'>
          <MonthMetricsScreen />
        </TabsContent>
        <TabsContent value='custom'>
          <CustomMetricsScreen />
        </TabsContent>
      </div>
    </Tabs>
  )

}