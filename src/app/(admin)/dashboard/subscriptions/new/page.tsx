import { PlanSelector } from "@/components/plan-selector"
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { env } from "@/env"
import type { PaginatedResults } from "@/lib/utils"
import { getUser } from "@/services/server"
import type { SubscriptionPlan } from "@/types"
import type { Metadata } from "next"
import { CreateSubscriptionForm } from "./components/form"
import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export const metadata: Metadata = {
  title: 'Add subscription - Omega Scans'
}


type Props = {
  params: {}
  searchParams: {
    user_id: string
  }
}


export default async function CreateSubscriptionPage({ params, searchParams: { user_id } }: Props) {
  const [user, res] = await Promise.all([
    getUser(user_id),
    fetch(`${env.LOCAL_API}/store/plans`).then((res) => res.json())
  ])

  return (
    <div className='container px-5 gap-3'>
      <div className="flex flex-col gap-2">
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Add new subscription</CardTitle>
            <CardDescription>Here you can add a subscription to any user of your choice.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateSubscriptionForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  )

}