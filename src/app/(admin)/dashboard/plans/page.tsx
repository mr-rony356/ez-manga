import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { SubscriptionPlan } from '@/types'
import type { PaginatedResults } from '@/lib/utils'
import { env } from '@/env'
import { PlansTable } from './components/plans-table'
import { get_cookies } from '@/services/server'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Subscription plans - Omega Scans'
}
export default async function Dashboard() {

  const res: PaginatedResults<SubscriptionPlan> = await fetch(`${env.LOCAL_API}/store/plans/all`, {
    headers: {
      cookie: get_cookies()
    }
  }).then((res) => res.json())
  return (
    <div className="flex min-h-screen gap-2 w-full flex-col container">
      <div className="flex flex-row gap-2">
        <Link prefetch={false} href='/dashboard/plans/add'>
          <Button variant='outline'>Create new plan <PlusIcon className='ml-2' /></Button>
        </Link>
      </div>
      <div className="flex flex-col-gap-2 p-4 bg-muted rounded">
        <PlansTable plans={res.data} />
      </div>
    </div>
  )
}
