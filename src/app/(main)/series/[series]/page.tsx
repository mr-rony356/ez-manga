import { SeriesComments } from "@/components/Disqus";
import ChaptersList from "@/components/Series/ChaptersList";
import ReviewsList from "@/components/Series/ReviewsList";
import { Button } from "@/components/ui/button";
import type { Series } from "@/types";
import { get_file_url } from "@functions";
import { Website_Local_API, Website_Name } from "@global";
import { Play, Plus, Share, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import MovieCard from "../components/Movie-card";

interface SeriesPageParams {
  params: {
    series: string;
  };
}

type Props = {
  params: { series: string };
};

interface MangaItem {
  id: string;
  title: string;
  coverImage: string;
  slug: string;
}

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

  const buttonGroup = [
    { id: 1, btn: "Fantasy" },
    { id: 2, btn: "Action" },
    { id: 3, btn: "Regression" },
    { id: 4, btn: "Overpowered" },
    { id: 5, btn: "Adventure" },
    { id: 6, btn: "Dungeons" },
  ];

  const artGallery = [
    { id: 1, url: series.thumbnail },
    { id: 2, url: series.thumbnail },
    { id: 3, url: series.thumbnail },
    { id: 4, url: series.thumbnail },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar with cover and info */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="overflow-hidden rounded-[9.92px]">
              <Image
                src={get_file_url(series.thumbnail) || "/placeholder.svg"}
                alt={series.title}
                width={640}
                height={960}
                className="w-full object-cover"
                priority
              />
            </div>
            <div className="space-y-3">
              <Button variant={"secondary"} className="rounded-none w-full">
                <Star className="w-4 h-4 mr-2 text-[#FFC414]" />
                Rating
              </Button>
              <Button variant={"secondary"} className="rounded-none w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add to Library
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {buttonGroup?.map((button) => (
                <Button
                  key={button.id}
                  variant={"secondary"}
                  className="rounded-none text-[14px]"
                >
                  {button.btn}
                </Button>
              ))}
            </div>
            <div className="flex items-center justify-evenly">
              <Image src="/Layer.svg" alt="Layer_1" height={20} width={20} />
              <h6 className="text-xl lg:text-2xl">
                <span className="font-bold">ART </span>
                <span className="text-[#FF5614]">Sneak Peek！</span>
              </h6>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {artGallery.slice(0, 3).map((art, index) => (
                <Image
                  key={art.id}
                  src={art.url || "/placeholder.svg"}
                  alt={`Art preview ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-auto object-cover aspect-square"
                />
              ))}
              <div className="relative">
                <Image
                  src={artGallery[3].url || "/placeholder.svg"}
                  alt="More art previews"
                  width={150}
                  height={150}
                  className="w-full h-auto object-cover aspect-square brightness-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    +12 photos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side with chapters */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="w-full mb-4">
              <MovieCard />
              <div className="flex items-center space-x-3 my-4">
                <Button className="rounded-none bg-gradient-to-r from-[#FF5614] to-blue-[#FF7700]">
                  <Play className="w-4 h-4 mr-2" />
                  Start Reading
                </Button>
                <Button variant={"secondary"} className="rounded-none">
                  <Share className="w-4 h-4 mr-2" />
                  Share the series
                </Button>
              </div>
            </div>
            <div className="bg-[#1b1b1b] p-4 rounded-sm">
              <div>
                <ChaptersList
                  series_id={series.id}
                  series_type={series.series_type}
                  seasons={series.seasons}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-secondary text-white py-8 px-4 my-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="lg:text-xl mb-6">
              If you enjoyed &lt;
              <span className="font-bold">{series?.title}</span>&gt;
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 rounded-sm">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index}>
                  <div className="relative aspect-[3/4] mb-2">
                    <Image
                      src={series.thumbnail}
                      alt={series.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xs">{series?.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="my-4">
            <ReviewsList />
          </div>
          <div>
            <SeriesComments
              post={{
                id: series.id,
                title: series.title,
                series_slug: series.series_slug,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesPage;
