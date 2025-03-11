import { Website_Name } from "@global";
import { Metadata } from "next";
import {
  AnnouncementsHeader as Header,
  AnnouncementsTable as Table,
  AnnouncementsDashboardContextProvider as ContextProvider,
} from "./components";

export const metadata: Metadata = {
  title: "Announcements - " + Website_Name,
};

const AnnouncementsDashboardPage = () => {
  return (
    <ContextProvider>
      <div className="min-h-screen container space-y-2">
        <Header />
        <Table />
      </div>
    </ContextProvider>
  );
};
export default AnnouncementsDashboardPage;
