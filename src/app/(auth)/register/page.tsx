
import { Metadata } from "next";
import { Website_Name } from "../../../../consts";
import RegisterClient from "./client";



export const metadata: Metadata = {
    title: `Sign Up - ${Website_Name}`
}


export default function RegisterPage() {



    return (



        <>
            <RegisterClient />
        </>

    )
}