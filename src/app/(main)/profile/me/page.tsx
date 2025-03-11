import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/app/(main)/profile/me/components/profile-form";
import { getUserData, onlyLoggedIn } from "@/services/server";
import ProfilePictureSelector from "./components/ProfilePicture";
import { Metadata } from "next";
import { Website_Name } from "@global";

export const metadata: Metadata = {
  title: "My profile - " + Website_Name,
};

export default async function SettingsProfilePage() {
  const user_data = await getUserData();

  return (
    <div className=" p-4">
      <div className="flex flex-row gap-2">
        <ProfilePictureSelector user={user_data.user!} />
        <div>
          <h3 className="text-lg text-foreground font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
      </div>
      <ProfileForm user={user_data.user!} />
    </div>
  );
}
