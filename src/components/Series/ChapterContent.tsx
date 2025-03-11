"use client";
import parse from "html-react-parser";
import { tv, VariantProps } from "tailwind-variants";
import { useLocalStorage } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type ChapterContentProps = {
  data: string;
};

interface ChapterDataResponse {
  chapter_price: number;
  code: number;
  content: string;
  continuation: string | null;
  storage: string;
  isLoggedIn: string;
  user_coins: number;
}

const text_style = tv({
  base: "bg-background p-5 rounded text-foreground shadow-lg",
  variants: {
    color: {
      primary: "text-foreground",
      red: "text-red-600",
      orange: "text-orange-600",
      green: "text-green-500",
      blue: "text-blue-500",
    },
    align: {
      center: "text-center",
      left: "text-left",
      right: "text-right",
      justify: "text-justify",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
    font: {
      "times-new-roman": "times-new-roman",
      montserrat: "montserrat",
      "baskervville-regular": "baskervville-regular",
      "open-sans": "open-sans",
      helvetica: "helvetica",
      "century-schoolbook": "century-schoolbook",
      "comic-sans": "comic-sans",
      "font-sans": "font-sans",
      "font-serif": "font-serif",
      "font-mono": "font-mono",
      roboto: "font-roboto",
    },
    spacing: {
      "1em": "space-1",
      "2em": "space-2",
      "4em": "space-4",
      "6em": "space-6",
      "8em": "space-8",
      "10em": "space-10",
    },
  },
});

export type TextColors = VariantProps<typeof text_style>["color"];
export type TextAlign = VariantProps<typeof text_style>["align"];
export type TextLeading = VariantProps<typeof text_style>["leading"];
export type FontFamily = VariantProps<typeof text_style>["font"];
export type ParagraphSpacing = VariantProps<typeof text_style>["spacing"];

const ChapterContent = ({ data }: ChapterContentProps) => {
  const [align] = useLocalStorage<TextAlign>("align", "left");
  const [color] = useLocalStorage<TextColors>("color", "primary");
  const [size] = useLocalStorage<number>("size", 18);
  const [height] = useLocalStorage<number>("height", 24);
  const [theme] = useLocalStorage<string>(
    "reader_theme",
    "bg-background_text-foreground"
  );
  const [leading] = useLocalStorage<TextLeading>("leading", "normal");
  const [font] = useLocalStorage<FontFamily>("font", "baskervville-regular");
  const [spacing] = useLocalStorage<ParagraphSpacing>("spacing", "1em");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {data && mounted && (
        <div
          id="reader-container"
          style={{
            wordBreak: "break-word",
            fontSize: `${size}px`,
            lineHeight: `${height}px`,
          }}
          className={cn(
            text_style({ color, align, leading, spacing }),
            theme.replaceAll("_", " "),
            font
          )}
        >
          {parse(data)}
        </div>
      )}
    </>
  );
};

export default ChapterContent;
