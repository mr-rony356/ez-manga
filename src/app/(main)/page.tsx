import { HeroItem } from "@/components/Slider";
import Template1 from "@/components/templates/template_1";
import Template2 from "@/components/templates/template_2";
import { env } from "@/env";
import type { PaginatedResults } from "@/lib/utils";
import { Series } from "@/types";
import { Website_Local_API } from "@global";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: env.HOME_SEO_TITLE,
  description: env.HOME_DESCRIPTION,
  openGraph: {
    title: env.HOME_SEO_TITLE,
    description: env.HOME_DESCRIPTION,
    images: ["/icon.png"],
  },
};

type Announcement = {
  id: number;
  slug: string;
  title: string;
  created_at: string;
  content: string;
};

const Templates = {
  1: ({
    comics,
    novels,
    heroes,
    new_series,
    coming_soon,
    completed,
    editors_pick,
  }: {
    comics: Series[];
    novels: Series[];
    heroes: HeroItem[];
    new_series: Series[];
    coming_soon: Series[];
    completed: Series[];
    editors_pick: Series[];
    announcements: PaginatedResults<Announcement>;
  }) => {
    return (
      <Template1
        comics={comics}
        novels={novels}
        heroes={heroes}
        new_series={new_series}
        coming_soon={coming_soon}
        editors_pick={editors_pick}
        completed={completed}
      />
    );
  },
  2: ({
    comics,
    novels,
    heroes,
    new_series,
    coming_soon,
    announcements,
    completed,
    editors_pick,
  }: {
    comics: Series[];
    novels: Series[];
    heroes: HeroItem[];
    new_series: Series[];
    coming_soon: Series[];
    completed: Series[];
    editors_pick: Series[];
    announcements: PaginatedResults<Announcement>;
  }) => {
    return (
      <Template2
        comics={comics}
        novels={novels}
        heroes={heroes}
        new_series={new_series}
        coming_soon={coming_soon}
        completed={completed}
        editors_pick={editors_pick}
      />
    );
  },
};

export default async function Home() {
  const [
    comics,
    novels,
    heroes,
    new_series,
    completed,
    editors_pick,
    coming_soon,
    announcements,
  ] = await Promise.all([
    (
      await (
        await fetch(`${Website_Local_API}/latest/comics`, {
          next: {
            tags: ["home"],
          },
        })
      ).json()
    ).data,
    (
      await (
        await fetch(`${Website_Local_API}/latest/novels`, {
          next: {
            tags: ["home"],
          },
        })
      ).json()
    ).data,
    await (
      await fetch(`${Website_Local_API}/series/banners`, {
        next: {
          tags: ["home"],
        },
      })
    ).json(),
    await (
      await fetch(`${env.LOCAL_API}/new`, {
        next: {
          tags: ["home"],
        },
      })
    ).json(),
    await (
      await fetch(`${env.LOCAL_API}/completed`, {
        next: {
          tags: ["home"],
        },
      })
    ).json(),
    await (
      await fetch(`${env.LOCAL_API}/editors_pick`, {
        next: {
          tags: ["home"],
        },
      })
    ).json(),

    await (
      await fetch(`${env.LOCAL_API}/coming_soon`, {
        next: {
          tags: ["home"],
        },
      })
    ).json(),
    await (
      await fetch(`${env.LOCAL_API}/announcements`, {
        next: {
          tags: ["home"],
        },
      })
    ).json(),
  ]);
  return (
    <div>
      {Templates[env.HOME_TEMPLATE]({
        comics: comics.slice(0, 12),
        novels,
        heroes,
        new_series,
        coming_soon,
        completed,
        editors_pick,
        announcements,
      })}
    </div>
  );
}
