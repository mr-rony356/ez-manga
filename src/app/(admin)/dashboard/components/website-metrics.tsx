"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import { addHours, getMonth } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompareGeneralMonthlyMetrics } from "./compare-metrics";
import { Separator } from "@/components/ui/separator";
import useSWR from "swr";
import { fetcher } from "@/services";

const chartConfig = {
  transactions: {
    label: "Transactions",
  },
  income: {
    label: "Income",
  },
  released: {
    label: "Chapters released",
    color: "hsl(var(--chart-1))",
  },
  paypal: {
    label: "Paypal",
    color: "hsl(var(--chart-1))",
  },
  stripe: {
    label: "Stripe",
    color: "hsl(var(--chart-2))",
  },
  total_used_coins: {
    label: "Used coins",
    color: "hsl(var(--chart-1))",
  },
  total_bought_coins: {
    label: "Bought coins",
    color: "hsl(var(--chart-2))",
  },
  total_views: {
    label: "Total views",
    color: "hsl(var(--chart-3))",
  },
  total_income: {
    label: "Income",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export interface Metrics {
  daily_metrics: DailyMetric[];
  weekly_metrics: WeeklyMetric[];
  monthly_metrics: MonthlyMetric[];
}

export interface DailyMetric {
  id: number;
  released_chapters: number;
  bought_chapters: number;
  total_transactions: number;
  total_income: number;
  total_views: number;
  total_bought_coins: number;
  total_used_coins: number;
  paypal_income: number;
  paypal_transactions_count: number;
  stripe_income: number;
  stripe_transactions_count: number;
  day: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface WeeklyMetric {
  id: number;
  released_chapters: number;
  bought_chapters: number;
  total_transactions: number;
  total_income: number;
  total_views: number;
  total_bought_coins: number;
  total_used_coins: number;
  paypal_income: number;
  paypal_transactions_count: number;
  stripe_income: number;
  stripe_transactions_count: number;
  week: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface MonthlyMetric {
  id: number;
  released_chapters: number;
  bought_chapters: number;
  total_transactions: number;
  total_income: number;
  total_views: number;
  total_bought_coins: number;
  total_used_coins: number;
  paypal_income: number;
  paypal_transactions_count: number;
  stripe_income: number;
  stripe_transactions_count: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WebsiteMetrics = () => {
  const { data, isLoading, error } = useSWR<Metrics>(
    "/website/metrics",
    fetcher
  );

  const [current, setCurrent] = useState<number>(getMonth(new Date()));
  const [compareTo, setCompare] = useState<number>(getMonth(new Date()) - 1);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.daily_metrics.filter((metric) => metric.month === current);
  }, [data, current]);

  const selectedMonthData = useMemo(() => {
    return data
      ? data.monthly_metrics.find((metric) => metric.month === current)
      : undefined;
  }, [data, current]);

  const comparedMonthData = useMemo(() => {
    return data
      ? data.monthly_metrics.find((metric) => metric.month === compareTo)
      : undefined;
  }, [data, compareTo]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data, check permissions</div>;

  const { daily_metrics, monthly_metrics } = data!;

  return (
    <div className={"grid grid-cols-1 lg:grid-cols-3 gap-3 my-4 px-5 lg:px-0"}>
      <div className="col-span-full">
        <h5 className="font-bold text-3xl">Metrics dashboard</h5>
        <Separator className="my-2" />
      </div>
      <div className={"col-span-full flex flex-row gap-2 flex-wrap"}>
        <Select
          value={current.toString()}
          onValueChange={(value) => setCurrent(parseInt(value))}
        >
          <SelectTrigger className="w-fit" aria-label="Select a value">
            <div className="flex gap-2 text-xxs pr-4 rounded-lg w-fit">
              <span className="text-muted-foreground font-bold">Period</span>
              <SelectValue placeholder="Last 3 months" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {months.map((month, index) => (
              <SelectItem
                key={index}
                value={index.toString()}
                className="rounded-lg text-xxs"
              >
                {month} {index === getMonth(new Date()) ? "(current)" : ""}{" "}
                {index === getMonth(new Date()) - 1 ? "(past)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={compareTo.toString()}
          onValueChange={(value) => setCompare(parseInt(value))}
        >
          <SelectTrigger className="w-fit" aria-label="Select a value">
            <div className="flex gap-2 text-xxs pr-4 rounded-lg w-fit">
              <span className="text-muted-foreground font-bold">
                Compare to
              </span>
              <SelectValue placeholder="Last 3 months" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {months.map((month, index) => (
              <SelectItem
                key={index}
                value={index.toString()}
                className="rounded-lg text-xxs"
              >
                {month} {index === getMonth(new Date()) ? "(current)" : ""}{" "}
                {index === getMonth(new Date()) - 1 ? "(past)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedMonthData && (
        <CompareGeneralMonthlyMetrics
          selected={selectedMonthData}
          compared={comparedMonthData}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Total income</CardTitle>
          <CardDescription className="text-xs">
            Total income (Stripe + Paypal) in the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={[
                  {
                    gateway: "paypal",
                    transactions: selectedMonthData?.paypal_income,
                    fill: "var(--color-paypal)",
                  },
                  {
                    gateway: "stripe",
                    transactions: selectedMonthData?.stripe_income,
                    fill: "var(--color-stripe)",
                  },
                ]}
                dataKey="transactions"
                nameKey="gateway"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            ${selectedMonthData?.total_income.toLocaleString()}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className={"col-span-full"}>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className="text-base">Income/day</CardTitle>
            <CardDescription className="text-xs">
              Showing income per day in the selected period.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart data={filteredData}>
              <CartesianGrid vertical={false} />
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
              <Bar
                dataKey="total_income"
                radius={4}
                fill="url(#fillMobile)"
                stroke="var(--color-total_used_coins)"
                stackId="a"
              />

              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className={"col-span-full"}>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className="text-base">Coins balance</CardTitle>
            <CardDescription className="text-xs">
              Showing bought/used coins and total views in the selected period.
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
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total_used_coins)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total_used_coins)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total_bought_coins)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total_bought_coins)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total_views)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total_views)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="created_at"
                tickLine={false}
                axisLine={false}
                type="category"
                padding={{ left: 20, right: 20 }}
                interval={8}
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
                dataKey="total_bought_coins"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-total_bought_coins)"
                stackId="b"
              />
              <Area
                dataKey="total_used_coins"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-total_used_coins)"
                stackId="a"
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
