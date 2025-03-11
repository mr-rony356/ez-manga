"use client";
import { Series } from "@/types";
import { get_file_url } from "@functions";
import Link from "next/link";
import Image from "next/image";
import handIcon from "/public/hand.svg";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { convert } from "html-to-text";
import { Clipboard, ClipboardList } from "lucide-react";

const TWEEN_FACTOR_BASE = 0.39;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

const NewSeriesFeed = ({
  series,
  options,
}: {
  series: Series[];
  options: EmblaOptionsType;
}) => {
  const [current, setCurrent] = useState(1);

  const [mainEmblaRef, mainEmblaApi] = useEmblaCarousel(
    {
      ...options,
      loop: false,
      dragFree:true,
      containScroll: "trimSnaps",
      skipSnaps: false,
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: options.slidesToScroll || 1 },
        "(max-width: 767px)": { slidesToScroll: 1 },
      },
    },
    [Autoplay({ delay: 6000, stopOnInteraction: true })]
  );

  const [continueEmblaRef, continueEmblaApi] = useEmblaCarousel({
    ...options,
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps",
    skipSnaps: false,
  });

  const tweenFactor = useRef(0);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenOpacity = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const opacity = numberWithinRange(tweenValue, 0.3, 1);

          emblaApi.slideNodes()[slideIndex].style.opacity = `${opacity}`;

          if (opacity < 0.9)
            emblaApi.slideNodes()[slideIndex].style.filter = `saturate(0)`;
          else {
            setCurrent(slideIndex);
            emblaApi.slideNodes()[slideIndex].style.filter = `saturate(1)`;
          }
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!mainEmblaApi) return;

    // setTweenFactor(mainEmblaApi);
    // tweenOpacity(mainEmblaApi);
    // mainEmblaApi
    //   .on("reInit", setTweenFactor)
    //   .on("reInit", tweenOpacity)
    //   .on("scroll", tweenOpacity)
    //   .on("slideFocus", tweenOpacity);
  }, [mainEmblaApi, tweenOpacity]);

  return (
    <>
      <div className="mx-auto space-y-4">
        <div className="embla max-w-[1583px] mx-auto  px-4 lg:px-0">
          <div className="embla__viewport" ref={mainEmblaRef}>
            <div className="embla__container">
              {series.map((series, index) => (
                <div
                  className="embla__slide group relative w-full md:w-auto"
                  key={index}
                  data-current={index === current}
                >
                  <Link
                    prefetch={false}
                    className="block h-full w-full z-50 lg:px-1"
                    href={`/series/${series.series_slug}`}
                  >
                    <div className="flex-none overflow-hidden relative shadow">
                      <div className="block h-full w-full z-50">
                        <Image
                          src={get_file_url(series.thumbnail)}
                          alt={series.title || "Series thumbnail"}
                          sizes="(max-width: 768px) 45vw, (max-width: 1200px) 50vw, 33vw"
                          width={480}
                          height={450}
                          className="object-cover aspect-[7/8] object-[100%_10%] lg:w-[514px] lg:h-[499px] w-full h-[405px] rounded-[8px]"
                        />
                      </div>
                      <div className="absolute w-full h-full bg-gradient-to-t from-[#090909ea] to-[#52515118] top-0"></div>
                      <div className="absolute bottom-7 left-0 right-0 p-4 text-white z-60">
                        {/* Status with colored dot */}
                        <p className="text-xs font-medium flex items-center gap-1">
                          {series.status === "Ongoing" && (
                            <>
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span className="text-green-500">
                                {series.status}
                              </span>
                            </>
                          )}
                          {series.status === "Dropped" && (
                            <>
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span className="text-red-500">
                                {series.status}
                              </span>
                            </>
                          )}
                          {series.status === "Completed" && (
                            <>
                              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                              <span className="text-yellow-500">
                                {series.status}
                              </span>
                            </>
                          )}
                        </p>
                        {/* Title */}{" "}
                        <h3 className="text-left text-lg lg:text-[21.5px] font-bold mt-1 break-words line-clamp-1 text-[#C8C9CA] font-manrope">
                          {series.title}
                        </h3>
                        {/* Description */}
                        <p className="!text-[15px] lg:text-base mt-1 text-[#AEAEB1] line-clamp-3 text-left">
                          {series.description}
                        </p>
                      </div>
                    </div>{" "}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto px-[16px] lg:px-0 ">
          <div className="flex items-center lg:gap-4 gap-2 lg:-ml-[18px] -ml-1">
            <Image
              src={handIcon}
              alt="hand icon"
              width={500}
              height={500}
              className="object-contain lg:h-[42px] lg:w-[42px] h-[24px] w-[24px]"
            />{" "}
            <h1 className="text-left text-[#F1F2F3] !font-manrope text-[18px] lg:text-[36px] font-semibold lg:my-5 my-4 ">
              Continue{" "}
              <span className="text-[#FF610E] lg:text-[25px] text-[14px]  mt-1 font-semibold">
                Reading
              </span>
            </h1>
          </div>
          <div className="embla">
            <div className="embla__viewport" ref={continueEmblaRef}>
              <div className="embla__container lg:!ml-1">
                {series.map((series, index) => (
                  <div
                    className="embla__slide group relative lg:px-[8px] px-1 flex flex-col rounded-[8px] lg:p-2 lg:mr-2 mr-1 border-[4px] border-[#131313]"
                    key={index}
                    data-current={index === current}
                  >
                    <Link
                      prefetch={false}
                      className="block h-full w-full z-50"
                      href={`/series/${series.series_slug}`}
                    >
                      <div className="flex-none overflow-hidden relative shadow">
                        <div className="block z-50">
                          <Image
                            src={get_file_url(series.thumbnail)}
                            alt={series.title || "Series thumbnail"}
                            sizes="(max-width: 768px) 45vw, (max-width: 1200px) 50vw, 33vw"
                            width={145}
                            height={100}
                            className="object-cover aspect-[1/4] object-[100%_40%] rounded-[8px] lg:w-[272px] lg:h-[190px] h-[120px] w-[171px]"
                          />
                        </div>
                      </div>
                    </Link>
                    <div className="mt-2 space-y-2 text-left ">
                      <p className="lg:text-xs text-[10px] text-whitepy-1 rounded-full max-w-[150px] truncate !font-manrope font-normal">
                        {series.title}
                      </p>

                      <p className="text-[8px] text-left  text-gray-400 flex items-center gap-1">
                        <ClipboardList className="w-3 h-3" />{" "}
                        {series.meta?.chapters_count || 0} Chapters Left
                      </p>
                      <div className="h-1.5 bg-[#252525] lg:w-full w-[170px] rounded-full">
                        <div className="h-full bg-[#FF610E] w-1/2 rounded-full"></div>
                      </div>

                      <div className="flex justify-end gap-2 !mt-4">
                        <button className="bg-[#68666624]  text-[8px] text-white lg:px-2 px-[2px] lg:text-[12px] font-semibold py-2 rounded-[8px]  hover:bg-gray-700 transition lg:min-w-[100px] min-w-[80px]">
                          Ignore
                        </button>
                        <button className="lg:text-[12px] bg-gradient-to-r from-[#FF7700] to-[#FF5614] text-white lg:px-2 px-[1px] py-1 rounded-[8px]  text-[8px] font-semibold hover:bg-[#FF610E]/80 transition lg:min-w-[100px] min-w-[80px] flex items-center justify-center gap-1">
                          Continue
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSeriesFeed;
