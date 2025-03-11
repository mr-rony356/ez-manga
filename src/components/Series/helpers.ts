import moment from "moment";

export function get_time_diff(time: string) {
  const current = Date.now();
  const date = new Date(time);
  const diffInHours = (current - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return "new";
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  }
}

export interface Series {
  adult: boolean;
  alternative_names: string;
  author: string;
  background: string;
  chapters: Chapter[];
  description: string;
  id: string;
  meta: {
    who_bookmarked_count: string;
    chapters_count: string;
  };
  release_year: string;
  seasons: Season[];
  series_slug: string;
  series_type: "Comic" | "Novel";
  studio: string;
  tags: Tag[];
  status: string;
  thumbnail: string;
  title: string;
  total_views: number;
}

export const fetcher = (...args: any) =>
  fetch(...[args]).then((res) => res.json());

export interface Chapter {
  chapter_name: string;
  chapter_slug: string;
  chapter_thumbnail: string;
  chapter_title: string | null;
  created_at: string;
  id: number;
  index: string;
  price: number;
  series_id: string;
  updated_at: string;
  views: number;
}

export interface Season {
  chapters: Chapter[];
  created_at: SVGStringList;
  id: string;
  index: number;
  season_name: string;
  series_id: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  description: string;
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}
