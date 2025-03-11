"use client";
import Image from "next/image";
import Link from "next/link";
import MagicIcon from "/public/magic.svg";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { Series } from "@/types";


interface EditorsPickProps {
  editors_pick: Series[];
}

export default function EditorsPick({ editors_pick }: EditorsPickProps) {
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const currentSeries = editors_pick[currentSeriesIndex];

  // Create thumbnails array from editors_pick
  const thumbnails = editors_pick.map((series) => series.thumbnail);
  const [selectedImage, setSelectedImage] = useState(thumbnails[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageSelect = (thumb: string, index: number) => {
    setSelectedImage(thumb);
    setSelectedIndex(index);
    setCurrentSeriesIndex(index);
  };

  if (!editors_pick || editors_pick.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2 lg:mb-14 mb-6">
        <Image
          src={MagicIcon}
          alt="Magic"
          className="w-8 h-8 lg:w-10 lg:h-10"
        />
        <h2 className="text-[19px] lg:text-[41px] font-bold">
          EDITOR'S{" "}
          <span className="text-orange-500 text-[14px] lg:text-[32px] ">
            Pick !
          </span>
        </h2>
      </div>
      <div
        className="container mb-8 relative rounded-lg lg:py-2 transition-all duration-500"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${selectedImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for the background */}
        <div className="absolute inset-0 bg-[#1D1D1D] opacity-75 z-0 rounded-lg"></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row bg-transparent rounded-lg overflow-hidden shadow-md">
            {/* Text, Thumbnails, and Button (Left Side) */}
            <div className="w-full lg:w-1/2 lg:p-4 p-2 text-white flex flex-col gap-4 order-1 lg:order-none">
              <h3 className="text-[22px] lg:text-3xl font-semibold lg:my-2 text-left !font-manrope">
                {currentSeries.title}
              </h3>
              <div className="flex gap-2 lg:mb-2">
                <span className="bg-[#373838] text-white border-none p-[10px] py-1 rounded-[6px]">
                  {currentSeries.badge}
                </span>
              </div>
              <Separator
                className="bg-[#535454] max-w-[500px]"
                orientation="horizontal"
              />
              <p className="lg:text-sm text-[10px] text-left text-gray-300 mb-2 line-clamp-3 max-w-[500px]">
                {currentSeries.description}
              </p>

              {/* Updated thumbnails section */}
              <div className="relative w-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-2 items-center px-4">
                  {thumbnails.map((thumb, index) => (
                    <div
                      key={index}
                      className={`relative flex-shrink-0 rounded-md overflow-hidden transition-all duration-500 ease-in-out cursor-pointer ${
                        index === selectedIndex
                          ? "lg:w-28 w-16 lg:h-[160px] h-[100px] scale-105 z-10"
                          : index === selectedIndex - 1 ||
                            index === selectedIndex + 1
                          ? "lg:w-20 w-12 lg:h-[120px] h-[80px] opacity-80"
                          : "lg:w-16 w-8 lg:h-[100px] h-[50px] opacity-60"
                      }`}
                      onClick={() => handleImageSelect(thumb, index)}
                    >
                      <Image
                        src={thumb}
                        alt={`${currentSeries.title} thumbnail ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Image and Button (Right Side) */}
            <div className="hidden lg:flex absolute -top-[55px] right-0 lg:w-[770px] lg:h-[430px] rounded-lg">
              <Link
                href={`/series/${currentSeries.series_slug}`}
                className="w-full"
              >
                <button className="absolute bottom-4 right-4 px-6 lg:text-lg py-2 bg-[#323130dd] text-white rounded-[6px] text-sm hover:bg-orange-600 transition-colors z-20">
                  Read it now
                </button>

                <div className="w-full aspect-[16/9] rounded-lg relative overflow-hidden">
                  <Image
                    src={selectedImage}
                    alt={currentSeries.title}
                    fill
                    className="object-cover h-full w-full rounded-lg transition-all duration-500 ease-in-out"
                  />
                </div>
              </Link>
            </div>
            <div className="lg:hidden lg:w-[770px] lg:h-[430px] rounded-lg">
              <Link
                href={`/series/${currentSeries.series_slug}`}
                className="w-full"
              >
                <button className="absolute top-[150px] right-4 lg:px-6 px-4 lg:text-lg py-2 bg-[#32313084] text-white rounded-[6px] text-sm hover:bg-orange-600 transition-colors z-20">
                  Read it now
                </button>

                <div className="w-full aspect-[16/9] rounded-lg relative">
                  <Image
                    src={selectedImage}
                    alt={currentSeries.title}
                    fill
                    className="object-cover lg:h-full h-[175px] w-full rounded-lg transition-all duration-500 ease-in-out"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
