import { CDN_Url } from "@global";

export function get_file_url(url: string | null): string {
  if (url) {
    return (url.startsWith("https") || url.startsWith("data")) === true
      ? url
      : CDN_Url + "/" + url;
  } else return "";
}
