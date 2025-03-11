"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { useContext, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/services";
import { Purchase } from "@/types";
import CircularProgress from "@mui/material/CircularProgress";
import { LogsDashboardContext } from "./Context";
import UsersPagination from "./Pagination";
import { toast } from "sonner";
import { get_time_diff } from "@/components/Series/helpers";
import { subscriptionSchema } from "../[id]/components/card";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPaypal, faStripe } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubscriptionsTable() {
  const { page, query, orderBy, setLastPage, lastPage, from, to } =
    useContext(LogsDashboardContext);
  const { data, isLoading } = useSWR<{
    data: z.infer<typeof subscriptionSchema>[];
    meta: any;
  }>(
    `/subscriptions/query?${new URLSearchParams({
      page: page.toString(),
      query,
      orderBy,
    }).toString()}`,
    fetcher
  );

  useEffect(() => {
    setLastPage(data?.meta["last_page"]);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex">
        <CircularProgress />
      </div>
    );
  }

  if (data) {
    const subscriptions = data.data;
    return (
      <div className="space-y-2">
        <Table className="bg-background">
          <TableCaption>{`Showing ${page} out of ${lastPage} page(s).`}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Gateway Subscription ID</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length > 0 &&
              subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    {subscription.id}
                  </TableCell>
                  <TableCell className="flex flex-row gap-2 items-center">
                    <Badge
                      className={"flex flex-row gap-2 w-fit"}
                      variant={"outline"}
                    >
                      <FontAwesomeIcon
                        icon={
                          (subscription.subscription_source === "paypal"
                            ? faPaypal
                            : faStripe) as IconProp
                        }
                      />{" "}
                      {subscription.subscription_source === "paypal"
                        ? "Paypal"
                        : "Stripe"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {subscription.subscription_source == "paypal"
                      ? subscription.paypal_subscription_id
                      : subscription.stripe_subscription_id}
                  </TableCell>
                  <TableCell className="text-right">
                    {subscription.status}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link prefetch={false}

                      href={`/dashboard/subscriptions/${subscription.id}`}
                    >
                      <Button variant="ghost">
                        <SlidersHorizontal />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <UsersPagination />
      </div>
    );
  }
}
