import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Website_Name } from "@global";
import { Metadata } from "next";
import { env } from "@/env";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Maintenance - ' + Website_Name
}


export default async function MaintenancePage() {
    return (
        <div className="container px-5 lg:px-0 min-h-screen flex flex-col gap-2 items-center justify-center">
            <h1 className={'text-lg font-bold'}>{Website_Name}</h1>
            <Alert className={'w-fit'}>
                <AlertTitle>{`We're having a short maintenance! We'll be back up pretty soon.`}</AlertTitle>
                <AlertDescription>
                    {`In order to fix some issues, we had to take the website down for a few moments. Why don't you join our discord in the mean time?`}
                </AlertDescription>
            </Alert>
            <Link prefetch={false} href={env.NEXT_PUBLIC_DISCORD_URL}>
                <Button className={'bg-purple-700 font-bold hover:bg-purple-800'}>
                    Join our discord server <FontAwesomeIcon icon={faDiscord as IconProp} />
                </Button>

            </Link>
        </div>
    )

}