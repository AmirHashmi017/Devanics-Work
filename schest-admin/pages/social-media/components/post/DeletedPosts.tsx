import { useEffect, useState } from 'react';
import { IPost } from '.';
import { socialMediaService } from 'src/services/social-media.service';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { Skeleton } from 'antd';
import SinglePost from './SinglePost';
import NoPost from './NoData';

const DeletedPosts = () => {
  const [deletePosts, setDeletePosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchDeletePosts } = useSelector(
    (state: RootState) => state.socialMedia
  );

  const getPosts = async () => {
    setIsLoading(true);
    const { data } = await socialMediaService.httpGetDeletePosts({});
    console.log(data, 'd...');
    setIsLoading(false);
    setDeletePosts(data.posts);
  };

  useEffect(() => {
    getPosts();
  }, [fetchDeletePosts]);

  if (isLoading) {
    return <Skeleton />;
  }
  console.log(deletePosts, 'delete posts..');

  return (
    <div>
      {deletePosts.length ? (
        deletePosts.map((postData) => (
          <SinglePost {...postData} key={postData._id} />
        ))
      ) : (
        <NoPost />
      )}
    </div>
  );
};

export default DeletedPosts;
