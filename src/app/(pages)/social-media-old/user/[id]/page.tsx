'use client';
import React, { useState } from 'react';
import UserPosts from '../../components/post/UserPosts';
import ProfileIntro from './components/Profile';
import { withAuth } from '@/app/hoc/withAuth';

const UserProfile = () => {
  const [fetchPosts, setFetchPosts] = useState(false);

  return (
    <section className="my-4 mx-8 px-4 gap-6">
      <h6 className="text-lg font-semibold text-graphiteGray">User Profile</h6>
      <ProfileIntro fetchPosts={() => setFetchPosts((prev) => !prev)} />
      <UserPosts fetchPosts={fetchPosts} />
    </section>
  );
};

export default withAuth(UserProfile);
