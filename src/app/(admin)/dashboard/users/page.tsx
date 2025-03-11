import { Website_Name } from "@global";
import { Metadata } from "next";
import UsersHeader from "./components/UsersHeader";
import UsersTable from "./components/UsersTable";
import { UsersDashboardContextProvider as ContextProvider } from "./components/Context";

export const metadata: Metadata = {
    title: 'Users - ' + Website_Name
}



const UsersDashboard = () => {
    return (
        <>
            <ContextProvider>
                <div className="min-h-screen container space-y-2">
                    <UsersHeader />
                    <UsersTable />
                </div>
            </ContextProvider>
        </>
    )
}
export default UsersDashboard;