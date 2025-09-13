import React, { useEffect, useState } from 'react';
import SinglePost from './SinglePost';
import { socialMediaService } from '@/app/services/social-media.service';
import { Skeleton } from 'antd';
import { IPost } from '.';
import { useParams } from 'next/navigation';
import { useUser } from '@/app/hooks/useUser';

type Props = {
  fetchPosts?: boolean;
};

const UserPosts = ({ fetchPosts }: Props) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const getUserPosts = async () => {
    setIsLoading(true);
    const { data } = await socialMediaService.httpGetUserPosts({
      id: (id as string) || (user?._id as string),
    });
    setIsLoading(false);
    setPosts(data.posts);
  };

  useEffect(() => {
    if (id || user?._id) {
      getUserPosts();
    }
  }, [id, fetchPosts]);

  if (isLoading) {
    <Skeleton />;
  }

  return (
    <div>
      {posts.length ? (
        posts.map((postData) => <SinglePost {...postData} key={postData._id} />)
      ) : (
        <p className="text-md font-semibold mt-2">No Posts Available</p>
      )}
    </div>
  );
};

export default UserPosts;
