import { useEffect, useState } from 'react';
import SinglePost from './SinglePost';
import { useSelector } from 'react-redux';
import { IUserInterface } from 'src/interfaces/authInterfaces/user.interface';
import { socialMediaService } from 'src/services/social-media.service';
import { RootState } from 'src/redux/store';
import NoPost from './NoData';
import SkeletonLoader from 'src/components/loader/Skeleton';

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

const SchestiPosts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      {posts.length ? (
        posts.map((postData) => <SinglePost {...postData} key={postData._id} />)
      ) : (
        <NoPost />
      )}
    </div>
  );
};

export default SchestiPosts;
