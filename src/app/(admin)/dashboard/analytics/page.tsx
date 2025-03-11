import { Website_Name } from "@global";
import { Metadata } from "next";
import { MostPurchasedSeries } from "../components/most-purchased-series";
import { RevenueTrends } from "../components/revenue-trends";
import { auth } from '../../../../auth/server';
import SeriesDashboard from "../components/new-dashboard";
import AnalyticsDashboard from "./components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard - " + Website_Name,
};

const DashboardIndex = async () => {

  const user = await auth();
  if (!user.isLoggedIn) return null;
  const role = user.user?.role

  return (
    <div className="min-h-screen container w-full">
      {
        role === 'Admin' && (
          <>
            <AnalyticsDashboard />
          </>
        )
      }
    </div>
  );
};



export default DashboardIndex;
