import { Website_Local_API, Website_Name } from "@global";
import { Metadata } from "next";
import ComicsHeader from "./components/ComicsHeader";
import { ComicsContextProvider } from "./components/ComicsContext";
import ComicsGenreSelector from "./components/ComicsGenreSelector";
import { getTags } from "@/services";
import ComicsBody from "./components/ComicsBody";
import { Icons } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Series - EZ Manga",
};

const ComicsPage = async () => {
  const tags = await getTags();

  return (
    <ComicsContextProvider>
      <div className="px-5 lg:px-0 pt-8 max-w-[1578px] mx-auto">
        <div className="flex flex-col gap-4">
          {/* <h5 className="font-bold text-base text-lg text-foreground"><Icons.book className='w-6 h-full mr-2 inline-block' /> All comics</h5> */}
          <ComicsHeader tags={tags} />
          <ComicsBody />
        </div>
      </div>
    </ComicsContextProvider>
  );
};
export default ComicsPage;
