import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import discordIcon from "/public/discord.png";
import Image from "next/image";
export default function DiscordBanner() {
  return (
    <Link href="https://discord.gg/ptPBMJFxCj" target="_blank">
      <div className="flex flex-row items-center justify-between p-3 lg:p-4 py-2 rounded-sm bg-[#181818] border-4 border-[#1c1c1ca1] hover:bg-accent/50 transition-colors shadow-lg">
      <div className="flex items-center gap-4">
      <div className="flex items-center lg:gap-4 gap-3">
      <div className="w-[3px] h-14 bg-white/20 rounded-full"></div>
            <div>
              <h3 className="font-bold text-[#ECECEC] text-left lg:text-sm text-xs">
                Join our Community!
              </h3>
              <p className="text-muted-foreground lg:text-xs text-xxs text-left">
                Join us for updates, events, and more!
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center  gap-3 bg-[#4470F6] text-white px-4 py-2 rounded-full lg:text-sm text-[12px] font-bold min-w-[110px]">
          <Image src={discordIcon} alt="Discord" width={20} height={20} />
          Discord
        </div>
      </div>
    </Link>
  );
}
