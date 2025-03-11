"use client";
import {} from "react";
import { faClock, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useMediaQuery } from "usehooks-ts";
import useSWR from "swr";
import { fetcher } from "@/services";
import CircularProgress from "@mui/material/CircularProgress";
import { get_time_diff } from "@/components/Series/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import API from "@/services/api";
import { toast } from "sonner";
import useAuthentication from "@/hooks/useAuth";

type Notification = {
  id: number;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
};

export const NotificationsMenu = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data } = useAuthentication();

  const {
    data: notifications,
    isLoading,
    error,
    mutate,
  } = useSWR<Notification[]>("/notifications", fetcher);

  async function delete_all() {
    toast.promise(API.post("/notifications/delete_all"), {
      loading: "Deleting...",
      success: "Notifications deleted successfully.",
      error: "Failed to delete notifications.",
    });
    mutate();
  }

  async function mark_all_as_read() {
    toast.promise(API.post("/notifications/mark_all_as_read"), {
      loading: "Marking as read...",
      success: "Notifications marked as read successfully.",
      error: "Failed to mark notifications as read.",
    });
    mutate();
  }

  return (
    <>
      {isDesktop && data && data.isLoggedIn && (
        <Popover>
          <PopoverTrigger className={"relative"}>
            <FontAwesomeIcon icon={faMessage} />
            {notifications &&
              notifications.length > 0 &&
              notifications.filter((n) => !n.is_read).length > 0 && (
                <div
                  className={
                    "rounded-[100%] bg-red-600 animate-pulse py-[1px] px-[4px] text-[6px] absolute top-0 right-[-5px]"
                  }
                >
                  <span>{notifications.filter((n) => !n.is_read).length}</span>
                </div>
              )}
          </PopoverTrigger>
          <PopoverContent className={"bg-background"}>
            {isLoading && <CircularProgress />}
            {notifications && notifications.length > 0 && (
              <div className={"flex flex-col gap-2"}>
                <span className={"text-muted-foreground text-xxs"}>
                  Notifications
                </span>
                <Button
                  variant={"outline"}
                  onClick={mark_all_as_read}
                  className={"w-full text-xxs"}
                >
                  Mark all as read
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={delete_all}
                  className={"w-full text-xxs"}
                >
                  Delete all notifications
                </Button>
                <ScrollArea className={"w-full h-[400px]"}>
                  <ul
                    className={"flex flex-col gap-2 rounded-lg overflow-hidden"}
                  >
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                  </ul>
                  <ScrollBar orientation={"vertical"} />
                </ScrollArea>
              </div>
            )}
            {notifications && notifications.length === 0 && (
              <span className={"text-muted-foreground"}>No notifications.</span>
            )}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export const NotificationItem = ({
  notification,
}: {
  notification: Notification;
}) => {
  async function delete_notification() {
    toast.promise(API.delete("/notifications/" + notification.id), {
      loading: "Deleting...",
      success: "Notification deleted successfully.",
      error: "Failed to delete notification.",
    });
  }

  async function mark_as_read() {
    toast.promise(API.post(`/notifications/${notification.id}/mark_as_read`), {
      loading: "Marking as read...",
      success: "Notification marked as read successfully.",
      error: "Failed to mark notification as read.",
    });
  }

  return (
    <li
      className={
        "flex flex-col gap-2 p-4 even:bg-muted-foreground/10 odd:bg-muted-foreground/25 rounded-lg"
      }
    >
      <div className={"flex flex-col gap-1"}>
        <div className={"flex flex-row gap-2"}>
          <span className={"font-bold"}>{notification.title}</span>
          {!notification.is_read && (
            <Badge className={"animate-pulse text-xxs"} variant={"destructive"}>
              NEW
            </Badge>
          )}
        </div>
        <span
          className={
            "text-muted-foreground flex flex-row gap-1 items-center text-xxs"
          }
        >
          <FontAwesomeIcon className={"text-[75%]"} icon={faClock} />
          {get_time_diff(notification.created_at)}
        </span>
      </div>
      <p className={"text-muted-foreground text-xs line-clamp-2"}>
        {notification.description}
      </p>
      <div className={"flex flex-row gap-2"}>
        <Button
          variant={"outline"}
          onClick={mark_as_read}
          className={"w-full text-xxs"}
        >
          Mark as read
        </Button>
        <Button
          variant={"destructive"}
          onClick={delete_notification}
          className={"w-full text-xxs"}
        >
          Delete
        </Button>
      </div>
    </li>
  );
};
