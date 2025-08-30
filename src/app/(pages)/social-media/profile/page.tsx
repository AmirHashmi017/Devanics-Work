"use client";
import { withAuth } from "@/app/hoc/withAuth";
import { CommunityLayout } from "../components/CommunityLayout";
import { ProfileInfo } from "./components/ProfileInfo";
import { ProfileAboutMe } from "./components/ProfileAboutMe";
import { ProfileWorkExperience } from "./components/ProfileWorkExperience";

function ProfilePage() {
    return (
        <CommunityLayout>
            <div className="space-y-6">
                <ProfileInfo />

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4 space-y-4">
                        <ProfileAboutMe />
                        <ProfileWorkExperience />
                    </div>

                    <div className="col-span-8">

                    </div>
                </div>
            </div>
        </CommunityLayout>
    );
}

export default withAuth(ProfilePage);