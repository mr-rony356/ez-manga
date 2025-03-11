import ChapterNav from "@/components/Series/ChapterNav";
import {
  Website_Country,
  Website_Local_API,
  Website_Locale,
  Website_Name,
} from "@global";
import ChapterImages from "@/components/Series/ChapterImages";
import ChapterHeader from "@/components/Series/ChapterHeader";
import { Metadata } from "next";
import { ChapterComments } from "@/components/Disqus";
import ChapterFooter from "@/components/Series/ChapterFooter";
import { Skeleton } from "@/components/ui/skeleton";
import ChapterContent from "@/components/Series/ChapterContent";

import { get_file_url } from "@functions";

import Paywall from "@/components/Paywall";
import { cookies } from "next/headers";
import { env } from "@/env";
import dynamic from "next/dynamic";

type Props = {
  params: {
    series: string;
    chapter: string;
  };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const chapter: any = await (
    await fetch(`${Website_Local_API}/seo/${params.series}/${params.chapter}`, {
      next: {
        tags: [`${params.series}-${params.chapter}`],
      },
    })
  ).json();

  return {
    title: `${chapter.series.title} - ${chapter.chapter_name} - ${Website_Name}`,
    description: `Read ${chapter.series.title} - ${chapter.chapter_name} - ${Website_Name}`,
    openGraph: {
      type: "website",
      countryName: Website_Country,
      description: ``,
      title: `${chapter.series.title} - ${Website_Name}`,
      siteName: Website_Name,
      locale: Website_Locale,
      images: [
        {
          url: `${chapter.chapter_thumbnail
            ? get_file_url(chapter.chapter_thumbnail)
            : get_file_url(chapter.series.thumbnail)
            }`,
          width: 120,
          height: 190,
        },
        get_file_url(chapter.series.thumbnail),
      ],
    },
  };
};

const ChapterPage = async ({
  params,
}: {
  params: {
    series: string;
    chapter: string;
  };
}) => {
  const chapter: any = await (
    await fetch(
      `${Website_Local_API}/chapter/${params.series}/${params.chapter}`,
      {
        next: {
          tags: [`${params.series}-${params.chapter}`],
        },
      }
    )
  ).json();


  if (chapter.status === 404) {
    return (
      <>
        <div className="min-h-[80vh] flex flex-col justify-center items-center">
          <div className="container px-5 lg:px-0 flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-semibold text-center">
              This chapter could not be found.
            </h1>
            <p className="text-center">
              The chapter you are looking for could not be found. Please check
              the URL and try again. If you believe this is an error, please contact us in our Discord.
            </p>
            <code className='text-center'>
              {`Chapter: ${params.chapter}\r\n\nSeries: ${params.series}`}
            </code>

          </div>
        </div>
      </>
    );
  }



  if (chapter.paywall) {
    const cookieStore = cookies();
    const string_cookies = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const chapter: any = await (
      await fetch(
        `${Website_Local_API}/chapter/${params.series}/${params.chapter}`,
        {
          next: {
            revalidate: 0,

          },
          headers: {
            cookie: string_cookies,
          },
        }
      )
    ).json();

    if (chapter.paywall) {
      return (
        <>
          <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <div className="container px-5 lg:px-0">
              <Paywall chapter={chapter} />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <ChapterHeader API_Response={chapter} />
          <div className="container">

            {chapter && chapter.chapter.chapter_type === "Comic" && <ChapterImages
              data={chapter.chapter.chapter_data.images as string[]}
            />
            }
            {chapter && chapter.chapter.chapter_type === "Novel" && (
              <ChapterContent data={chapter.chapter.chapter_content} />
            )}

          </div>
          <ChapterFooter API_Response={chapter} />
          {!chapter.paywall && (
            <div className="container p-4 bg-background">
              <ChapterComments
                chapter={chapter.chapter}
                series={chapter.chapter.series}
              />
            </div>
          )}
        </>
      );
    }
  }

  return (
    <>
      <ChapterHeader API_Response={chapter} />
      <div className="container">
        <div>

        </div>
        {chapter && chapter.chapter.chapter_type === "Comic" && (
          <ChapterImages
            data={chapter.chapter.chapter_data.images as string[]}
          />
        )}
        {chapter && chapter.chapter.chapter_type === "Novel" && (
          <ChapterContent data={chapter.chapter.chapter_content} />
        )}
        <div>

        </div>
      </div>
      <ChapterFooter API_Response={chapter} />
      {!chapter.paywall && (
        <div className="container p-4 bg-background">
          <ChapterComments
            chapter={chapter.chapter}
            series={chapter.chapter.series}
          />
        </div>
      )}
    </>
  );
};

export default ChapterPage;
