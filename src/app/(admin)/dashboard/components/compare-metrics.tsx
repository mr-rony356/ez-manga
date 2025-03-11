import type { MonthlyMetric } from "./website-metrics"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/components/Series/helpers";
import clsx from "clsx";


type Props = {
  selected: MonthlyMetric
  compared: MonthlyMetric | undefined
}

export function CompareGeneralMonthlyMetrics({ selected, compared }: Props) {

  const views_diff = selected.total_views - (compared?.total_views || 0)
  const transactions_diff = selected.total_transactions - (compared?.total_transactions || 0)
  const income_diff = selected.total_income - (compared?.total_income || 0)
  const released_chapters_diff = selected.released_chapters - (compared?.released_chapters || 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>General metrics</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <div className="flex justify-between">
          <span className='text-muted-foreground'>Views</span>
          <span>
            {formatNumber(selected.total_views ?? 0)}
            <span className={clsx(views_diff > 0 && 'text-green-600', views_diff < 0 && 'text-red-600', 'text-xxs ml-1')}>({views_diff > 0 ? `+${formatNumber(views_diff)}` : `-${formatNumber(views_diff)}`})</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className='text-muted-foreground'>Transactions</span>
          <span>
            {formatNumber(selected.total_transactions ?? 0)}
            <span className={clsx(transactions_diff > 0 && 'text-green-600', transactions_diff < 0 && 'text-red-600', 'text-xxs ml-1')}>({transactions_diff > 0 ? `+${formatNumber(transactions_diff)}` : `-${formatNumber(transactions_diff)}`})</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className='text-muted-foreground'>Income</span>
          <span>
            {formatNumber(selected.total_income ?? 0)}
            <span className={clsx(income_diff > 0 && 'text-green-600', income_diff < 0 && 'text-red-600', 'text-xxs ml-1')}>({income_diff > 0 ? `+${formatNumber(income_diff)}` : `-${formatNumber(income_diff)}`})</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className='text-muted-foreground'>Released chapters</span>
          <span>
            {formatNumber(selected.released_chapters ?? 0)}
            <span className={clsx(released_chapters_diff > 0 && 'text-green-600', released_chapters_diff < 0 && 'text-red-600', 'text-xxs ml-1')}>({released_chapters_diff > 0 ? `+${formatNumber(released_chapters_diff)}` : `-${formatNumber(released_chapters_diff)}`})</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )

}