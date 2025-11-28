import { Form, Spin } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  setCommentContent,
  setFetchComments,
} from 'src/redux/social-media/social-media.slice';
import { socialMediaService } from 'src/services/social-media.service';
import Profile from './Profile';
import { useUser } from 'src/hooks/useUser';

type Props = {
  isEdit?: boolean;
  commentId?: string;
  replyComment?: boolean;
  parentId: string;
  commentContent?: string;
};
const AddComment = ({
  parentId,
  isEdit,
  commentId,
  replyComment,
  commentContent = '',
}: Props) => {
  const [content, setContent] = useState(commentContent);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();

  const addPostCommentHandler = async () => {
    try {
      if (!content) {
        toast.error('fill comment field');
        return;
      }
      setIsLoading(true);
      if (replyComment) {
        await socialMediaService.httpAddPostComment({
          id: parentId,
          content,
          type: 'reply',
        });
        dispatch(setCommentContent(''));
        dispatch(setFetchComments());
      } else if (isEdit) {
        await socialMediaService.httpUpdatePostComment({
          id: commentId!,
          content,
        });
        dispatch(setCommentContent(''));
        dispatch(setFetchComments());
      } else {
        await socialMediaService.httpAddPostComment({ id: parentId, content });
        dispatch(setFetchComments());
      }
      setContent('');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      className="flex gap-3 mt-4 items-center"
      onFinish={addPostCommentHandler}
    >
      <Profile
        showName={false}
        name={user?.firstName || user?.name}
        avatar={user?.socialAvatar || user?.avatar}
      />
      <input
        value={content}
        onChange={({ target }) => setContent(target.value)}
        type="text"
        className="border p-3 border-mercury placeholder:text-coolGray text-sm w-full rounded-md"
        placeholder="Add a comment"
      />
      <button
        className="rounded-full bg-transparent"
        disabled={content.trim().length < 1 || isLoading}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <img
            src="/assets/icons/right-arrow.svg"
            className="size-[38px] rounded-full cursor-pointer"
            alt="right-arrow"
          />
        )}
      </button>
    </Form>
  );
};

export default AddComment;
