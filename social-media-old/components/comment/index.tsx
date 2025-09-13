import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SingleComment from './SingleComment';
import { socialMediaService } from '@/app/services/social-media.service';
import Loader from '@/app/component/loader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { setCommentContent } from '@/redux/social-media/social-media.slice';
import { IPost, IUserReaction } from '../post';

export interface IComment {
  _id: string;
  parentId: string;
  associatedCompany: IUserInterface;
  content: string;
  createdAt: string;
  updatedAt: string;
  userReaction: IUserReaction;
  reactions: IUserReaction[];
  post: IPost;
  type: 'post' | 'reply';
  replyCount: any;
  __v: number;
}

const Comments = ({
  parentId,
  setTotalComments,
  isPostOwner,
  isAdmin,
  setRefetchPost,
  reply_to_username = '',
  postId,
}: {
  parentId: string;
  setTotalComments?: Dispatch<SetStateAction<number>>;
  isPostOwner: boolean;
  isAdmin: boolean;
  reply_to_username?: string;
  setRefetchPost: Dispatch<SetStateAction<boolean>>;
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
    return <Loader />;
  }

  return (
    <div className="mt-4 flex  gap-2 flex-col">
      {comments.map((data) => (
        <SingleComment
          key={data._id}
          {...data}
          setRefetchPost={setRefetchPost}
          isPostOwner={isPostOwner}
          isAdmin={isAdmin}
          postId={postId}
        />
      ))}
    </div>
  );
};

export default Comments;
