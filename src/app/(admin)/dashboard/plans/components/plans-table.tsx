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
import type { SubscriptionPlan } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const badges_titles = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  CREATED: 'Created'
}

type TableProps = {
  plans: SubscriptionPlan[]
}

export function PlansTable({ plans }: TableProps) {
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
        {plans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell className="font-medium">{plan.id}</TableCell>
            <TableCell className="font-medium">{plan.name}</TableCell>
            <TableCell><Badge>{badges_titles[plan.status]}</Badge></TableCell>
            <TableCell className='text-center text-xxs'>
              <span className='bg-green-200 font-bold p-2 rounded text-green-700'>

                {plan.currency_code} ${plan.value}
              </span>
            </TableCell>
            <TableCell className="text-right text-xxs">{get_time_diff(plan.created_at)}</TableCell>
            <TableCell className='text-center'>
              <Link prefetch={false} href={`/dashboard/plans/${plan.id}`}>
                <Button variant='outline' className='text-xxs'>Manage</Button>
              </Link></TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{plans.length} plans</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
