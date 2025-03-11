"use client";
import UserMenu from "./UserMenu";
import HeaderSearch from "./Search";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { Website_Name } from "@global";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MobileButton } from "./Drawer";
import useAuthentication from "@/hooks/useAuth";
import { atom, useAtom } from "jotai";
import { WebsiteNavigationMenu } from "@/components/Header/navigation-menu";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { NotificationsMenu } from "@/components/Header/Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { SidebarTrigger } from "../ui/sidebar";
import Image from "next/image";
import Logo from "/public/logo.svg";
import Sun from "/public/mode.svg";
import Moon from "/public/moon.svg";
import { Separator } from "@/components/ui/separator";
export const navbarState = atom<boolean>(false);

export default function Header() {
  const [goingDown, setIsGoingDown] = useState<boolean>(false);
  const [limit, setLimit] = useAtom(navbarState);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data } = useAuthentication();

  useEffect(() => {
    setMounted(true);
    var initialCoords = [0, 1];
    var clickTimer: any = null;

    function toggleNavbar() {
      if (window.scrollY === 0) return;
      if (clickTimer == null) {
        clickTimer = setTimeout(function () {
          clickTimer = null;
        }, 500);
      } else {
        clearTimeout(clickTimer);
        clickTimer = null;
        setLimit((state) => !state);
      }
    }

    function getScroll() {
      initialCoords.push(window.scrollY);
      if (
        initialCoords[initialCoords.length - 1] >
        initialCoords[initialCoords.length - 2]
      ) {
        setIsGoingDown(true);
        const max = Math.max(...initialCoords);
        const min = Math.min(...initialCoords);
        if (max - min >= 800) {
          setLimit(true);
          initialCoords = [window.scrollY, window.scrollY];
        } else {
          initialCoords = [min, max];
        }
      } else {
        const max = Math.max(...initialCoords);
        const min = Math.min(...initialCoords);
        if (min === 0) {
          setLimit(false);
          initialCoords = [window.scrollY, window.scrollY];
        } else {
          initialCoords = [min, max];
        }
      }
      if (Math.max(...initialCoords) <= 90) setLimit(false);
      if (window.scrollY <= 200) setLimit(false);
    }

    window.addEventListener("scroll", getScroll);
    window.addEventListener("click", toggleNavbar);

    return () => {
      window.removeEventListener("click", toggleNavbar);
      window.removeEventListener("scroll", getScroll);
      setIsGoingDown(false);
      setLimit(false);
    };
  }, []);

  return (
    <>
      <nav
        className="bg-[#141414]  border-b data-[limit=true]:-translate-y-full z-50 data-[limit=false]:translate-y-0 sticky top-[0px] transition-all duration-300 ease-in "
        data-is-going-down={goingDown}
        data-limit={limit}
      >
        <div className="px-3 lg:px-0 flex flex-row gap-2 items-center justify-between lg:justify-between p-4 max-w-[1583px] mx-auto lg:!pr-20">
          <div className="flex flex-row items-center gap-2">
            <Link
              prefetch={false}
              href={"/"}
              className={"shrink-0 flex flex-row gap-2 items-center"}
            >
              <Image
                src={Logo}
                width={200}
                height={100}
                className="shrink-0 w-[74px]  h-[33px] mr-3 hidden lg:block lg:group-data-[open=false]:duration-500  opacity-100 lg:group-data-[open=false]:animate-out lg:group-data-[open=false]:slide-out-to-left-full"
                alt={`${Website_Name} Logo`}
              />
            </Link>
            <WebsiteNavigationMenu />
            <MobileButton />
          </div>
          <div className="flex flex-row gap-1 items-center justify-between w-[70%] lg:w-fit">
            <HeaderSearch />
            <Separator
              orientation="vertical"
              className="h-3 lg:ml-4 ml-3 lg:mr-3 w-[3px] rounded-full mr-1"
            />
            <button
              suppressHydrationWarning={true}
              onClick={() =>
                theme === "dark" ? setTheme("light") : setTheme("dark")
              }
              className="text-muted-foreground text-lg flex flex-row gap-2 px-2 items-center hover:bg-background transition-all ease-in rounded group-data-[open=false]:hidden"
            >
              {theme === "dark" && mounted ? (
                <Image
                  src={Sun}
                  alt="Sun"
                  className="w-8 lg:w-auto h-8 lg:h-auto"
                />
              ) : (
                <Image
                  src={Moon}
                  alt="Moon"
                  className="w-8 lg:w-auto h-8 lg:h-auto"
                />
              )}
            </button>
            <UserMenu />
          </div>
        </div>
      </nav>
    </>
  );
}

export function AdminHeader() {
  const [goingDown, setIsGoingDown] = useState<boolean>(false);
  const [limit, setLimit] = useAtom(navbarState);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data } = useAuthentication();

  useEffect(() => {
    setMounted(true);
    var initialCoords = [0, 1];
    var clickTimer: any = null;

    function toggleNavbar() {
      if (window.scrollY === 0) return;
      if (clickTimer == null) {
        clickTimer = setTimeout(function () {
          clickTimer = null;
        }, 500);
      } else {
        clearTimeout(clickTimer);
        clickTimer = null;
        setLimit((state) => !state);
      }
    }

    function getScroll() {
      initialCoords.push(window.scrollY);
      if (
        initialCoords[initialCoords.length - 1] >
        initialCoords[initialCoords.length - 2]
      ) {
        setIsGoingDown(true);
        const max = Math.max(...initialCoords);
        const min = Math.min(...initialCoords);
        if (max - min >= 800) {
          setLimit(true);
          initialCoords = [window.scrollY, window.scrollY];
        } else {
          initialCoords = [min, max];
        }
      } else {
        const max = Math.max(...initialCoords);
        const min = Math.min(...initialCoords);
        if (min === 0) {
          setLimit(false);
          initialCoords = [window.scrollY, window.scrollY];
        } else {
          initialCoords = [min, max];
        }
      }
      if (Math.max(...initialCoords) <= 90) setLimit(false);
      if (window.scrollY <= 200) setLimit(false);
    }

    window.addEventListener("scroll", getScroll);
    window.addEventListener("click", toggleNavbar);

    return () => {
      window.removeEventListener("click", toggleNavbar);
      window.removeEventListener("scroll", getScroll);
      setIsGoingDown(false);
      setLimit(false);
    };
  }, []);

  return (
    <>
      <nav
        className="bg-background  border-b data-[limit=true]:-translate-y-full z-50 data-[limit=false]:translate-y-0 sticky top-[0px] transition-all duration-300 ease-in"
        data-is-going-down={goingDown}
        data-limit={limit}
      >
        <div className="container px-3 lg:px-5 flex flex-row gap-2 items-center justify-normal lg:justify-between p-4">
          <div className="flex flex-row items-center gap-2">
            <Link
              prefetch={false}
              href={"/"}
              className={"shrink-0 flex flex-row gap-2 items-center"}
            >
              <img
                src="/wetried_only.png"
                className="h-6 shrink-0 mr-3 hidden lg:block lg:group-data-[open=false]:duration-500  opacity-100 lg:group-data-[open=false]:animate-out lg:group-data-[open=false]:slide-out-to-left-full"
                alt={`${Website_Name} Logo`}
              />
              <span className="font-bold text-xxs hidden lg:flex">
                EZ Manga
              </span>
            </Link>
            <WebsiteNavigationMenu />
            <SidebarTrigger className="lg:hidden" />
          </div>
          <div className="flex flex-row gap-1 items-center justify-between w-full lg:w-fit">
            <HeaderSearch />
            <button
              suppressHydrationWarning={true}
              onClick={() =>
                theme === "dark" ? setTheme("light") : setTheme("dark")
              }
              className="text-muted-foreground text-lg flex flex-row gap-2 px-2 items-center hover:bg-background transition-all ease-in rounded group-data-[open=false]:hidden"
            >
              {theme === "dark" && mounted ? (
                <SunIcon style={{ fontSize: 24 }} />
              ) : (
                <MoonIcon style={{ fontSize: 24 }} />
              )}
            </button>
            <UserMenu />
          </div>
        </div>
      </nav>
    </>
  );
}

const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
