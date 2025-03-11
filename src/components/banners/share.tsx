import { Share1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
export default function ShareBanner() {
  return (
    <Link href="https://share.ezmanga.com" target="_blank">
      <div className="flex flex-row items-center justify-between p-3 lg:p-4 py-2 rounded-sm bg-[#181818] border-4 border-[#1c1c1ca1] hover:bg-accent/50 transition-colors shadow-lg">
        <div className="flex items-center gap-4 ">
        <div className="flex items-center lg:gap-4 gap-3">
        <div className="w-[3px] h-12 bg-white/20 rounded-full"></div>
            <div>
              <h3 className="font-bold text-[#ECECEC] text-left lg:text-sm text-xs">
                Share EZ Manga{" "}
              </h3>
              <p className="text-muted-foreground lg:text-xs text-xxs text-left">
                Bring your friends into the world of EZ Manga!{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#4CAF50] to-[#204921] text-white px-4 py-2 rounded-full lg:text-sm text-[12px] font-bold min-w-[110px]">
          <Share1Icon className="w-4 h-4" />
          Share
        </div>
      </div>
    </Link>
  );
}
