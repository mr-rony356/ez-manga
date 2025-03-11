import { Metadata } from "next";
import { Website_Name } from "@global";
import { get_cookies, getUserData } from "@/services/server";
import SubscriptionsTable from "@/app/(main)/profile/subscriptions/components/SubscriptionsTable";

export const metadata: Metadata = {
    title: 'My subscriptions - ' + Website_Name,
}


export default async function MySubcriptionsPage() {

    const user_data = await getUserData()

    return (
        <>
            <div className={'bg-background p-4 rounded'}>
                <SubscriptionsTable subscriptions={user_data.user!.subscriptions} />

            </div>
        </>
    )

}