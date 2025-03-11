import { Website_Name } from "@global";
import twitter from "/public/twitter.svg";
import discord from "/public/discord.svg";
import instagram from "/public/instagram.svg";
import telegram from "/public/telegram.svg";
import Image from "next/image";
const Footer = () => {
  return (
    <div className="mt-24">
      <div className="flex items-center flex-col justify-center px-5 py-8 gap-6">
        <img src="/icon.png" className="h-8" alt={`${Website_Name} Logo`} />
        <span className="text-center text-[#87878e] text-sm max-w-2xl">
          {Website_Name}®. All rights reserved
        </span>
        <span className="text-center text-white text-sm max-w-2xl">
          Your ultimate destination for exploring, reading, and enjoying a
          diverse collection of manga and manhua and manhwa
        </span>
        <div className="flex gap-4">
          <a
            href="#"
            className="text-white hover:text-[#71717A] transition-colors"
          >
            <Image
              src={twitter}
              alt="Twitter"
              width={100}
              height={100}
              className="w-12 h-12"
            />
          </a>
          <a
            href="#"
            className="text-white hover:text-[#71717A] transition-colors"
          >
            <Image
              src={discord}
              alt="Discord"
              width={100}
              height={100}
              className="w-12 h-12"
            />
          </a>
          <a
            href="#"
            className="text-[#71717A] hover:text-white transition-colors"
          >
            <Image
              src={telegram}
              alt="Telegram"
              width={100}
              height={100}
              className="w-12 h-12 bor"
            />
          </a>
          <a
            href="#"
            className="text-white hover:text-[#71717A] transition-colors"
          >
            <Image
              src={instagram}
              alt="Instagram"
              width={100}
              height={100}
              className="w-12 h-12"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
