import { get_time_diff } from "@/components/Series/helpers"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Product, SubscriptionPlan } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const badges_titles = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  CREATED: 'Created'
}

type TableProps = {
  coins: Product[]
}

export function CoinsTable({ coins }: TableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className='text-center'>Value</TableHead>
          <TableHead className="text-right">Created at</TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coins.map((coin) => (
          <TableRow key={coin.id}>
            <TableCell className="font-medium">{coin.id}</TableCell>
            <TableCell className="font-medium">{coin.name}</TableCell>
            <TableCell><Badge>{coin.status}</Badge></TableCell>
            <TableCell className='text-center text-xxs'>
              <span className='bg-green-200 font-bold p-2 rounded text-green-700'>

                {coin.currency_code} ${coin.price}
              </span>
            </TableCell>
            <TableCell className="text-right text-xxs">{get_time_diff(coin.created_at)}</TableCell>
            <TableCell className='text-center'>
              <Link prefetch={false} href={`/dashboard/coins/${coin.id}`}>
                <Button variant='outline' className='text-xxs'>Manage</Button>
              </Link></TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{coins.length} coins packages</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
