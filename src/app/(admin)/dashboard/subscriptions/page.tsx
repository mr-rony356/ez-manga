import { Website_Name } from '@global'
import { Metadata } from 'next'
import { UsersDashboardContextProvider as ContextProvider } from './components/Context'
import SubscriptionsHeader from './components/Header'
import SubscriptionsTable from './components/Table'

export const metadata: Metadata = {
  title: 'Subscriptions - ' + Website_Name,
}

const PurchaseLogsDashboard = () => {
  return (
    <>
      <ContextProvider>
        <div className="min-h-[80vh] container space-y-2">
          <SubscriptionsHeader />
          <SubscriptionsTable />
        </div>
      </ContextProvider>
    </>
  )
}
export default PurchaseLogsDashboard
