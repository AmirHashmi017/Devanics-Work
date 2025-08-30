import React, { useEffect, useState } from 'react';
import SinglePost from './SinglePost';
import { socialMediaService } from '@/app/services/social-media.service';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { IPost } from '.';
import NoData from './NoData';

const MyPosts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth.user);
  const { fetchPosts } = useSelector((state: RootState) => state.socialMedia);

  const getPosts = async () => {
    setIsLoading(true);
    const { data } = await socialMediaService.httpGetUserPosts({
      id: user._id,
    });
    setIsLoading(false);
    setPosts(data.posts);
  };

  useEffect(() => {
    getPosts();
  }, [fetchPosts]);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div>
      {posts.length ? (
        posts.map((postData) => (
          <SinglePost {...postData} key={postData._id} myFeed />
        ))
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default MyPosts;
