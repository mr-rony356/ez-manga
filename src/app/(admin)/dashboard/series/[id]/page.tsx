import { getSeries } from "@/services/server/series";
import { Metadata } from "next";
import { SingleSeriesContextProvider as ContextProvider } from "./components/Context";
import { Website_Name } from "@global";
import SingleSeriesHeader from "./components/SingleSeriesHeader";
import FormContextProvider from "./components/FormContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChapterManagement from "./components/ChapterManagement";
import NoticesManagement from "./components/notices-management";
import { getUserData } from "@/services/server";
import { CardsStats } from "@/app/(admin)/dashboard/series/[id]/components/series-metrics";
import { auth } from "@/auth/server";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const series = await getSeries(id);
  return {
    title: `${series.title} - ${Website_Name}`,
  };
}

const SingleSeriesPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const series = await getSeries(id);
  const { user } = await auth();

  return (
    <div className="container px-5 space-y-2 min-h-screen">
      <ContextProvider series={series}>
        <Accordion
          type="multiple"
          defaultValue={["general", "chapters", "notices"]}
          className="w-full"
        >
          {user && user.role === "Admin" && (
            <AccordionItem className="border-0" value="metrics">
              <AccordionTrigger className="rounded px-5 text-foreground my-2 bg-background">
                Metrics
              </AccordionTrigger>
              <AccordionContent>
                <CardsStats />
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem className="border-0" value="general">
            <AccordionTrigger className="rounded px-5 text-foreground my-2 bg-background">
              General info
            </AccordionTrigger>
            <AccordionContent>
              <FormContextProvider>
                <SingleSeriesHeader />
              </FormContextProvider>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="border-0" value="chapters">
            <AccordionTrigger className="rounded px-5 text-foreground my-2 bg-background">
              Manage chapters
            </AccordionTrigger>
            <AccordionContent>
              <ChapterManagement />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="border-0" value="notices">
            <AccordionTrigger className="rounded px-5 text-foreground my-2 bg-background">
              Manage notices
            </AccordionTrigger>
            <AccordionContent>
              <NoticesManagement />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ContextProvider>
    </div>
  );
};
export default SingleSeriesPage;
