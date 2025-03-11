import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import kofiIcon from "/public/kofi.png";
import Image from "next/image";
export default function KofiBanner() {
  return (
    <Link href="https://ko-fi.com/quantum" target="_blank">
      <div className="flex flex-row items-center justify-between p-3 lg:p-4 py-2 rounded-sm bg-[#181818] border-4 border-[#1c1c1ca1] hover:bg-accent/50 transition-colors shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center lg:gap-4 gap-3">
            <div className="w-[4px] h-14 bg-white/20 rounded-full"></div>
            <div>
              <h3 className="font-bold text-[#ECECEC] text-left lg:text-sm text-xs">
                Support us by donating on Ko-fi!{" "}
              </h3>
              <p className="text-muted-foreground lg:text-xs text-xxs text-left max-w-[220px] lg:max-w-none">
                You can earn coins as a reward to read your favorite series!{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center  gap-3 bg-[#FF610E] text-white px-4 py-2 rounded-full lg:text-sm text-[12px] min-w-[110px] font-bold">
          <Image src={kofiIcon} alt="Kofi" width={20} height={20} />
          KO-FI
        </div>
      </div>
    </Link>
  );
}
