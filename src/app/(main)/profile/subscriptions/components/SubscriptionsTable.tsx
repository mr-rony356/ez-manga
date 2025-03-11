'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableCaption,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {Subscription} from '@/types'
import {get_time_diff} from "@/components/Series/helpers";
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaypal, faStripe} from "@fortawesome/free-brands-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {Badge} from "@/components/ui/badge";
import API from "@/services/api";
import {toast} from "sonner";


const SubscriptionStatus: Record<string, string> = {
    APPROVAL_PENDING: 'Approval pending',
    ACTIVE: 'Active',
    CANCELLED: 'Cancelled',
    SUSPENDED: 'Suspended',
    EXPIRED: 'Expired',
}


export default function SubscriptionsTable({subscriptions}: { subscriptions: Subscription[] }) {


    async function cancelSubscription(subscription_id: string | number) {
        toast.promise(API.post('/v2/subscriptions/' + subscription_id + '/cancel'), {
            success: 'Subscription successfully canceled!'
        })
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Payment gateway</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start date</TableHead>
                        <TableHead>Next charge</TableHead>
                        <TableHead>Cancel</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subscriptions && subscriptions.length > 0 && subscriptions.map((subscription) => {
                        return (
                            <TableRow key={subscription.id}>
                                <TableCell>{subscription.id}</TableCell>
                                <TableCell>{subscription.plan && subscription.plan.name}</TableCell>
                                <TableCell className={'text-xs'}>
                                    <Badge className={'flex flex-row gap-2 w-fit'} variant={'outline'}>
                                        <FontAwesomeIcon
                                            icon={(subscription.subscription_source === 'paypal' ?
                                                faPaypal :
                                                faStripe) as IconProp}/> {subscription.subscription_source === 'paypal' ? 'Paypal' : 'Stripe'}

                                    </Badge>
                                </TableCell>
                                <TableCell>{SubscriptionStatus[subscription.status]}</TableCell>
                                <TableCell>{get_time_diff(subscription.start_time)}</TableCell>
                                <TableCell>{get_time_diff(subscription.next_charge)}</TableCell>
                                <TableCell>
                                    <Button onClick={() => cancelSubscription(subscription.id)}
                                            variant={'destructive'}>Cancel</Button>
                                </TableCell>
                            </TableRow>
                        )
                    })
                    }
                </TableBody>
            </Table>
        </>
    )


}