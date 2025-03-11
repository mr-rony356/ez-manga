"use client";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Series } from "@/types";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

export type HeroItem = {
  protagonist: string;
  background: string;
  banner: string;
  series: Series;
};

const TWEEN_FACTOR_BASE = 0.39;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

const Slider = ({
  heroes,
  options,
}: {
  heroes: HeroItem[];
  options: EmblaOptionsType;
}) => {
  const [hidden, setHidden] = useState(true);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    setHidden(false);
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(options);
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
          const opacity = numberWithinRange(tweenValue, 0.9, 1);

          // emblaApi.slideNodes()[
          //   slideIndex
          // ].style.transform = `scale(${opacity})`;
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenFactor(emblaApi);
    tweenOpacity(emblaApi);
    emblaApi
      .on("reInit", setTweenFactor)
      .on("reInit", tweenOpacity)
      .on("scroll", tweenOpacity)
      .on("slideFocus", tweenOpacity);
  }, [emblaApi, tweenOpacity]);

  return (
    <div className={"flex flex-col gap-2"}>
      <Swiper
        slidesPerView={1}
        modules={[Autoplay]}
        className={"w-full"}
        spaceBetween={10}
        loop={true}
        autoplay
      >
        {heroes &&
          heroes.length > 0 &&
          heroes.map((hero, index) => {
            return (
              <SwiperSlide className="group relative" key={index}>
                <article className="relative h-[250px] lg:h-[240px] w-full rounded-2xl overflow-hidden">
                  <Link prefetch={false}
                    href={`/series/${hero.series.series_slug}`}
                    className="no-link cursor-pointer"
                  >
                    <div className="absolute bottom-0 h-fit z-[1] overflow-hidden rounded-2xl w-full">
                      <div className="relative">
                        <div className="h-[220px] opacity-50">
                          <img
                            src={hero.banner}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="absolute z-[3] border-gray-100 md:border-none h-full w-full bottom-0">
                      <div className="h-[95%] absolute w-full text-right bottom-0">
                        <div className="relative z-[4] border-gray-100 md:border-none h-full flex justify-center items-center">
                          <img
                            src={hero.protagonist}
                            alt=""
                            className="object-cover"
                            style={{ height: "calc(100% + 22px)" }}
                          />
                        </div>
                      </div>
                    </div>
                    {/*<div*/}
                    {/*  className={`absolute z-[4] left-0 px-8 py-4  text-gray-50 hover:text-gray-50 bottom-0 w-full flex flex-col gap-y-2 h-full justify-end`}*/}
                    {/*  style={{*/}
                    {/*    backgroundImage: `linear-gradient(0deg, #0000009e, ${hero.background}59, transparent, transparent)`,*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*  <h1*/}
                    {/*    className="font-bold text-sm lg:text-lg text-center drop-shadow-sm"*/}
                    {/*    style={{ textShadow: "0 0 7px #00000070" }}*/}
                    {/*  >*/}
                    {/*    {hero.series.title}*/}
                    {/*  </h1>*/}
                    {/*  <div*/}
                    {/*    className="lg:max-w-[600px] text-xxs text-left text-gray-200 line-clamp-2 lg:line-clamp-3"*/}
                    {/*    suppressHydrationWarning={true}*/}
                    {/*    style={{ textShadow: "0 0 7px #00000070" }}*/}
                    {/*    dangerouslySetInnerHTML={{*/}
                    {/*      __html: hero.series.description,*/}
                    {/*    }}*/}
                    {/*  ></div>*/}
                    {/*</div>*/}
                  </Link>
                </article>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
};

export default Slider;
