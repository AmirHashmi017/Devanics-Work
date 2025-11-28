import { useEffect, useState } from 'react';
import { socialMediaService } from 'src/services/social-media.service';
import { useParams } from 'react-router-dom';
import { IPost } from '../components/post';
import SinglePost from '../components/post/SinglePost';
import SecondaryHeading from 'src/components/Headings/Secondary';
import Comment from './Comment';
import SkeletonLoader from 'src/components/loader/Skeleton';

const Post = () => {
  const { id, commentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [postData, setPostData] = useState<IPost>({} as IPost);

  const getPostData = async () => {
    try {
      setIsLoading(true);
      const { data } = await socialMediaService.httpGetPost({
        id: id as string,
      });
      setPostData(data.post);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getPostData();
    }
  }, [id]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <section className="px-6 mt-4">
      <SecondaryHeading title="Post Details" />
      <SinglePost {...postData} viewComments={false} />
      {commentId && <Comment />}
    </section>
  );
};

export default Post;
