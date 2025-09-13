'use client';

import { withAuth } from "@/app/hoc/withAuth";
import { CommunityLayout } from "./components/CommunityLayout";
import { CreatePost } from "./components/CreatePost";
import PostListing from "./components/PostListing";
import FeedRecommendationsCard from "./components/FeedRecommendationsCard";
import JobListingCard from "./components/JobListingCard";


function CommunityPage() {
    return <CommunityLayout>
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 space-y-4 px-5 mx-auto">
                <CreatePost />
                <PostListing/>
            </div>
            <div className="col-span-4 space-y-4">
                <FeedRecommendationsCard />
                <JobListingCard />
            </div>
        </div>
    </CommunityLayout>
}


export default withAuth(CommunityPage)