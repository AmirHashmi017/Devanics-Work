import Comments, { IComment } from '.';
import AddComment from '../post/AddComment';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { socialMediaService } from 'src/services/social-media.service';
import { setFetchComments } from 'src/redux/social-media/social-media.slice';
import useToggleVisibility from 'src/hooks/useToggleVisibility';
import { RootState } from 'src/redux/store';
import Profile from '../post/Profile';
import Reactions from '../post/Reactions';

export type ICommentProps = {
  isPostOwner?: boolean;
  reply_to_username?: string;
  postId: string;
} & IComment;

const SingleComment = (commentData: ICommentProps) => {
  const { user } = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const isCommentOnwer = user._id === postOwnerId;
  const deletePostCommentHandler = async () => {
    try {
      await socialMediaService.httpDeletePostComment(_id);
      dispatch(setFetchComments());
    } catch (error) {
      console.log(error);
    }
  };

  const fullName = socialName || name || companyName || organizationName;
  const from = companyName || university || name;
  const userAvatar = socialAvatar || avatar;

  return (
    <div>
      <div className="flex gap-3 justify-between">
        <Profile
          name={fullName}
          from={from}
          avatar={userAvatar}
          date={updatedAt}
          onClick={() => navigate(`/user/${postOwnerId}`)}
          isOwner={isCommentOnwer}
        />
        {isCommentOnwer ? (
          <div className="flex gap-2">
            <div
              onClick={deletePostCommentHandler}
              className="flex gap-2 h-6 cursor-pointer rounded-[3px] px-2 items-center bg-schestiLightPrimary"
            >
              <img
                src="/assets/icons/trash-03.svg"
                className="size-3"
                alt="profile"
              />
            </div>
            <div
              onClick={toggleEditVisibility}
              className="flex gap-2 cursor-pointer rounded-[3px] h-6 px-2 items-center bg-schestiLightPrimary"
            >
              <img
                src="/assets/icons/edit-2.svg"
                className="size-3"
                alt="profile"
              />
            </div>
          </div>
        ) : isPostOwner ? (
          <div className="flex gap-2 items-center">
            <div
              onClick={deletePostCommentHandler}
              className="flex gap-2 h-6 cursor-pointer rounded-[3px] px-2 items-center bg-schestiLightPrimary"
            >
              <img
                src="/assets/icons/trash-03.svg"
                className="size-3"
                alt="profile"
              />
            </div>
            <div
              onClick={toggleReplyVisibility}
              className="flex gap-2 cursor-pointer rounded-[3px] px-2 items-center bg-schestiLightPrimary"
            >
              <img
                src="/assets/icons/reply.svg"
                className="size-3"
                alt="profile"
              />
              <p className="text-lavenderPurpleReplica cursor-pointer font-semibold text-xs p-2">
                Reply
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <div
              onClick={deletePostCommentHandler}
              className="flex gap-2 h-6 cursor-pointer rounded-[3px] px-2 items-center bg-schestiLightPrimary"
            >
              <img
                src="/assets/icons/trash-03.svg"
                className="size-3"
                alt="profile"
              />
            </div>
            <div
              onClick={toggleReplyVisibility}
              className="flex gap-2 cursor-pointer rounded-[3px] px-2 items-center bg-schestiLightPrimary"
            >
              <img
                src="/assets/icons/reply.svg"
                className="size-3"
                alt="profile"
              />
              <p className="text-lavenderPurpleReplica cursor-pointer font-semibold text-xs p-2">
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
          <AddComment parentId={parentId} replyComment commentId={_id} />
        </div>
      )}
      <p className="mt-3 text-stormGrey">
        {' '}
        <span className="font-semibold text-base text-schestiPrimary mr-[2px]">
          {type == 'reply' && `@${reply_to_username || ''}`}
        </span>
        {content}
      </p>
      <div className="mt-2">
        <Reactions
          id={_id}
          reactions={reactions}
          isPost={false}
          userReaction={userReaction}
        />
      </div>
      <div className="mt-4 border-l flex flex-col gap-2 border-mercury ps-10">
        {replyCount > 0 && (
          <Comments
            parentId={_id}
            isPostOwner={isPostOwner}
            reply_to_username={name}
            postId={postId}
          />
        )}
      </div>
    </div>
  );
};

export default SingleComment;
