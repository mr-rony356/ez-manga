'use client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useContext, useEffect } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/services'
import { Purchase } from '@/types'
import CircularProgress from '@mui/material/CircularProgress'
import { LogsDashboardContext } from './Context'
import UsersPagination from './Pagination'
import { toast } from 'sonner'
import { verifyPurchaseStatus } from '@/services/paypal'
import { get_time_diff } from '@/components/Series/helpers'
import { Button } from '@/components/ui/button'
import { faPaypal, faStripe } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function UsersTable() {
  const { page, query, orderBy, setLastPage, lastPage, from, to } =
    useContext(LogsDashboardContext)
  const { data, isLoading } = useSWR<{ data: Purchase[]; meta: any }>(
    `/api/purchases/logs?${new URLSearchParams({
      page: page.toString(),
      query,
      orderBy,
      to: to.toISOString(),
      from: from.toISOString(),
    }).toString()}`,
    fetcher
  )

  useEffect(() => {
    setLastPage(data?.meta['last_page'])
  }, [data])

  if (isLoading) {
    return (
      <div className="flex">
        <CircularProgress />
      </div>
    )
  }

  async function verifyPurchase(id: number | string) {
    toast.promise(verifyPurchaseStatus(`${id}`), {
      loading: 'Verifying purchase...',
      success: 'Purchase verified and payment log created!',
      error: 'This purchase has already been verified or hasnt been paid yet.',
    })
  }

  if (data) {
    const logs = data.data
    return (
      <div className="space-y-2">
        <Table className="bg-background rounded">
          <TableCaption className="text-muted-foreground">{`Showing ${page} out of ${lastPage} page(s).`}</TableCaption>
          <TableHeader>
            <TableRow className="text-muted-foreground">
              <TableHead>ID</TableHead>
              <TableHead>Gateway ID</TableHead>

              <TableHead className="text-right hidden lg:table-cell">
                Date
              </TableHead>
              <TableHead className="text-right hidden lg:table-cell">
                Paid
              </TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 &&
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>
                    {log.paypal_id}{' '}
                    <Badge className={''} variant={'outline'}>
                      {log.payment_gateway === 'stripe' ? (
                        <FontAwesomeIcon icon={faStripe as IconProp} />
                      ) : log.payment_gateway === 'paypal' ? (
                        <FontAwesomeIcon icon={faPaypal as IconProp} />
                      ) : (
                        'Binance'
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right hidden lg:table-cell">
                    {get_time_diff(log.created_at)}
                  </TableCell>
                  <TableCell className="text-right hidden lg:table-cell">
                    {log.paid ? 'Paid' : 'Not paid'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link prefetch={false} href={`/dashboard/purchases/${log.id}`}>
                      <Button>Details</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <UsersPagination />
      </div>
    )
  }
}
