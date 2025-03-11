import Slider, { HeroItem } from "@/components/Slider";
import Trending from "@/components/Trending";
import { Chapter, Series } from "@/types";
import NewSeriesFeed from "../Series/new-series-feed";
import { ComicsUpdatesSlider } from "@/components/Series/new-comics-updates";
import { NovelsUpdatesSlider } from "@/components/Series/new-novels-slider";
import { ComingSoon } from "@/components/Series/coming-soon";
import { FavouriteGenres } from "@/components/Series/favourite-genres";
import HomeComics from "@/app/(main)/home-comics";
import { ComicsContextProvider } from "@/app/(main)/Context";
import Announcements from "../Annoucements";
import { RocketIcon } from "@radix-ui/react-icons";
import DiscordBanner from "../banners/discord";
import ReportBanner from "../banners/report";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Icons } from "../Icons";
import { NewSeriesSlider } from "../Series/new-series";
import KofiBanner from "../banners/kofi";
import ShareBanner from "../banners/share";
import EditorsPick from "../EditorsPick";
import { CompletedSeries } from "../Compelted";
export default function Template({
  comics,
  novels,
  heroes,
  new_series,
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
        <div className="col-span-12 lg:mt-16 mt-6">
          <NewSeriesFeed series={new_series} options={{ loop: true }} />
        </div>

        <div className="text-center mb-5 overflow-visible relative max-w-[1500px] mx-auto">
          <div className="grid grid-cols-12 gap-y-8">
            <div className="col-span-12 gap-3 flex flex-col lg:!mt-12 my-6 mb-0  px-4 lg:px-0">
              <div className="w-full ">
                <ShareBanner />
              </div>
              <div className="grid grid-cols-1 mt-1 lg:mt-3 lg:grid-cols-2 gap-6 flex-col-reverse lg:flex-row">
                <DiscordBanner />
                <KofiBanner />
              </div>
            </div>
            <div className="col-span-12">
              <div className="col-span-12">
                {comics.length > 0 && (
                  <>
                    <ComicsContextProvider initialValue={comics}>
                      <HomeComics />
                    </ComicsContextProvider>
                  </>
                )}
              </div>
              <div className="col-span-12  lg:mt-16 px-4  lg:px-0 mt-10">
                <Trending />
              </div>
            </div>
            <div className="col-span-12 px-6 lg:px-0 mt-6">
              <EditorsPick editors_pick={editors_pick} />
            </div>

            <div className="col-span-12 px-5 lg:px-0">
              <NewSeriesSlider series={new_series} />
            </div>
            <div className="col-span-12 px-5 lg:px-0 lg:mt-8 mt-0">
              <CompletedSeries series={completed} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
