import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SingleComment from './SingleComment';
import { useDispatch, useSelector } from 'react-redux';
import { IUserInterface } from 'src/interfaces/authInterfaces/user.interface';
import { RootState } from 'src/redux/store';
import { socialMediaService } from 'src/services/social-media.service';
import { setCommentContent } from 'src/redux/social-media/social-media.slice';
import { IPost, IUserReaction } from '../post';
import SkeletonLoader from 'src/components/loader/Skeleton';

export interface IComment {
  _id: string;
  parentId: string;
  associatedCompany: IUserInterface;
  content: string;
  createdAt: string;
  updatedAt: string;
  post: IPost;
  type: 'post' | 'reply';
  replyCount: any;
  __v: number;
  userReaction: IUserReaction;
  reactions: IUserReaction[];
}
const Comments = ({
  parentId,
  setTotalComments,
  isPostOwner,
  reply_to_username = '',
  postId,
}: {
  parentId: string;
  setTotalComments?: Dispatch<SetStateAction<number>>;
  isPostOwner: boolean;
  reply_to_username?: string;
  postId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const { fetchComments } = useSelector(
    (state: RootState) => state.socialMedia
  );
  const dispatch = useDispatch();

  const getCommentsHandler = async () => {
    try {
      setIsLoading(true);
      const {
        data: { postComments },
      } = await socialMediaService.httpGetPostComments({ id: parentId });
      setComments(
        reply_to_username
          ? postComments.map((comment: IComment) => ({
              ...comment,
              reply_to_username,
            }))
          : postComments
      );
      if (setTotalComments) setTotalComments(postComments.length);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(setCommentContent(''));
    getCommentsHandler();
  }, [fetchComments]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="mt-4 flex  gap-2 flex-col">
      {comments.map((data) => (
        <SingleComment
          key={data._id}
          {...data}
          isPostOwner={isPostOwner}
          postId={postId}
        />
      ))}
    </div>
  );
};

export default Comments;
