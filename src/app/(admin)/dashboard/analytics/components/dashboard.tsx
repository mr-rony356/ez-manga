'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Loader2 } from 'lucide-react'
import { useDashboardData } from '@/hooks/useAnalytics'
import clsx from 'clsx'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { addHours } from 'date-fns'
import { formatNumber } from '@/components/Series/helpers'

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('day')
  const { data, isLoading, error } = useDashboardData(period as 'day' | 'week' | 'month' | 'year')

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-destructive">Failed to load analytics data</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <Tabs defaultValue={period} className="w-[400px]" onValueChange={setPeriod}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>
              <span className={clsx(`mr-2`, data?.growthRates?.total_income > 0 ? 'text-success' : 'text-destructive')}>

                {data?.growthRates?.total_income > 0 ? '↗' : '↘'}
              </span>
              <span className={clsx(data?.growthRates?.total_income > 0 ? 'text-success' : 'text-destructive')}>
                {Math.abs(data?.growthRates?.total_income || 0).toFixed(1)}% from previous {period}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${data?.summary?.totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              <span className={clsx(`mr-2`, data?.growthRates?.total_income > 0 ? 'text-success' : 'text-destructive')}>

                {data?.growthRates?.transactions > 0 ? '↗' : '↘'}
              </span>
              <span className={clsx(data?.growthRates?.transactions > 0 ? 'text-success' : 'text-destructive')}>
                {Math.abs(data?.growthRates?.transactions || 0).toFixed(1)}% from previous {period}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data?.summary?.transactionCount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Value</CardTitle>
            <CardDescription>Per transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${data?.summary?.averageTransactionValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ChartContainer className='aspect-auto h-[350px] w-full' config={{
            total_income: {

              label: "Income",
              color: "hsl(var(--primary))",

            }
          }}>
            <AreaChart data={data.historicalData!}>
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
              <YAxis dataKey={'total_income'} tickMargin={8} padding={{ top: 20 }} tickLine={false}
                axisLine={false} tickFormatter={(value) => {
                  return formatNumber(value)
                }} />
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.recentTransactions.map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{transaction.user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-medium">
                  ${transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}