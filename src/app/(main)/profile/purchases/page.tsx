import { Metadata } from 'next'
import ProfilePurchases from './components/profile-purchases'
import { Website_Name } from '@global'

export const metadata: Metadata = {
  title: 'Profile Purchases - ' + Website_Name,
  description: 'View your purchase history',
}

export default async function Page() {
  return <ProfilePurchases />
}
