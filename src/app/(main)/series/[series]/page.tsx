import { Website_Local_API, Website_Name } from "@global";
import { Metadata } from "next";
import { get_file_url } from "@functions";
import { SeriesComments } from "@/components/Disqus";
import { checkBookmark } from "@/services/server/series";
import Image from "next/image";
import ChaptersList from "@/components/Series/ChaptersList";
import { Series } from "@/types";
import { formatNumber } from "@/components/Series/helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BookmarkButton from "@/components/Series/BookmarkButton";
import Rating from "@mui/material/Rating";
import { Button } from "@/components/ui/button";
import { RatingDialog } from "@/components/Series/RatingDialog";
import ReviewsList from "@/components/Series/ReviewsList";
import { env } from "@/env";
import { SeriesParallax } from "@/components/Series/series-parallax";
import { Separator } from "@/components/ui/separator";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { ReleaseSchedule } from "@/components/Series/release-schedule";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@mui/material";
import { NoticesList } from "@/components/Series/notices-list";
import { AudioChaptersList } from "@/components/Series/audio-chapters-list";

interface SeriesPageParams {
  params: {
    series: string;
  };
}

type Props = {
  params: { series: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const series: Series = await (
    await fetch(`${Website_Local_API}/series/${params.series}`, {
      next: {
        tags: [params.series],
      },
    })
  ).json();

  return {
    title: `${series.title} - ${Website_Name}`,
    description: `Read ${series.title} on ${Website_Name} - ${series.description}`,
    openGraph: {
      description: `Read ${series.title} on ${Website_Name} - ${series.description}`,
      title: `${series.title} - ${Website_Name}`,

      images: [
        {
          url: get_file_url(series.thumbnail),
          width: 60,
          height: 95,
        },
      ],
    },
    twitter: {
      card: "summary",
    },
  };
}

const SeriesPage = async ({ params }: SeriesPageParams) => {
  const series: Series = await (
    await fetch(`${Website_Local_API}/series/${params.series}`, {
      next: {
        tags: [params.series],
      },
    })
  ).json();
  const isBookmarked = await checkBookmark(params.series);
  return (
    <>
      <div>
        {series && (
          <div className="relative">
            <div className="w-full h-full absolute overflow-hidden z-10">
              <SeriesParallax thumbnail={series.thumbnail} />
            </div>
            <div
              className="h-[280px] z-10 absolute lg:relative"
              style={{
                backgroundImage: `linear-gradient(0deg, hsl(var(--background)), transparent)`,
              }}
            />
            <section className="bg-background lg:z-10 relative shadow-md">
              <div className="grid grid-cols-12 pt-3 gap-y-3 gap-x-3 container px-5 text-foreground">
                <div className="col-span-12 h-full self-end bg-background lg:col-span-9 rounded p-4 order-1 lg:order-2 z-10 flex flex-col gap-3">
                  <div className="flex flex-col gap-2 items-center lg:items-start">
                    <div className="flex flex-row gap-3 items-center flex-wrap">
                      <h1 className="text-xl md:text-3xl text-foreground font-bold text-center lg:text-left inline">
                        {series.title}
                      </h1>
                      <div className="flex flex-row gap-1 items-center">
                        <Rating
                          name="read-only"
                          value={series.rating || 5}
                          icon={<StarFilledIcon className="text-primary" />}
                          precision={0.1}
                          readOnly
                          size={"large"}
                        />
                        <span className="text-xxs">({series.rating})</span>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-base">
                      ({series.alternative_names})
                    </span>
                  </div>
                  <div className="flex flex-row flex-wrap gap-2">
                    <span className="bg-[#E1F0DA] dark:bg-[#212d1c] text-[#99BC85] text-[10px] font-bold text-foreground-100 px-2 py-1 rounded uppercase">
                      {series.status}
                    </span>
                    {series.tags &&
                      series.tags.length > 0 &&
                      series.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="bg-[#FFC5C5] dark:bg-[#5b2e30] text-[#ff8080] text-[10px] font-bold text-foreground-100 px-2 py-1 rounded uppercase"
                        >
                          {tag.name}
                        </span>
                      ))}
                  </div>
                  <div className="text-muted-foreground">
                    <div
                      dangerouslySetInnerHTML={{ __html: series.description }}
                    />
                  </div>
                  <Separator />
                  <Tabs orientation="vertical" defaultValue="chapters_list">
                    <TabsList className="flex flex-row gap-2 flex-wrap h-auto w-fit">
                      <TabsTrigger value="chapters_list">
                        Chapters list
                      </TabsTrigger>
                      <TabsTrigger value="notices">
                        {/*<Badge variant="dot" color="primary">
                        </Badge>*/}
                        Notices
                      </TabsTrigger>
                      {/*{series.series_type === "Novel" && (
                        <TabsTrigger value="audio_chapters">
                          Audio chapters
                        </TabsTrigger>
                      )}
                      <TabsTrigger disabled value="subscription_plan">
                        Subscribe (coming soon)
                      </TabsTrigger>
                      <TabsTrigger disabled value="wiki">
                        Wiki (coming soon)
                      </TabsTrigger>*/}
                    </TabsList>

                    <TabsContent value="chapters_list">
                      <ChaptersList
                        series_id={series.id}
                        series_type={series.series_type}
                        seasons={series.seasons}
                      />
                    </TabsContent>
                    <TabsContent value="notices">
                      <NoticesList series_id={series.id} />
                    </TabsContent>
                    {series.series_type === "Novel" && (
                      <TabsContent value={"audio_chapters"}>
                        <AudioChaptersList series_slug={series.series_slug} />
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
                <div className="col-span-12 lg:col-span-3 relative flex justify-center w-full lg:min-h-[750px]">
                  <div className="z-10 lg:absolute flex flex-col items-center justify-center gap-y-2 w-full lg:-translate-y-[130px]">
                    <div className="rounded p-1 bg-background overflow-hidden">
                      <Image
                        width={640}
                        height={960}
                        alt=""
                        src={get_file_url(series.thumbnail)}
                        className="w-full bg-muted/40 h-[500px] sm:h-[720px] md:h-[530px] lg:w-full lg:h-[320px] xl:h-[430px] 2xl:h-[450px] rounded"
                      />
                    </div>
                    {isBookmarked.isLoggedIn && (
                      <>
                        <BookmarkButton
                          data={{
                            hasBookmarked: isBookmarked.hasBookmarked,
                            series_slug: params.series,
                          }}
                        />
                        {!isBookmarked.hasReviewed && (
                          <RatingDialog series_id={series.id} />
                        )}
                      </>
                    )}
                    <div className="space-y-2 rounded p-5 w-full border">
                      <div className="flex justify-between w-full">
                        <span className="text-muted-foreground">
                          Release year
                        </span>
                        <span className="text-muted-foreground">
                          {series.release_year}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Author</span>
                        <span className="text-muted-foreground line-clamp-1">
                          {series.author}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total chapters
                        </span>
                        <span className="text-muted-foreground line-clamp-1">
                          {series.meta.chapters_count}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
                <div className="col-span-12 order-3">
                  <Accordion
                    type="multiple"
                    defaultValue={["reviews"]}
                    className="w-full gap-2 flex flex-col"
                  >
                    <AccordionItem
                      value="reviews"
                      className="border-0 bg-background rounded"
                    >
                      <AccordionTrigger className="px-8 py-4">
                        Reviews
                      </AccordionTrigger>
                      <AccordionContent>
                        <ReviewsList />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                      value="comments"
                      className="border-0 bg-background rounded"
                    >
                      <AccordionTrigger className="px-8 py-4">
                        Series comments
                      </AccordionTrigger>
                      <AccordionContent>
                        <SeriesComments
                          post={{
                            id: series.id,
                            title: series.title,
                            series_slug: series.series_slug,
                          }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default SeriesPage;
