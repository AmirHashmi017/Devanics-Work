import { useEffect, useState } from 'react';
import SinglePost from './SinglePost';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { IPost } from '.';
import { socialMediaService } from 'src/services/social-media.service';
import { RootState } from 'src/redux/store';
import NoPost from './NoData';

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
        posts.map((postData) => <SinglePost {...postData} key={postData._id} />)
      ) : (
        <NoPost />
      )}
    </div>
  );
};

export default MyPosts;
