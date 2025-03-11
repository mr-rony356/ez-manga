"use client";

import Link from "next/link";
import { useContext } from "react";
import { HeaderContext } from "../ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCrown,
  faGear,
  faHouse,
  faMoneyBills,
  faNewspaper,
  faStar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Website_Name } from "@global";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useAuthentication from "@/hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoreDialogTrigger } from "@/components/store-dialog";
import Image from "next/image";
import SeriesIcon from "/public/Icon.svg";
import homeIcon from "/public/home.svg";
import StoreIcon from "/public/store.svg";
import { usePathname } from "next/navigation";

type DrawerItemProps = {
  href: string;
  icon?: IconProp;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  label: string;
  children?: DrawerItemProps[];
  roles?: Array<"Editor" | "Admin" | "Reader" | "Guest" | undefined>;
};

const items: Array<DrawerItemProps> = [
  {
    label: "Home Page",
    href: "/",
    image: {
      src: homeIcon,
      alt: "Home",
      width: 64,
      height: 64,
    },
    roles: ["Editor", "Admin", "Reader", "Guest", undefined],
  },
  {
    label: "Series",
    href: "#",
    image: {
      src: SeriesIcon,
      alt: "Series",
      width: 64,
      height: 64,
    },
    roles: ["Editor", "Admin", "Reader", "Guest", undefined],
    children: [
      {
        label: "Comics",
        href: "/comics",
        icon: faNewspaper,
      },
      {
        label: "Novels",
        href: "/novels",
        icon: faNewspaper,
      },
    ],
  },
  {
    label: "Store",
    href: "#",
    image: {
      src: StoreIcon,
      alt: "Store",
      width: 64,
      height: 64,
    },
    roles: ["Editor", "Admin", "Reader", "Guest", undefined],
    children: [
      {
        label: "Comics",
        href: "/comics",
        icon: faNewspaper,
      },
      {
        label: "Novels",
        href: "/novels",
        icon: faNewspaper,
      },
    ],
  },

  {
    label: "Admin Dashboard",
    href: "/dashboard",
    icon: faGear,
    roles: ["Editor", "Admin"],
    children: [
      {
        label: "Announcements",
        href: "/dashboard/announcements",
        icon: faNewspaper,
      },
      {
        label: "Series",
        href: "/dashboard/series",
        icon: faNewspaper,
        children: [
          {
            label: "Banners",
            href: "/dashboard/banners",
            icon: faNewspaper,
          },
          {
            label: "Genres",
            href: "/dashboard/genres",
            icon: faNewspaper,
          },
        ],
      },
      {
        label: "Finances",
        href: "#",
        icon: faMoneyBills,
        roles: ["Admin"],
        children: [
          {
            label: "Plans",
            href: "/dashboard/plans",
            icon: faMoneyBills,
            roles: ["Admin"],
            children: [
              {
                label: "Subscriptions",
                href: "/dashboard/subscriptions",
                icon: faMoneyBills,
                roles: ["Admin"],
              },
            ],
          },
          {
            label: "Coins",
            href: "/dashboard/coins",
            icon: faMoneyBills,
            roles: ["Admin"],
          },
          {
            label: "Purchases",
            href: "/dashboard/purchases",
            icon: faMoneyBills,
            roles: ["Admin"],
          },
        ],
      },
      {
        label: "Users",
        href: "/dashboard/users",
        icon: faUsers,
        roles: ["Admin"],
      },
      {
        label: "Config",
        href: "/dashboard/config",
        icon: faGear,
        roles: ["Admin"],
      },
    ],
  },
];

const DrawerItem = ({
  item: { href, icon, image, label, children, roles },
}: {
  item: DrawerItemProps;
}) => {
  const { data } = useAuthentication();
  const pathname = usePathname();

  const isActive = pathname === href || pathname.startsWith(href + "/");

  if (roles && !roles.includes(data?.user.role)) {
    return null;
  }

  const IconOrImage = () => (
    <div className="flex justify-center items-center shrink-0">
      {icon ? (
        <FontAwesomeIcon icon={icon} />
      ) : image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="h-6 w-6"
        />
      ) : null}
    </div>
  );

  if (children) {
    return (
      <AccordionItem value={label} className="border-0">
        <AccordionTrigger className="p-0 overflow-hidden pr-2">
          <Link
            prefetch={false}
            className={`text-muted-foreground font-semibold text-[15px] gap-2 flex flex-row justify-start p-2 items-center rounded hover:bg-background hover:shadow-md transition-all ease-in duration-300 ${
              isActive ? "bg-[#1B1B1B] shadow-md" : ""
            }`}
            href={href}
          >
            <IconOrImage />
            <span className="line-clamp-1">{label}</span>
          </Link>
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <ul className="group-data-[open=true]:pl-4 text-xs gap-3 flex flex-col">
            {children.map((child) => (
              <DrawerItem key={child.label} item={child} />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      prefetch={false}
      className={`p-2  py-3 gap-2 flex flex-row justify-start items-center text-[16px] font-semibold rounded hover:bg-background hover:shadow-md transition-all ease-in duration-300 ${
        isActive ? "bg-[#1B1B1B]" : ""
      }`}
      href={href}
    >
      <IconOrImage />
      <span className="line-clamp-1">{label}</span>
    </Link>
  );
};

export default function DrawerBody() {
  const { open, setOpen } = useContext(HeaderContext);

  return (
    <div className="flex flex-col lg:items-center gap-3 pt-2">
      <Link
        prefetch={false}
        href={"/"}
        className={"shrink-0 mt-2 hidden lg:block"}
      >
        <img
          src="/wetried_only.png"
          className="h-6 shrink-0 mr-3 lg:group-data-[open=false]:duration-500  opacity-100 lg:group-data-[open=false]:animate-out lg:group-data-[open=false]:slide-out-to-left-full"
          alt={`${Website_Name} Logo`}
        />
      </Link>
      <Link
        prefetch={false}
        href={"/"}
        className={"lg:hidden"}
        onClick={() => setOpen(false)}
      >
        <Image
          src="/menu.svg"
          alt={`${Website_Name} Logo`}
          width={32}
          height={32}
          className="ml-4"
        />
      </Link>

      <ScrollArea className="p-0 m-0 max-h-[85vh] w-full pt-3 px-2">
        <Accordion type="multiple" className="w-full space-y-3">
          {items.map((item) => (
            <DrawerItem key={item.label} item={item} />
          ))}
          {/* <StoreDialogTrigger /> */}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
