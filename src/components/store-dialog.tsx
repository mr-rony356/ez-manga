"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { atom, useAtom } from "jotai";
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { ChevronDown, Store } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Icons } from "./Icons";
import useSWR from "swr";
import { fetcher } from "@/services";
import { Product } from "@/types";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useState, useEffect, type ChangeEvent, use, useContext } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { HomeIcon } from "@radix-ui/react-icons";
import API from "@/services/api";
import { toast } from "sonner";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { HeaderContext } from "./Header/ContextProvider";
import StoreIcon from "/public/store.svg";
import Image from "next/image";
import { cn } from "@/lib/utils";

const dialogOpenState = atom(false);
const purchaseIDState = atom("");
const tab = atom("shop");
const paymentUrl = atom("");

export interface CreateOrderResponse {
  id: string;
  status: string;
  payment_source: PaymentSource;
  links: Link[];
}

export interface PaymentSource {
  paypal: Paypal;
}

export interface Paypal {}

export interface Link {
  href: string;
  rel: string;
  method: string;
}

const ShopScreen = () => {
  const { data, isLoading, error } = useSWR<{ data: Product[] }>(
    "/store/coins",
    fetcher
  );
  const [product, setProduct] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [fee, setFee] = useState(0);
  const [url, setPaymentUrl] = useAtom(paymentUrl);
  const [currentTab, setTab] = useAtom(tab);
  const [purchaseId, setPurchaseID] = useAtom(purchaseIDState);
  const [mountPaypal, setMountPaypal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fees = 1.5 + subtotal * 0.054;
    setFee(Math.round(fees * 10) / 10);
  }, [subtotal]);

  async function create_order() {
    const response = await API.post<CreateOrderResponse>("/v2/paypal/order", {
      product_id: product,
    });
    return response.data.id;
  }

  async function handleUserSubmit() {
    setMountPaypal(true);
  }

  useEffect(() => {
    setSubtotal(data && data.data.length > 0 ? data.data[0].price : 5);
    setProduct(data && data.data.length > 0 ? data.data[0].id.toString() : "");
  }, [data]);

  async function capture_order(order_id: string) {
    setPurchaseID(order_id);
    const response = await API.post(`/v2/paypal/order/${order_id}/capture`);
    return response.data;
  }

  function handleUserInput(product_id: string) {
    const product = data?.data.find(
      (product) => product.id.toString() == product_id
    );
    const value = product?.price.toString()!;
    setProduct(product_id);
    setSubtotal(Math.max(parseFloat(value), 5));
  }

  return (
    <>
      <DialogTitle className="text-lg font-bold">
        Get Coins Instantly!
      </DialogTitle>
      <h5 className="text-muted-foreground text-xs">
        Purchase coins securely with your preferred payment method!
      </h5>
      <RadioGroup
        defaultValue="paypal"
        className="grid grid-cols-1 gap-4 w-full"
      >
        <div>
          <RadioGroupItem
            value="paypal"
            id="paypal"
            className="peer sr-only"
            aria-label="Paypal"
          />
          <Label
            htmlFor="paypal"
            className="flex flex-row items-center justify-center gap-3 font-bold rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Icons.paypal className="h-12 w-12 text-blue-400" /> PayPal
          </Label>
        </div>
      </RadioGroup>
      {!isLoading && (
        <RadioGroup
          value={product}
          onValueChange={handleUserInput}
          className="grid grid-cols-3 gap-3 w-full"
        >
          {data!.data.map((item) => (
            <div key={item.id}>
              <RadioGroupItem
                id={`coins-${item.id}`}
                value={item.id.toString()}
                className="peer sr-only"
              />
              <Label
                htmlFor={`coins-${item.id}`}
                className="flex flex-col px-2 py-4 items-center justify-center w-full border border-muted rounded-md peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <h5 className="text-xs font-bold">{item.name}</h5>
                <h5 className="text-xxs text-muted-foreground">
                  ${item.price.toLocaleString()}.00
                </h5>
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
      {isLoading && (
        <div className="grid grid-cols-2 w-full gap-3">
          <div className="row-span-2 col-span-full" />
        </div>
      )}
      <div className="p-4 bg-foreground/10 w-full rounded-lg flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <Label className="flex flex-row items-center gap-2 text-muted-foreground text-[12px]">
            <Icons.coin />
            Subtotal
          </Label>
          <span>${subtotal}</span>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Label className="flex flex-row items-center gap-2 text-muted-foreground text-[12px]">
            <Icons.receipt />
            Processing Fees
          </Label>
          <span>${fee}</span>
        </div>
        <Separator className="w-full grow bg-foreground/50 my-2" />
        <div className="flex flex-row justify-between items-center">
          <Label className="flex flex-row items-center gap-2 text-muted-foreground text-[12px]">
            <Icons.calculator />
            Total
          </Label>
          <span>${subtotal + fee}</span>
        </div>
      </div>
      {!mountPaypal && (
        <Button className="w-full py-2" onClick={handleUserSubmit}>
          <Icons.paypal className="h-4 w-4 text-foreground mr-2" />
          Pay with PayPal
        </Button>
      )}
      {mountPaypal && (
        <div className="w-full">
          <PayPalButtons
            style={{ layout: "vertical", disableMaxWidth: false }}
            disabled={false}
            className="w-full"
            fundingSource={undefined}
            createOrder={async () => {
              return await create_order();
            }}
            onApprove={async (data) => {
              await capture_order(data.orderID || "");
              setTab("waiting");
            }}
          />
        </div>
      )}
    </>
  );
};

const WaitingScreen = () => {
  const [purchaseId] = useAtom(purchaseIDState);
  const [currentTab, setTab] = useAtom(tab);

  const { data } = useSWR<{ paid: boolean }>(
    purchaseId !== "" ? `/orders/${purchaseId}/status` : null,
    fetcher,
    {
      refreshInterval: 3000,
    }
  );

  useEffect(() => {
    if (data && data.paid) {
      setTab("success");
    }
  }, [data]);

  return (
    <>
      <Icons.spinner className="w-12 h-12 animate-spin" />
      <DialogTitle>Waiting for your payment...</DialogTitle>
      <h5 className="text-muted-foreground text-xs">
        This window will be updated once your payment has been done!
      </h5>
    </>
  );
};

const SuccessScreen = () => {
  function reload() {
    window.location.href = "/";
  }
  return (
    <>
      <Icons.check className="w-12 h-12" />
      <DialogTitle>Payment successful!</DialogTitle>
      <h5 className="text-muted-foreground text-xs text-center">
        You have successfully purchased coins! Start spending them on your
        favorite series!
      </h5>
      <Button className="w-full py-2" onClick={reload}>
        <HomeIcon className="h-4 w-4 text-foreground mr-2" />
        Go to Home
      </Button>
    </>
  );
};

export function StoreDialogTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useAtom(dialogOpenState);
  return (
    <div
      onClick={() => setOpen(!open)}
      className={cn(navigationMenuTriggerStyle(), className)}
    >
      <Image src={StoreIcon} alt="Store" className="w-4 h-4 mr-2" /> Store{" "}
      <ChevronDown className="w-6 h-6 ml-4" />
    </div>
  );
}

export default function StoreDialog() {
  const [open, setOpen] = useAtom(dialogOpenState);
  const [currentTab, setTab] = useAtom(tab);
  const { open: sidebarOpen, setOpen: setSidebarOpen } =
    useContext(HeaderContext);

  useEffect(() => {
    if (open) {
      setSidebarOpen(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Tabs value={currentTab}>
          <TabsContent
            value="shop"
            className="flex flex-col gap-4 items-center"
          >
            <ShopScreen />
          </TabsContent>
          <TabsContent
            value="waiting"
            className="flex flex-col gap-4 items-center"
          >
            <WaitingScreen />
          </TabsContent>
          <TabsContent
            value="success"
            className="flex flex-col gap-4 items-center"
          >
            <SuccessScreen />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
