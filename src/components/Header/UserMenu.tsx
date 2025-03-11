"use client";

import {
  faUser,
  faGear,
  faBookmark,
  faCoins,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Discord_URL } from "@global";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import useAuthentication, { logOut } from "@/hooks/useAuth";
import { Skeleton } from "../ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { MoonIcon, ReloadIcon, SunIcon, UpdateIcon } from "@radix-ui/react-icons";
import { ChevronDownIcon } from "lucide-react";

const MenuItems = [
  // {
  //     title: 'Magasin',
  //     icon: faStore,
  //     href: '/store',
  //     allowed: ['Reader', 'Editor', 'Admin'],
  // },
  {
    title: "Bookmarks",
    icon: faBookmark,
    href: "/profile/bookmarks",
    allowed: ["Reader", "Editor", "Admin"],
  },
  {
    title: "Discord",
    icon: faDiscord,
    href: Discord_URL,
    allowed: ["Guest", "Reader", "Editor", "Admin"],
  },
  {
    title: "Settings",
    icon: faGear,
    href: "/profile/me",
    allowed: ["Reader", "Editor", "Admin"],
  },
  {
    title: "Admin",
    icon: faGear,
    href: "/dashboard",
    allowed: ["Editor", "Admin"],
  },
];

const UserMenu = () => {
  const { data, error, isLoading, mutate } = useAuthentication();
  const { theme, setTheme } = useTheme();

  if (isLoading) {
    return (
      <>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 lg:h-10 lg:w-10 rounded-full" />
        </div>
      </>
    );
  }

  return (
    <>
      {data && data.isLoggedIn && (
        <>
          <Popover >
            <PopoverTrigger asChild>
              <div className="flex flex-row gap-2">
                <Avatar className='cursor-pointer border-[1px] h-8 w-8 lg:h-10 lg:w-10 border-foreground'>
                  <AvatarImage src={data.user.profile_picture} alt={data.user.username} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-col hidden lg:flex">
                  <span className='text-xxs'>Welcome,</span>
                  <span className='font-bold text-primary text-xs'>{data.user.username}</span>
                </div>
                <ChevronDownIcon className='fill-primary/50 self-center' />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-screen lg:w-[300px] shadow-lg">
              <div className="flex flex-col gap-3 justify-center items-center">
                <div className="flex flex-row gap-2 items-center">

                  <div className="text-foreground space-x-2">
                    <FontAwesomeIcon size="sm" icon={faCoins} />
                    <span className='text-xxs'>{data.user.coins} coins</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full">
                  {MenuItems.filter((item) =>
                    item.allowed.includes(data.user.role)
                  ).map((item, index) => {
                    return (
                      <Link prefetch={false} key={index} href={item.href} >
                        <div className="px-4 py-4 bg-background text-foreground transition-colors rounded flex flex-row items-center justify-start gap-2 hover:bg-foreground/10">
                          <FontAwesomeIcon className='w-4 h-4' icon={item.icon as IconProp} />
                          <span className="text-xxs">{item.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                  <Link prefetch={false} href={"/api/logout"} >
                    <div className="px-4 py-4 bg-background text-foreground transition-colors rounded flex flex-row items-center justify-start gap-2">
                      <FontAwesomeIcon className='w-4 h-4' icon={faDoorOpen} />
                      <span className="text-xxs">Log out</span>
                    </div>
                  </Link>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}
      {!data?.isLoggedIn && (
        <>
          <div className="flex flex-row gap-x-4 items-center">
            <Link prefetch={false} href={"/login"}>
              <button className="inline-flex tracking-wide gap-2 items-center h-fit p-2 ease-in transition-all text-foreground text-[16px] font-medium rounded-lg">
                <FontAwesomeIcon icon={faUser} />
              </button>
            </Link>
          </div>
        </>
      )}
    </>
  );
};
export default UserMenu;
