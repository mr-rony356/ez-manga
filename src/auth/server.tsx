"use server";
import { cookies } from "next/headers";
import { Website_Local_API } from "@global";
import { User } from "@/types";

export type userDataResponse = {
  id: string;
  username: string;
  email: string;
  role: "Reader" | "Editor" | "Admin";
  coins: number;
  profile_picture: string;
  patreon_account: any;
};

export type UserDataResponse = {
  isLoggedIn: boolean;
  user: User | null;
};

type UsersDataResponse = {
  meta: any;
  data: User[];
};

export const auth = async (): Promise<UserDataResponse> => {
  const cookieStore = cookies();
  const string_cookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const url = new URL("/auth/user", Website_Local_API);
  const user_data = await fetch(url, {
    credentials: "include",
    headers: {
      cookie: string_cookies,
    },
  });

  return (await user_data.json()) as UserDataResponse;
};
