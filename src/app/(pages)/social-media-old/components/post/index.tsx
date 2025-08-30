import React, { useEffect, useState } from 'react';
import SinglePost from './SinglePost';
import { socialMediaService } from '@/app/services/social-media.service';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SkeletonLoader from '@/app/component/loader/Skeleton';

const SchestiPosts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchPosts } = useSelector((state: RootState) => state.socialMedia);

  const getPost = async () => {
    setIsLoading(true);
    const { data } = await socialMediaService.httpGetPosts({ searchText: '' });
    setIsLoading(false);
    setPosts(data.posts);
  };

  useEffect(() => {
    getPost();
  }, [fetchPosts]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div>
      {posts.map((postData) => (
        <SinglePost {...postData} key={postData._id} />
      ))}
    </div>
  );
};

export default SchestiPosts;

export interface IUserReaction {
  type: string;
  associatedCompany: string;
  _id: string;
}
export interface IPost {
  _id: string;
  description?: string;
  associatedCompany: IUserInterface;
  mediaFiles: IMediaFile[];
  userReaction: IUserReaction;
  reactions: IUserReaction[];
  pinPosts: string[];
  savedPosts: string[];
  createdAt: string;
  updatedAt: string;
  feeling?: string;
  __v: number;
}

export interface IMediaFile {
  type: string;
  url: string;
  name: string;
  extension: string;
  _id?: string;
}
