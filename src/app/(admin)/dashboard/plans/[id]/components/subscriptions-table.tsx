import { Icons } from "@/components/Icons"
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
import type { Subscription } from "@/types"

type TableProps = {
  subscriptions: Subscription[]
}

export function SubscriptionsTable({ subscriptions }: TableProps) {
  return (
    <Table className='bg-background rounded overflow-hidden'>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Gateway Sub. ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Last payment date</TableHead>
          <TableHead>Next charge</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.length > 0 && subscriptions.map((subscription) => (
          <TableRow key={subscription.id}>
            <TableCell className="font-medium">{subscription.id}</TableCell>
            <TableCell className='text-center'>{subscription.subscription_source === 'paypal' ? <Icons.paypal className='h-4' /> : ''}</TableCell>
            <TableCell className="font-medium">{subscription.paypal_subscription_id}</TableCell>
            <TableCell>{subscription.user.username}</TableCell>
            <TableCell>{get_time_diff(subscription.last_payment_date)}</TableCell>
            <TableCell>{get_time_diff(subscription.next_charge)}</TableCell>
            <TableCell className="text-right">{subscription.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>Total</TableCell>
          <TableCell className="text-right">{subscriptions.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
