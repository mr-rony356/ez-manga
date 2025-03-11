import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Purchase } from '@/types'

const ProfilePurchases = ({ purchases }: { purchases: Purchase[] }) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-background rounded">
      <h1 className="text-2xl font-bold tracking-tight text-gray-200">
        Purchases
      </h1>
      <Table className="text-foreground divide-gray-800">
        {purchases && purchases.length == 0 && (
          <TableCaption>No purchases were made.</TableCaption>
        )}
        <TableHeader className="divide-gray-800 border-gray-800">
          <TableRow className="divide-gray-800 border-gray-800">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-gray-800 border-gray-800">
          {purchases.map((invoice) => (
            <TableRow key={invoice.id} className="border-gray-800">
              <TableCell className="font-medium">{invoice.paypal_id}</TableCell>
              <TableCell>{invoice.paid ? 'Paid' : 'Not paid'}</TableCell>
              <TableCell>{invoice.description}</TableCell>
              <TableCell className="text-right">{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProfilePurchases
