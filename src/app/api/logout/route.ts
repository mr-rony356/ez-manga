import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Website_URL } from "@global";
import { env } from "@/env";

export async function GET(request: NextRequest, response: NextResponse) {
  const cookieStore = cookies();
  const auth_token = cookieStore.get("ts-session");
  if (auth_token) {
    cookieStore.set({
      name: "ts-session",
      value: "",
      maxAge: 0,
    });

    return NextResponse.redirect(
      new URL("/login", env.NEXT_PUBLIC_WEBSITE_URL).toString()
    );
  } else {
    return NextResponse.redirect(
      new URL("/login", env.NEXT_PUBLIC_WEBSITE_URL).toString()
    );
  }
}
