"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContext, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/services";
import CircularProgress from "@mui/material/CircularProgress";
import { AnnouncementsDashboardContext } from "./Context";
import { AnnouncementsPagination } from "./Pagination";
import Link from "next/link";
import moment from "dayjs";

export function AnnouncementsTable() {
  const { page, query, orderBy, setLastPage, lastPage } = useContext(
    AnnouncementsDashboardContext
  );
  const { data, error, isLoading } = useSWR<{
    data: {
      id: number;
      slug: string;
      title: string;
      created_at: string;
      content: string;
    }[];
    meta: any;
  }>(
    `/announcements?${new URLSearchParams({
      page: page.toString(),
      perPage: "25",
      query,
      orderBy,
    }).toString()}`,
    fetcher
  );

  useEffect(() => {
    setLastPage(data?.meta["last_page"]);
  }, [data, setLastPage]);

  if (isLoading) {
    return (
      <div className="flex">
        <CircularProgress />
      </div>
    );
  }

  if (data) {
    const announcements = data.data;
    return (
      <div className="space-y-2">
        <Table className="bg-background rounded">
          <TableCaption className="text-muted-foreground">{`Showing ${page} out of ${lastPage} page(s).`}</TableCaption>

          <TableHeader>
            <TableRow className="divide-gray-800 border-gray-800 text-muted-foreground">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Created at</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-200">
            {announcements.length > 0 &&
              announcements.map((post) => (
                <TableRow
                  key={post.id}
                  className="divide-gray-800 border-gray-800"
                >
                  <TableCell className="font-medium">{post.id}</TableCell>
                  <TableCell className="flex flex-row gap-2 items-center">
                    {post.title}
                  </TableCell>
                  <TableCell>{post.slug}</TableCell>
                  <TableCell className="text-right">
                    {moment(post.created_at).format("MM/DD/YYYY")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      prefetch={false}
                      href={`/dashboard/announcements/${post.id}`}
                    >
                      <button className="bg-slate-600 text-gray-200 rounded px-6 py-2 text-[12px]">
                        Edit
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <AnnouncementsPagination />
      </div>
    );
  }
}
