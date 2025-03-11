import { getUser } from '@/services/server'
import { Website_Name } from '@global'
import { Metadata } from 'next'
import { SingleUserContextProvider as ContextProvider } from './components/Context'
import UserProfileForm from './components/ProfileForm'
import ProfilePurchases from './components/ProfilePurchases'
import { getAllSeries } from '@/services/server/series'
import UserEditableSeries from './components/EditableSeries'
import ProfileSubscriptions from "./components/profile-subscriptions";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string }
}): Promise<Metadata> {
  const user = await getUser(id)

  return {
    title: `Editing ${user.username} - ${Website_Name}`,
  }
}

const SingleUserPage = async ({
  params: { id },
}: {
  params: { id: string }
}) => {
  const user = await getUser(id)
  const series = await getAllSeries()

  return (
    <ContextProvider user={user}>
      <div className="min-h-screen container px-5 space-y-4">
        <UserProfileForm />
        <UserEditableSeries series={series} />
        <ProfilePurchases purchases={user.purchases} />
        <ProfileSubscriptions subscriptions={user.subscriptions} />
      </div>
    </ContextProvider>
  )
}
export default SingleUserPage
