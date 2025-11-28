import { useEffect, useState } from 'react';
import SinglePost from './SinglePost';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { IPost } from '.';
import { socialMediaService } from 'src/services/social-media.service';
import { useParams } from 'react-router-dom';
import { RootState } from 'src/redux/store';
import NoPost from './NoData';

const UserPosts = ({ refetchPosts }: { refetchPosts: boolean }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { fetchPosts } = useSelector((state: RootState) => state.socialMedia);

  const getUserPosts = async () => {
    setIsLoading(true);
    const { data } = await socialMediaService.httpGetUserPosts({
      id: id as string,
    });
    setIsLoading(false);
    setPosts(data.posts);
  };

  useEffect(() => {
    if (id) {
      getUserPosts();
    }
  }, [fetchPosts, id, refetchPosts]);

  if (isLoading) {
    <Skeleton />;
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

export default UserPosts;
