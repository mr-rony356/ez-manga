"use client";
import useSWR from "swr";
import { getAnnouncements } from "@/services/server/series";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { fetcher } from "@/services";
import dayjs from "dayjs";
import { get_time_diff } from "../Series/helpers";
import { FileTextIcon } from "lucide-react";

export default function Announcements() {
  const { data, error, isLoading } = useSWR<{
    meta: any;
    data: {
      id: number;
      slug: string;
      title: string;
      created_at: string;
      content: string;
    }[];
  }>("/announcements", fetcher);

  const posts = data?.data;

  if (error) {
    return (
      <div className="p-4 rounded flex items-center justify-center text-foreground">
        <span>There was an error while rendering this component.</span>
      </div>
    );
  }

  if (!isLoading && data) {
    return (
      <>
        {!(posts && posts.length == 0) && (
          <div className="flex flex-col gap-2">
            <h1 className="text-xl lg:text-3xl text-left font-bold leading-tight text-foreground tracking-tighter md:text-6xl lg:leading-[1.1]">
              {" "}
              <FileTextIcon className='text-primary inline w-8 h-8 mr-2' />
              Announcements
            </h1>
            <h5 className="text-muted-foreground text-left text-base">
              The latest news on our website.
            </h5>
            <ul className="flex flex-col gap-2">
              {posts &&
                posts.length > 0 &&
                posts.map((post) => {
                  return (
                    <Link prefetch={false}

                      key={post.id}
                      href={`/announcements/${post.slug}`}
                    >
                      <li className="flex flex-row gap-3 bg-muted/20 px-4 rounded items-center shadow">
                        <img
                          src="/wetried_only.png"
                          className="h-6 shrink-0 mr-3 hidden lg:block lg:group-data-[open=false]:duration-500  opacity-100 lg:group-data-[open=false]:animate-out lg:group-data-[open=false]:slide-out-to-left-full"
                          alt={`Logo`}
                        />
                        <div className="flex flex-col gap-1 text-left py-2">
                          <h5 className="text-sm lg:text-base text-foreground  line-clamp-1">
                            {post.title}
                          </h5>
                          <p className="line-clamp-2 text-[10px] text-muted-foreground">
                            {get_time_diff(post.created_at)}
                          </p>
                        </div>
                      </li>
                    </Link>
                  );
                })}
            </ul>
          </div>
        )}
      </>
    );
  }
}
