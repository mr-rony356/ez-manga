import { env } from "@/env";
import { get_cookies } from "@/services/server";
import type { SubscriptionPlan } from "@/types";
import type { Metadata } from "next";
import {
  AlertTitle,
  Alert,
  AlertDescription,
} from '@/components/ui/alert'
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PlanForm from "./components/form";
import { SubscriptionsTable } from "./components/subscriptions-table";


type PageParams = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params: { id } }: PageParams): Promise<Metadata> {

  const plan: SubscriptionPlan = await fetch(`${env.LOCAL_API}/store/plans/${id}`, {
    headers: {
      cookie: get_cookies(),
    }
  }).then((res) => res.json())


  return {
    title: `Edit ${plan.name} - Omega Scans`,
  }
}


export default async function EditProductPage({ params: { id } }: PageParams) {
  const plan: SubscriptionPlan = await fetch(`${env.LOCAL_API}/store/plans/${id}`, {
    headers: {
      cookie: get_cookies(),
    }
  }).then((res) => res.json())


  return (
    <div className="flex container min-h-screen w-full flex-col gap-2">
      <Alert>
        <AlertTitle><InfoCircledIcon className='inline-block' /> Some advices!</AlertTitle>
        <AlertDescription className='text-muted-foreground'>{`Beware you can't edit a subscription plan's value! When plans are created, their value is sent to PayPal and a billing plan is created on their database, changing its price would be troublesome and it is not worth the work!`}</AlertDescription>
      </Alert>
      <PlanForm plan={plan} />
      <SubscriptionsTable subscriptions={plan.subscriptions} />
    </div>
  )
}
