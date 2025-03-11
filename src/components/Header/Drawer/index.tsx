"use client";
import { Fragment, useContext } from "react";
import { HeaderContext } from "../ContextProvider";
import { Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import DrawerBody from "./DrawerBody";
import DrawerFooter from "./DrawerFooter";
import Menu from "/public/menu.svg";
import Image from "next/image";
const ADMIN_ROLES = ["Admin", "Editor"];

const HeaderDrawer = () => {
  const { open, setOpen } = useContext(HeaderContext);

  return (
    <>
      {/* Overlay */}
      <Transition.Root
        show={open}
        as={Fragment}
        enter="transition-opacity ease-linear duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 lg:hidden bg-black/80  z-[50] backdrop-blur-sm"
        />
      </Transition.Root>
      <div
        data-open={open}
        className="group bg-[#151515] py-4 px-2 text-xs flex shadow-2xl shadow-foreground/10 lg:hidden text-card-foreground flex-col justify-between mr-16 w-full h-[100vh] top-0 left-0 inset-0 max-w-[256px] data-[open=false]:-translate-x-full data-[open=false]:lg:translate-x-0 flex-1 fixed z-[100] data-[open=true]:w-[256px] data-[open=false]:w-[64px]   border-0 border-r border-background overflow-hidden transition-all ease-in duration-300"
      >
        {/* Parte de cima do Drawer */}

        <DrawerBody />

        {/* Parte de baixo do Drawer */}
        <DrawerFooter />
      </div>
    </>
  );
};
export const AdminDrawer = () => {
  const { open, setOpen } = useContext(HeaderContext);

  return (
    <>
      {/* Overlay */}
      <Transition.Root
        show={open}
        as={Fragment}
        enter="transition-opacity ease-linear duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 lg:hidden bg-[#151515] z-[998] backdrop-blur-sm"
        />
      </Transition.Root>
      <div
        data-open={open}
        className="group data-[open=false]:-translate-x-full data-[open=false]:lg:translate-x-0 bg-[#151515] py-4 px-2 text-xs flex text-card-foreground flex-col justify-between mr-16 w-full h-[100vh] top-0 left-0 inset-0 max-w-[256px]  flex-1 fixed z-[999] data-[open=true]:w-[256px] data-[open=false]:w-[64px]   border-0 border-r border-background overflow-hidden transition-all ease-in duration-300"
      >
        {/* Parte de cima do Drawer */}

        <DrawerBody />

        {/* Parte de baixo do Drawer */}
        <DrawerFooter />
      </div>
    </>
  );
};

export const MobileButton = () => {
  const { open, setOpen } = useContext(HeaderContext);

  return (
    <button
      type="button"
      className="text-foreground lg:hidden"
      suppressHydrationWarning={true}
      onClick={() => setOpen(!open)}
    >
      <Image src={Menu} alt="Menu" width={32} height={32} />
    </button>
  );
};

export default HeaderDrawer;
