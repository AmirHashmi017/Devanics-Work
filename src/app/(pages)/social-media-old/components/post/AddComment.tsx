import { socialMediaService } from '@/app/services/social-media.service';
import React, { useState } from 'react';
import {
  setCommentContent,
  setFetchComments,
} from '@/redux/social-media/social-media.slice';
import { Form, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import Profile from './Profile';
import { useUser } from '@/app/hooks/useUser';
import Image from 'next/image';

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
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useUser();

  const addPostCommentHandler = async () => {
    try {
      if (content.trim().length < 1) {
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

  const fullName = user?.firstName || user?.name;
  const avatar = user?.socialAvatar || user?.avatar;

  return (
    <Form
      className={clsx(
        'flex gap-3 mt-4 items-center',
        (replyComment || isEdit) && 'ms-6'
      )}
      onFinish={addPostCommentHandler}
    >
      <Profile showName={false} name={fullName} avatar={avatar} />
      <input
        // autoFocus={true}
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
          <Image
            src="/right-arrow.svg"
            onClick={addPostCommentHandler}
            className="cursor-pointer"
            height={38}
            width={38}
            alt="right-arrow"
            title="Add Comment"
          />
        )}
      </button>
    </Form>
  );
};

export default AddComment;
