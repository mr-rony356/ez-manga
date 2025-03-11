"use client";
import { useTheme } from "next-themes";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts";

import { useConfig } from "@/hooks/use-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { themes } from "@/registry/themes";
import { SingleSeriesContext } from "@/app/(admin)/dashboard/series/[id]/components/Context";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCoins } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { ChapterMetrics } from "@/app/(admin)/dashboard/series/[id]/components/chapter-views-metrics";
import useSWR from "swr";
import { fetcher } from "@/services";
import CircularProgress from "@mui/material/CircularProgress";
import { Series } from "@/types";

export type SeriesMetrics = {
  daily_metrics: Series["daily_metrics"];
  weekly_metrics: Series["weekly_metrics"];
  monthly_metrics: Series["monthly_metrics"];
  chapters: Series["chapters"];
  total_views: Series["total_views"];
  total_used_coins: Series["total_used_coins"];
  month_used_coins: Series["month_used_coins"];
  week_used_coins: Series["week_used_coins"];
  day_used_coins: Series["day_used_coins"];
  year_used_coins: Series["year_used_coins"];
  year_views: Series["year_views"];
  month_views: Series["month_views"];
  week_views: Series["week_views"];
  day_views: Series["day_views"];
};

export function CardsStats() {
  const { theme: mode } = useTheme();
  const [config] = useConfig();

  const { series } = useContext(SingleSeriesContext);

  const theme = themes.find((theme) => theme.name === config.theme);

  const { data, error, isLoading } = useSWR<SeriesMetrics>(
    `/series/metrics/${series.id}`,
    fetcher
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (data) {
    const {
      chapters,
      month_views,
      daily_metrics,
      monthly_metrics,
      weekly_metrics,
      day_views,
      day_used_coins,
      month_used_coins,
      total_used_coins,
      total_views,
      week_used_coins,
      week_views,
      year_used_coins,
      year_views,
    } = data;
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faCoins} />
              {total_used_coins}
            </div>
            {/*<p className="text-xs text-green-700">+20.1% from last month</p>*/}
            {/*<div className="h-[80px]">*/}
            {/*  <ResponsiveContainer width="100%" height="100%">*/}
            {/*    <LineChart*/}
            {/*      data={data}*/}
            {/*      margin={{*/}
            {/*        top: 5,*/}
            {/*        right: 10,*/}
            {/*        left: 10,*/}
            {/*        bottom: 0,*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <Line*/}
            {/*        type="monotone"*/}
            {/*        strokeWidth={2}*/}
            {/*        dataKey="revenue"*/}
            {/*        activeDot={{*/}
            {/*          r: 6,*/}
            {/*          style: { fill: "var(--theme-primary)", opacity: 0.25 },*/}
            {/*        }}*/}
            {/*        style={*/}
            {/*          {*/}
            {/*            stroke: "var(--theme-primary)",*/}
            {/*            "--theme-primary": `hsl(${*/}
            {/*              theme?.cssVars[mode === "dark" ? "dark" : "light"]*/}
            {/*                .primary*/}
            {/*            })`,*/}
            {/*          } as React.CSSProperties*/}
            {/*        }*/}
            {/*      />*/}
            {/*    </LineChart>*/}
            {/*  </ResponsiveContainer>*/}
            {/*</div>*/}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">Total views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total_views}</div>
            {/*<p className="text-xs text-green-700">+180.1% from last month</p>*/}
            {/*<div className="mt-4 h-[80px]">*/}
            {/*  <ResponsiveContainer width="100%" height="100%">*/}
            {/*    <BarChart data={data}>*/}
            {/*      <Bar*/}
            {/*        dataKey="subscription"*/}
            {/*        style={*/}
            {/*          {*/}
            {/*            fill: "var(--theme-primary)",*/}
            {/*            opacity: 1,*/}
            {/*            "--theme-primary": `hsl(${*/}
            {/*              theme?.cssVars[mode === "dark" ? "dark" : "light"]*/}
            {/*                .primary*/}
            {/*            })`,*/}
            {/*          } as React.CSSProperties*/}
            {/*        }*/}
            {/*      />*/}
            {/*    </BarChart>*/}
            {/*  </ResponsiveContainer>*/}
            {/*</div>*/}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Monthly revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faCoins} />
              {month_used_coins}
            </div>
            {monthly_metrics.length > 1 && (
              <p
                className={cn(
                  "text-xs",
                  monthly_metrics[monthly_metrics.length - 1].coins -
                    monthly_metrics[monthly_metrics.length - 2].coins >
                    0
                    ? "text-green-700"
                    : "text-red-700"
                )}
              >
                {monthly_metrics[monthly_metrics.length - 1].coins -
                  monthly_metrics[monthly_metrics.length - 2].coins}{" "}
                from last month
              </p>
            )}{" "}
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthly_metrics}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <Line
                    type="monotone"
                    strokeWidth={2}
                    dataKey="coins"
                    activeDot={{
                      r: 6,
                      style: { fill: "var(--theme-primary)", opacity: 0.25 },
                    }}
                    style={
                      {
                        stroke: "var(--theme-primary)",
                        "--theme-primary": `hsl(${
                          theme?.cssVars[mode === "dark" ? "dark" : "light"]
                            .primary
                        })`,
                      } as React.CSSProperties
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Monthly views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthly_metrics[monthly_metrics.length - 1].views}
            </div>
            {monthly_metrics.length > 1 && (
              <p
                className={cn(
                  "text-xs",
                  monthly_metrics[monthly_metrics.length - 1].views -
                    monthly_metrics[monthly_metrics.length - 2].views >
                    0
                    ? "text-green-700"
                    : "text-red-700"
                )}
              >
                {monthly_metrics[monthly_metrics.length - 1].views -
                  monthly_metrics[monthly_metrics.length - 2].views}{" "}
                from yesterday
              </p>
            )}

            {monthly_metrics && monthly_metrics.length > 0 && (
              <div className="mt-4 h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly_metrics}>
                    <Bar
                      dataKey="views"
                      style={
                        {
                          fill: "var(--theme-primary)",
                          opacity: 1,
                          "--theme-primary": `hsl(${
                            theme?.cssVars[mode === "dark" ? "dark" : "light"]
                              .primary
                          })`,
                        } as React.CSSProperties
                      }
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Weekly revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faCoins} />
              {week_used_coins}
            </div>
            {weekly_metrics.length > 1 && (
              <p
                className={cn(
                  "text-xs",
                  weekly_metrics[weekly_metrics.length - 1].coins -
                    weekly_metrics[weekly_metrics.length - 2].coins >
                    0
                    ? "text-green-700"
                    : "text-red-700"
                )}
              >
                {weekly_metrics[weekly_metrics.length - 1].coins -
                  weekly_metrics[weekly_metrics.length - 2].coins}{" "}
                from last week
              </p>
            )}{" "}
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weekly_metrics}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <Line
                    type="monotone"
                    strokeWidth={2}
                    dataKey="coins"
                    activeDot={{
                      r: 6,
                      style: { fill: "var(--theme-primary)", opacity: 0.25 },
                    }}
                    style={
                      {
                        stroke: "var(--theme-primary)",
                        "--theme-primary": `hsl(${
                          theme?.cssVars[mode === "dark" ? "dark" : "light"]
                            .primary
                        })`,
                      } as React.CSSProperties
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Weekly views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weekly_metrics[weekly_metrics.length - 1].views}
            </div>
            {weekly_metrics.length > 1 && (
              <p
                className={cn(
                  "text-xs",
                  weekly_metrics[weekly_metrics.length - 1].views -
                    weekly_metrics[weekly_metrics.length - 2].views >
                    0
                    ? "text-green-700"
                    : "text-red-700"
                )}
              >
                {weekly_metrics[weekly_metrics.length - 1].views -
                  weekly_metrics[weekly_metrics.length - 2].views}{" "}
                from yesterday
              </p>
            )}

            {weekly_metrics && weekly_metrics.length > 0 && (
              <div className="mt-4 h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly_metrics}>
                    <Bar
                      dataKey="views"
                      style={
                        {
                          fill: "var(--theme-primary)",
                          opacity: 1,
                          "--theme-primary": `hsl(${
                            theme?.cssVars[mode === "dark" ? "dark" : "light"]
                              .primary
                          })`,
                        } as React.CSSProperties
                      }
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Daily revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faCoins} />
              {day_used_coins}
            </div>
            {daily_metrics.length > 1 && (
              <p
                className={cn(
                  "text-xs",
                  daily_metrics[daily_metrics.length - 1].coins -
                    daily_metrics[daily_metrics.length - 2].coins >
                    0
                    ? "text-green-700"
                    : "text-red-700"
                )}
              >
                {daily_metrics[daily_metrics.length - 1].coins -
                  daily_metrics[daily_metrics.length - 2].coins}{" "}
                from yesterday
              </p>
            )}{" "}
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={daily_metrics}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <Line
                    type="monotone"
                    strokeWidth={2}
                    dataKey="coins"
                    activeDot={{
                      r: 6,
                      style: { fill: "var(--theme-primary)", opacity: 0.25 },
                    }}
                    style={
                      {
                        stroke: "var(--theme-primary)",
                        "--theme-primary": `hsl(${
                          theme?.cssVars[mode === "dark" ? "dark" : "light"]
                            .primary
                        })`,
                      } as React.CSSProperties
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">Daily views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daily_metrics[daily_metrics.length - 1].views}
            </div>
            {daily_metrics.length > 1 && (
              <p
                className={cn(
                  "text-xs",
                  daily_metrics[daily_metrics.length - 1].views -
                    daily_metrics[daily_metrics.length - 2].views >
                    0
                    ? "text-green-700"
                    : "text-red-700"
                )}
              >
                {daily_metrics[daily_metrics.length - 1].views -
                  daily_metrics[daily_metrics.length - 2].views}{" "}
                from yesterday
              </p>
            )}

            {daily_metrics && daily_metrics.length > 0 && (
              <div className="mt-4 h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={daily_metrics}>
                    <Bar
                      dataKey="views"
                      style={
                        {
                          fill: "var(--theme-primary)",
                          opacity: 1,
                          "--theme-primary": `hsl(${
                            theme?.cssVars[mode === "dark" ? "dark" : "light"]
                              .primary
                          })`,
                        } as React.CSSProperties
                      }
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        <ChapterMetrics />
      </div>
    );
  }
}
