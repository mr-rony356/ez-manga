import { Website_Name } from "@global";
import { Metadata } from "next";
import { MostPurchasedSeries } from "./components/most-purchased-series";
import { RevenueTrends } from "./components/revenue-trends";
import { auth } from '../../../auth/server';
import SeriesDashboard from "./components/new-dashboard";

export const metadata: Metadata = {
  title: "Dashboard - " + Website_Name,
};

const DashboardIndex = async () => {

  const user = await auth();
  if (!user.isLoggedIn) return null;
  const role = user.user?.role

  return (
    <div className="min-h-screen container">
      {
        role === 'Admin' && (
          <>
            <SeriesDashboard />
            <RevenueTrends />
          </>
        )
      }
    </div>
  );
};



export default DashboardIndex;
