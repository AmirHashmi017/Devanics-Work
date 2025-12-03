'use client';

import { withAuth } from '@/app/hoc/withAuth';
import { CommunityLayout } from './components/CommunityLayout';
import { CreatePost } from './components/CreatePost';
import PostListing from './components/PostListing';
import FeedRecommendationsCard from './components/FeedRecommendationsCard';
import JobListingCard from './components/JobListingCard';
import { useState } from 'react'; // Add this import

function CommunityPage() {
  const [refetchPosts, setRefetchPosts] = useState(false); // Add this state

  return (
    <CommunityLayout>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-4 px-5 mx-auto">
          <CreatePost onPostAction={() => setRefetchPosts((prev) => !prev)} />
          <PostListing
            fetchPosts={refetchPosts}
            onPostDeleted={() => setRefetchPosts((prev) => !prev)}
          />
        </div>
        <div className="col-span-4 space-y-4">
          <FeedRecommendationsCard />
          <JobListingCard />
        </div>
      </div>
    </CommunityLayout>
  );
}

export default withAuth(CommunityPage);
