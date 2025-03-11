import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { SubscriptionPlan, type Product } from '@/types'
import { env } from '@/env'
import { CoinsTable } from './components/coins-table'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Subscription plans - Omega Scans'
}

type PaginatedResults<T> = {
  data: T[]
  meta: any
}


export default async function Dashboard() {
  const res: PaginatedResults<Product> = await fetch(`${env.LOCAL_API}/store/coins`, {
    cache: 'no-cache',
  }).then((res) => res.json())
  return (
    <div className="flex min-h-screen gap-2 w-full flex-col container mt-4">
      <div className="flex flex-row gap-2">
        <Link prefetch={false} href="/dashboard/coins/add">
          <Button variant='outline'>Create coins package <PlusIcon className='ml-2' /></Button>
        </Link>
      </div>
      <div className="flex flex-col-gap-2 p-4 bg-muted rounded">
        <CoinsTable coins={res.data} />
      </div>
    </div>
  )
}
