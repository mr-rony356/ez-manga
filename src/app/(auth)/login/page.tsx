
import LoginClient from "./client";
import { Metadata } from "next";
import { Website_Name } from "../../../../consts";
import { cookies } from 'next/headers'
import { LoginForm } from "./components/login-form";
export const metadata: Metadata = {
    title: `Log in - ${Website_Name}`
}


export default function LoginPage() {



    return (



        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm />
            </div>
        </div>

    )
}