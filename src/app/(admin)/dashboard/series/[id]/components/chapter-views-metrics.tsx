"use client";

import { useContext, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SingleSeriesContext } from "@/app/(admin)/dashboard/series/[id]/components/Context";
import { fetcher } from "@/services";
import { SeriesMetrics } from "@/app/(admin)/dashboard/series/[id]/components/series-metrics";
import useSWR from "swr";
import { CircularProgress } from "@mui/material";

const chartConfig = {
  views: {
    label: "Views",
    color: "#2563eb",
  },
  purchases: {
    label: "Purchases",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function ChapterMetrics() {
  const { series } = useContext(SingleSeriesContext);

  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("views");

  const {
    data: metrics,
    error,
    isLoading,
  } = useSWR<SeriesMetrics>(`/series/metrics/${series.id}`, fetcher);

  const data = useMemo(
    () =>
      metrics
        ? metrics.chapters.map((chapter) => ({
            ...chapter,
            views: chapter.views,
            purchases: parseInt(chapter.meta.who_bought_count),
          }))
        : [],
    [metrics]
  );

  if (isLoading) return <CircularProgress />;

  if (metrics && data.length > 0) {
    return (
      <Card className={"col-span-full"}>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Chapter metrics</CardTitle>
            <CardDescription>
              Showing total views and chapter purchases
            </CardDescription>
          </div>
          <div className="flex">
            {["views", "purchases"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  {/*<span className="text-lg font-bold leading-none sm:text-3xl">*/}
                  {/*  {total[key as keyof typeof total].toLocaleString()}*/}
                  {/*</span>*/}
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="chapter_name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                content={<ChartTooltipContent className="w-[150px]" />}
              />

              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
}
