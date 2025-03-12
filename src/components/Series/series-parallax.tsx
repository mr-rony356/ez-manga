"use client";
import { get_file_url } from "@functions";
import { Parallax } from "react-scroll-parallax";

export const SeriesParallax = ({ thumbnail }: { thumbnail: string }) => {
  return (
    <Parallax translateY={[0, -100]} scale={[1, 1]} speed={5}>
      <img src={get_file_url(thumbnail)} className="w-full h-auto blur" />
    </Parallax>
  );
};
