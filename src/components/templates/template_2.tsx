import Slider, { HeroItem } from "@/components/Slider";
import { Series } from "@/types";
import { ComicsUpdatesSlider } from "@/components/Series/new-comics-updates";
import { ComingSoon } from "@/components/Series/coming-soon";
import { FavouriteGenres } from "@/components/Series/favourite-genres";
import { NovelsUpdatesSlider } from "../Series/new-novels-slider";
import Announcements from "../Annoucements";
import { Separator } from "@/components/ui/separator";
import NewSeriesFeed from "@/components/Series/new-series-feed";
import Trending from '@/components/Trending';

export default function Template({
  comics,
  novels,
  new_series,
  heroes,
  coming_soon,
  completed,
  editors_pick,
}: {
  comics: Series[];
  novels: Series[];
  heroes: HeroItem[];
  new_series: Series[];
  coming_soon: Series[];
  completed: Series[];
  editors_pick: Series[];
  
  }) {
  return (
    <div>
      <section style={{ position: "relative" }}>
        <div className="text-center mb-5">
          <div className="grid grid-cols-12 gap-y-4">

            <div
              className={
                "container overflow-hidden col-span-12 flex flex-row gap-2 items-center justify-center mt-4"
              }
            >

              <span
                className={
                  "text-[8px] lg:text-xxs text-muted-foreground shrink-0 font-semibold"
                }
              >
                ANNOUNCEMENTS
              </span>
            </div>
            <div className="col-span-12 px-5 lg:px-0">
              <Announcements />
            </div>
            <div
              className={
                "container overflow-hidden col-span-12 flex flex-row gap-2 items-center justify-center"
              }
            >
              <Separator orientation={"horizontal"} />

              <span
                className={
                  "text-[8px] lg:text-xxs text-muted-foreground shrink-0 font-semibold"
                }
              >
                NEW SERIES
              </span>
              <Separator orientation={"horizontal"} />
            </div>
            <div className="col-span-12">
              <NewSeriesFeed series={new_series} options={{ loop: true }} />
            </div>
            <div
              className={
                "container overflow-hidden col-span-12 flex flex-row gap-2 items-center justify-center"
              }
            >
              <Separator orientation={"horizontal"} />

              <span
                className={
                  "text-[8px] lg:text-xxs text-muted-foreground shrink-0 font-semibold"
                }
              >
                LATEST NOVEL UPDATES
              </span>
              <Separator orientation={"horizontal"} />
            </div>
            {novels.length > 0 && <NovelsUpdatesSlider novels={novels} />}
            <div
              className={
                "container overflow-hidden col-span-12 flex flex-row gap-2 items-center justify-center"
              }
            >
              <Separator orientation={"horizontal"} />

              <span
                className={
                  "text-[8px] lg:text-xxs text-muted-foreground shrink-0 font-semibold"
                }
              >
                TRENDING
              </span>
              <Separator orientation={"horizontal"} />
            </div>
            <div className="col-span-12 grid grid-cols-12 container gap-4">
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-2">
                <Slider heroes={heroes} options={{ loop: true }} />
              </div>
              <div className="col-span-12 lg:col-span-8">
                <Trending />
              </div>
            </div>
            <FavouriteGenres />
            {coming_soon.length > 0 && <ComingSoon series={coming_soon} />}
          </div>
        </div>
      </section>
    </div>
  );
}
