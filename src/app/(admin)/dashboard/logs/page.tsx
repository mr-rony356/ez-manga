import { Website_Name } from '@global'
import { Metadata } from 'next'
import UsersHeader from './components/Header'
import UsersTable from './components/Table'
import { UsersDashboardContextProvider as ContextProvider } from './components/Context'

export const metadata: Metadata = {
  title: 'Logs - ' + Website_Name,
}

const LogsDashboard = () => {
  return (
    <>
      <ContextProvider>
        <div className="min-h-screen container space-y-2">
          <UsersHeader />
          <UsersTable />
        </div>
      </ContextProvider>
    </>
  )
}
export default LogsDashboard
