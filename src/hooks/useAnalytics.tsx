// hooks/useAnalytics.ts
import { fetcher } from '@/services'
import useSWR from 'swr'


export function useDashboardData(period: 'day' | 'week' | 'month' | 'year' = 'day') {
  const { data, error, isLoading } = useSWR(
    `/api/v1/analytics/dashboard?period=${period}`,
    fetcher
  )

  return {
    data: data?.data,
    isLoading,
    error
  }
}

export function useComparisonData(
  period: 'day' | 'week' | 'month' | 'year',
  startDate: string,
  endDate: string
) {
  const { data, error, isLoading } = useSWR(
    `/api/v1/analytics/comparison?period=${period}&startDate=${startDate}&endDate=${endDate}`,
    fetcher
  )

  return {
    data: data?.data,
    isLoading,
    error
  }
}

export function useTransactionDetails(
  period: 'day' | 'week' | 'month' | 'year',
  date: string,
  page?: number,
  limit?: number
) {
  const { data, error, isLoading } = useSWR(
    `/api/v1/analytics/transactions?period=${period}&date=${date}${page ? `&page=${page}` : ''}${limit ? `&limit=${limit}` : ''}`,
    fetcher
  )

  return {
    data: data?.data,
    isLoading,
    error
  }
}