import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Purchase, User } from '@/types'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPaypal, faStripe } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';

const ProfilePurchases = ({ subscriptions }: { subscriptions: User['subscriptions'] }) => {
    return (
        <div className="flex flex-col gap-3 p-4 bg-background rounded">
            <h1 className="text-2xl font-bold tracking-tight text-gray-200">
                Subscriptions
            </h1>
            <Table className="bg-background">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Gateway</TableHead>
                        <TableHead>Gateway Subscription ID</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subscriptions.length > 0 &&
                        subscriptions.map((subscription) => (
                            <TableRow key={subscription.id}>
                                <TableCell className="font-medium">
                                    {subscription.id}
                                </TableCell>
                                <TableCell className="flex flex-row gap-2 items-center">
                                    <Badge
                                        className={'flex flex-row gap-2 w-fit'}
                                        variant={'outline'}
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                (subscription.subscription_source === 'paypal'
                                                    ? faPaypal
                                                    : faStripe) as IconProp
                                            }
                                        />{' '}
                                        {subscription.subscription_source === 'paypal'
                                            ? 'Paypal'
                                            : 'Stripe'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {subscription.subscription_source == 'paypal'
                                        ? subscription.paypal_subscription_id
                                        : subscription.stripe_subscription_id}
                                </TableCell>
                                <TableCell className="text-right">
                                    {subscription.status}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link prefetch={false} href={`/dashboard/subscriptions/${subscription.id}`}>
                                        <Button variant="ghost">
                                            <SlidersHorizontal />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ProfilePurchases
