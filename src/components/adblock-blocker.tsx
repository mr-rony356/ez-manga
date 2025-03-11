'use client'
import { useState, useEffect } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogOverlay,
    AlertDialogPortal
} from "@/components/ui/alert-dialog"
import { AlertDialogContent} from '@radix-ui/react-alert-dialog'


export default function AdblockBlocker(){


    const [adblock, setAdblock] = useState<boolean>(false)


    async function detectAdBlock() {
        const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
        try {
            await fetch(new Request(googleAdUrl)).catch(_ => setAdblock(true))
        } catch (e) {
            setAdblock(false)
        } finally {
            console.log(`AdBlock Enabled: ${adblock}`)
        }
    }

    useEffect(() => {
        detectAdBlock()
    }, []);

    return(
        <>
            {adblock &&
                <AlertDialog open={true}>
                    <AlertDialogPortal>
                        <AlertDialogOverlay className={'z-[99998] backdrop-blur-3xl'} />
                        <AlertDialogContent
                            className={"fixed left-[50%] top-[50%] z-[99999] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"}
                            >
                            <AlertDialogHeader>
                                <AlertDialogTitle>{`Don't use Adblock. We need Adsense to keep our website working.`}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Please, disable Adblock or whitelist our website, we promise not to flood your view with ads.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                        </AlertDialogContent>
                    </AlertDialogPortal>


                </AlertDialog>
            }
        </>
    )



}