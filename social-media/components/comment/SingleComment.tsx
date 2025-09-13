import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';
import Comments, { IComment } from '.';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { socialMediaService } from '@/app/services/social-media.service';
import { setFetchComments } from '@/redux/social-media/social-media.slice';
import AddComment from '../AddComment'
import useToggleVisibility from '@/app/hooks/useToggleVisibility';
import Report from '../Report';
import Profile from '../Profile';
import Reactions from '../Reactions';
import { IUserReaction } from '../';
import { useRouterHook } from '@/app/hooks/useRouterHook';

export type ICommentProps = {
  isPostOwner: boolean;
  isAdmin: boolean;
  reply_to_username?: string;
  postId: string;
  userReaction: IUserReaction;
  reactions: IUserReaction[];
  setRefetchPost: Dispatch<SetStateAction<boolean>>;
} & IComment;

const SingleComment = (commentData: ICommentProps) => {
  const { user } = useSelector((state: RootState) => state.auth.user);
  const router = useRouterHook();
  const dispatch = useDispatch();
  console.log('Comment Data', commentData);
  const {
    _id,
    parentId,
    isPostOwner = false,
    userReaction,
    reactions,
    content,
    updatedAt,
    reply_to_username,
    replyCount,
    type,
    postId,
    isAdmin,
    setRefetchPost,
  } = commentData;

  const {
    _id: postOwnerId,
    name = '',
    socialAvatar = '',
    socialName = '',
    avatar = '',
    name: postOwnerName = '',
    companyName = '',
    organizationName = '',
    university = '',
  } = commentData?.associatedCompany || {};

  const {
    isVisible: editVisible,
    toggleVisibility: toggleEditVisibility,
    containerRef: editContainerRef,
  } = useToggleVisibility<HTMLDivElement>();
  const {
    isVisible: replyVisible,
    toggleVisibility: toggleReplyVisibility,
    containerRef: replyContainerRef,
  } = useToggleVisibility<HTMLDivElement>();

  const isCommentOwner = user._id === postOwnerId;
  const deletePostCommentHandler = async () => {
    try {
      await socialMediaService.httpDeletePostComment(_id);
      dispatch(setFetchComments());
    } catch (error) {
      console.log(error, 'error in ...comment');
    }
  };

  const fullName = socialName || name || companyName || organizationName;
  const from = companyName || university || name;
  const userAvatar = socialAvatar || avatar;

  return (
    <>
      <div className="flex gap-3 justify-between mt-1">
        <Profile
          name={fullName}
          from={from}
          avatar={userAvatar}
          date={updatedAt}
          onClick={() =>
            router.push(
              `/social-media/user/${commentData.associatedCompany._id}`
            )
          }
          isOwner={isCommentOwner}
        />
        {isCommentOwner ? (
          <div className="flex gap-2 items-center">
            <div
              onClick={deletePostCommentHandler}
              className="h-6 cursor-pointer rounded-[3px] px-2 bg-schestiLightPrimary"
            >
              <Image src="/trash-03.svg" width={12} height={12} alt="profile" />
            </div>
            <div
              onClick={toggleEditVisibility}
              className="h-6 cursor-pointer rounded-[3px] py-0 px-2 bg-schestiLightPrimary"
            >
              <Image src="/edit-2.svg" width={12} height={12} alt="profile" />
            </div>
          </div>
        ) : isPostOwner ? (
          <div className="flex gap-2 items-center">
            <div
              onClick={deletePostCommentHandler}
              className="h-6 cursor-pointer rounded-[3px] px-2 bg-schestiLightPrimary"
            >
              <Image src="/trash-03.svg" width={12} height={12} alt="profile" />
            </div>
            <div
              onClick={toggleReplyVisibility}
              className="flex gap-2 cursor-pointer rounded-[3px] p-2 bg-schestiLightPrimary"
            >
              <Image src="/reply.svg" width={12} height={12} alt="profile" />
              <p className="text-lavenderPurpleReplica cursor-pointer font-semibold text-xs">
                Reply
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            {!isAdmin && (
              <Report
                id={postId}
                refetch={() => dispatch(setFetchComments())}
                commentId={_id}
              />
            )}
            <div
              onClick={toggleReplyVisibility}
              className="flex gap-2 cursor-pointer rounded-[3px] p-2 items-center bg-schestiLightPrimary"
            >
              <Image src="/reply.svg" width={12} height={12} alt="profile" />
              <p className="text-lavenderPurpleReplica cursor-pointer font-semibold text-xs">
                Reply
              </p>
            </div>
          </div>
        )}
      </div>
      {editVisible && (
        <div ref={editContainerRef}>
          <AddComment
            parentId={parentId}
            commentId={_id}
            isEdit
            commentContent={content}
          />
        </div>
      )}
      {replyVisible && (
        <div ref={replyContainerRef}>
          <AddComment parentId={_id} commentId={_id} replyComment />
        </div>
      )}
      <p className="mt-3 text-stormGrey">
        <span className="font-semibold text-base text-schestiPrimary mr-[2px]">
          {type == 'reply' && `@${reply_to_username}`}
        </span>
        {content}
      </p>
      <Reactions
        id={_id}
        reactions={reactions}
        isPost={false}
        userReaction={userReaction}
      />
      <div className="mt-4 border-l flex flex-col gap-2 border-mercury ps-10">
        {replyCount > 0 && (
          <Comments
            parentId={_id}
            isPostOwner={isPostOwner}
            isAdmin={isAdmin}
            setRefetchPost={setRefetchPost}
            reply_to_username={postOwnerName}
            postId={_id}
          />
        )}
      </div>
    </>
  );
};

export default SingleComment;
