'use client'

import { useEffect, useState, useCallback, memo } from 'react'
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
import {
  Eye,
  Coins,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Loader
} from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { format, subDays } from 'date-fns'
import { fetcher } from '@/services'
import clsx from 'clsx'
import { formatNumber } from '@/components/Series/helpers'
import API from '@/services/api'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'

interface DashboardProps {
  initialData?: any
}

// Separate MetricCard into its own component to prevent re-renders
const MetricCard = memo(({ title, value, trend }: any) => (
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
            {Math.round(Math.min(Math.abs(trend), 100))}%
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
));
MetricCard.displayName = 'MetricCard'

// Separate SeriesCard into its own component
const calculateTrend = (metrics: any, period: string) => {
  if (period === 'day') {
    return ((metrics.day - metrics.week / 7) / (metrics.week / 7)) * 100;
  } else if (period === 'week') {
    return ((metrics.week - metrics.month / 4) / (metrics.month / 4)) * 100;
  } else if (period === 'month') {
    return ((metrics.month - metrics.total / 12) / (metrics.total / 12)) * 100;
  } else if (period === 'total' || period === 'custom') {
    return ((metrics.total - metrics.month) / metrics.month) * 100;
  }
  return 0;
};


const SeriesCard = memo(({ series, period }: any) => (
  <Card key={series.id} className="overflow-hidden">
    <div className="relative h-48">
      <img
        src={series.thumbnail}
        alt={series.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <Badge
        className={`absolute top-2 right-2 ${series.status === 'NEW SERIES' ? 'bg-green-500' : 'bg-blue-500'}`}
      >
        {series.status}
      </Badge>
    </div>
    <CardContent className="p-4">
      <h3 className="font-bold text-lg mb-2 line-clamp-1">{series.title}</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <MetricCard
            title="Views"
            value={series.metrics.views[period === 'custom' ? 'custom' : period === 'day' ? 'day' : period]}
            trend={calculateTrend(series.metrics.views, period)}
          />
          <MetricCard
            title="Coins"
            value={series.metrics.coins[period === 'custom' ? 'custom' : period === 'day' ? 'day' : period]}
            trend={calculateTrend(series.metrics.coins, period)}
          />
          <MetricCard
            title="Purchases"
            value={series.metrics.boughtChapters[period === 'custom' ? 'custom' : period === 'day' ? 'day' : period]}
            trend={calculateTrend(series.metrics.boughtChapters, period)}
          />
        </div>

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
));


SeriesCard.displayName = 'SeriesCard'


export default function SeriesDashboard({ initialData }: DashboardProps) {
  const [filters, setFilters] = useState({
    period: 'month',
    sortBy: 'views',
    page: 1,
    startDate: subDays(new Date(), 30),
    endDate: new Date()
  });

  // Separate state for accumulated series data
  const [accumulatedSeries, setAccumulatedSeries] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getUrl = useCallback((page: number) => {
    const params = new URLSearchParams({
      period: filters.period,
      page: page.toString(),
      sort_by: filters.sortBy,
    });

    if (filters.period === 'custom') {
      if (filters.startDate && filters.endDate) {
        params.append('start_date', format(filters.startDate, 'yyyy-MM-dd'))
        params.append('end_date', format(filters.endDate, 'yyyy-MM-dd'))
      } else {
        return null
      }
    }
    return `/api/v1/series/dashboard?${params.toString()}`
  }, [filters]);

  const { data, error, isValidating, mutate } = useSWR(
    getUrl(filters.page),
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 5000,
    }
  );

  // Update accumulated series when initial data loads or filters change
  useEffect(() => {
    if (data?.data) {
      if (filters.page === 1) {
        // Reset accumulated series when filters change
        setAccumulatedSeries(data.data);
      }
      setHasMore(filters.page < data.meta.last_page);
    }
  }, [data, filters.page]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }));
    setAccumulatedSeries([]); // Clear accumulated series when filters change
    setHasMore(true);
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = filters.page + 1;
      const nextPageUrl = getUrl(nextPage);
      if (!nextPageUrl) return;

      const response = await API.get(nextPageUrl);
      const newData = response.data.data;

      setAccumulatedSeries(prev => [...prev, ...newData]);
      setFilters(prev => ({ ...prev, page: nextPage }));
      setHasMore(nextPage < response.data.meta.last_page);
    } catch (error) {
      console.error('Error loading more series:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading dashboard data
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-row gap-4">
          <Select
            value={filters.period}
            onValueChange={(value) => handleFilterChange('period', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="total">All time</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="used_coins">Coins</SelectItem>
              <SelectItem value="bought_chapters">Purchases</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filters.period === 'custom' && (
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex flex-row gap-2 items-center justify-between">
              <Label className='text-xxs uppercase tracking-widest shrink-0'>Start date</Label>
              <DatePicker
                onDateChange={(date) => handleFilterChange('startDate', date)}
              />
            </div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <Label className='text-xxs uppercase tracking-widest'>End date</Label>
              <DatePicker
                onDateChange={(date) => handleFilterChange('endDate', date)}
              />
            </div>
          </div>
        )}
      </div>

      {isValidating && filters.page === 1 && (
        <div className="flex items-center justify-center w-full py-8">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <div className={clsx(
        "grid gap-4 md:grid-cols-1 lg:grid-cols-3",
        isValidating && filters.page === 1 && "opacity-50 pointer-events-none"
      )}>
        {accumulatedSeries.map((seriesItem: any) => (
          <SeriesCard
            key={seriesItem.id}
            series={seriesItem}
            period={filters.period}
          />
        ))}
      </div>

      {
        hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="w-40"
            >
              {isLoadingMore ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )
      }
    </div >
  );
}