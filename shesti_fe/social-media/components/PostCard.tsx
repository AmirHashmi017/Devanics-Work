'use client';
import { Image } from 'antd';
import ImageNext from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  BsX,
  BsHandThumbsUp,
  BsChatSquare,
  BsArrowRepeat,
  BsHeart,
  BsThreeDots,
} from 'react-icons/bs';
import Comments from './comment';
import { IPost, IUserReaction } from '.';
import { socialMediaService } from '@/app/services/social-media.service';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import AddComment from './AddComment';
import { Dropdown as AntdDropdown } from 'antd';
import {
  setFetchPosts,
  setPostData,
} from '@/redux/social-media/social-media.slice';
import WarningModal from '@/app/component/modal/Warning';
import Reactions from './Reactions';
import SharePost from './Share';
import { useRouter } from 'next/navigation';
import { postOptions, myPostOptions } from './Options';
import LightBox from './Lightbox';
import { useUser } from '@/app/hooks/useUser';
import { truncate } from 'lodash';
import Report from './Report';

type Props = {
  myFeed?: boolean;
  onPostDeleted?: () => void;
  onPostHidden?: (postId: string) => void;
  onEditPost?: (postData: IPost) => void;
} & IPost;

const PostCard = (data: Props) => {
  const {
    _id,
    description,
    mediaFiles,
    feeling = '',
    userReaction,
    createdAt,
    reactions: initialReactions,
    myFeed = false,
    onPostDeleted,
    onPostHidden,
    onEditPost,
    type, // 'post' or 'repost'
    repostedBy, // Present if type is 'repost'
    post, // Present if type is 'repost' - contains original post data
  } = data;

  // For reposts, use the original post data
  const isRepost = type === 'repost';
  // const originalPost = isRepost ? post : data;
  const currentPost = isRepost && post ? post : data;

  const {
    _id: postOwnerId = '',
    userRole: postOwnerRole = '',
    socialName,
    name = '',
    university = '',
    companyName = '',
    organizationName = '',
    avatar = '',
    socialAvatar = '',
  } = data?.associatedCompany || {};

  const [refetchPost, setRefetchPost] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isReposting, setIsReposting] = useState(false);
  const [reactions, setReactions] = useState<IUserReaction[]>(
    initialReactions || []
  );
  const [currentUserReaction, setCurrentUserReaction] =
    useState<IUserReaction | null>(userReaction || null);
  const fullName = socialName || name || companyName || organizationName;
  const from = companyName || university || organizationName || name;
  const userAvatar = socialAvatar || avatar || '/profileAvatar.png';
  const router = useRouter();
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [seeMore, setSeeMore] = useState(false);
  const user = useUser();

  const isPostOwner = postOwnerId === user?._id;
  const isRepostOwner = isRepost && repostedBy?._id === user?._id;
  const isAdmin = postOwnerRole === 'admin';

  // For reposts, we need to get the reposted by user info
  const repostedByName = isRepost
    ? repostedBy?.socialName ||
      repostedBy?.name ||
      repostedBy?.companyName ||
      repostedBy?.organizationName
    : '';
  const repostedByAvatar = isRepost
    ? repostedBy?.socialAvatar || repostedBy?.avatar || '/profileAvatar.png'
    : '';

  const getPostHandler = async () => {
    try {
      // Use the original post ID for comments and reactions
      const postIdToUse = isRepost ? currentPost._id : _id;

      const {
        data: { post },
      } = await socialMediaService.httpGetPost({ id: postIdToUse });
      const {
        data: { postComments },
      } = await socialMediaService.httpGetPostComments({ id: postIdToUse });

      setTotalComments(postComments?.length || 0);
      setReactions(post.reactions || []);

      const userReactionData = post.reactions?.find(
        (reaction: IUserReaction) => reaction.associatedCompany === user?._id
      );
      setCurrentUserReaction(userReactionData || null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'Error fetching post');
      console.log(error, 'error in post fetch...');
    }
  };

  useEffect(() => {
    getPostHandler();
  }, [_id, user?._id]);

  useEffect(() => {
    if (refetchPost) {
      getPostHandler();
      setRefetchPost(false);
    }
  }, [refetchPost]);

  const handlePostDropdownClick = async (key: string) => {
    if (key === 'edit' && !isRepost) {
      // Only allow editing for original posts, not reposts
      const postDataForEdit: IPost = {
        _id,
        description,
        mediaFiles,
        feeling,
        associatedCompany: data.associatedCompany,
        reactions: reactions,
        userReaction: currentUserReaction as IUserReaction,
        createdAt,
        pinPosts: data.pinPosts || [],
        savedPosts: data.savedPosts || [],
        updatedAt: data.updatedAt || createdAt,
        __v: data.__v || 0,
      };

      dispatch(setPostData({ _id, description, mediaFiles, feeling }));
      onEditPost?.(postDataForEdit);
    } else if (key === 'delete') {
      setShowDeleteModal(true);
    }
  };

  const deletePostHandler = async () => {
    setIsDeletingPost(true);
    try {
      let message;

      if (isRepost) {
        // Delete repost
        console.log('Repost');
        console.log(_id);
        const response = await socialMediaService.httpDeleteRepost(_id);
        message = response.message;
      } else {
        console.log(_id);
        // Delete original post
        const response = await socialMediaService.httpDeletePost(_id);
        message = response.message;
      }

      setIsDeletingPost(false);
      setShowDeleteModal(false);
      dispatch(setFetchPosts());
      toast.success(message);
      onPostDeleted?.();
    } catch (error) {
      console.log(error);
      setIsDeletingPost(false);
      toast.error('Error deleting post');
    }
  };

  const handleRepostClick = async () => {
    if (isReposting) return;

    setIsReposting(true);
    try {
      const postIdToRepost = isRepost ? currentPost._id : _id;
      const response = await socialMediaService.httpRepostPost(postIdToRepost);

      toast.success(response.message);
      dispatch(setFetchPosts());
      onPostDeleted?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'Error reposting');
      console.log(error, 'error in repost...');
    } finally {
      setIsReposting(false);
    }
  };

  const handleLightbox = (i: number) => {
    setLightboxIndex(i);
    setOpenLightbox(true);
  };

  const handleReactionUpdate = (
    newReaction: IUserReaction | null,
    reactionType?: string
  ) => {
    if (newReaction) {
      setCurrentUserReaction(newReaction);
      setReactions((prev) => {
        const existingReactionIndex = prev.findIndex(
          (r) => r.associatedCompany === user?._id
        );
        if (existingReactionIndex >= 0) {
          const updatedReactions = [...prev];
          updatedReactions[existingReactionIndex] = {
            ...newReaction,
            type: reactionType || newReaction.type,
          };
          return updatedReactions;
        } else {
          return [...prev, { ...newReaction, type: reactionType || 'like' }];
        }
      });
    } else {
      setCurrentUserReaction(null);
      setReactions((prev) =>
        prev.filter((r) => r.associatedCompany !== user?._id)
      );
    }
  };

  const handleHidePost = () => {
    onPostHidden?.(_id);
  };

  const totalReactions = reactions?.length || 0;

  // Different dropdown options for reposts vs original posts
  const getDropdownItems = () => {
    if (isRepost && isRepostOwner) {
      // For reposts, only show delete option
      return [{ key: 'delete', label: 'Delete Repost' }];
    } else if (isPostOwner && !isRepost) {
      // For original posts owned by user
      return myFeed
        ? [...(postOptions || []), ...(myPostOptions || [])]
        : myPostOptions || [];
    } else {
      // For posts not owned by user
      return [
        ...(postOptions || []),
        {
          key: 'report',
          label: (
            <Report
              id={isRepost ? currentPost._id : _id}
              refetch={() => setRefetchPost(true)}
            />
          ),
        },
      ];
    }
  };

  const getRelativeTime = (createdAt: string) => {
    const now = new Date();
    const postTime = new Date(createdAt);
    const diffInMs = now.getTime() - postTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.42));
    const diffInYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} week`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} Month`;
    } else {
      return `${diffInYears} Year`;
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white border rounded-2xl shadow overflow-hidden relative mb-4">
      <WarningModal
        openModal={showDeleteModal}
        setOpenModal={setShowDeleteModal}
        isLoading={isDeletingPost}
        deleteHandler={deletePostHandler}
      />

      {/* Repost Header - Show only for reposts */}
      {isRepost && (
        <div className="px-4 pt-3 pb-1 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2 text-[#717171] text-sm">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-[#00496d] relative">
              <ImageNext
                src={repostedByAvatar}
                alt={`${repostedByName} Avatar`}
                fill
                className="object-cover"
              />
            </div>
            <span>
              <span
                className="font-medium text-[#1a202c] cursor-pointer hover:underline"
                onClick={() =>
                  router.push(`/social-media/profile/${postOwnerId}`)
                }
              >
                {repostedByName}
              </span>{' '}
              reposted this
            </span>
          </div>

          {/* Move the menu here for reposts */}
          <div className="flex items-center gap-4 text-[#717171]">
            {(isPostOwner || isRepostOwner) && (
              <AntdDropdown
                menu={{
                  items: getDropdownItems(),
                  onClick: (event) => {
                    const { key } = event;
                    handlePostDropdownClick(key);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  },
                }}
                placement="bottomRight"
                className="text-2xl"
              >
                <BsThreeDots className="h-5 w-5 cursor-pointer active:scale-105" />
              </AntdDropdown>
            )}
            <BsX
              className="h-6 w-6 cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors"
              onClick={handleHidePost}
            />
          </div>
        </div>
      )}

      <div className="p-4 flex items-start justify-between">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#00496d] relative">
            <ImageNext
              src={userAvatar}
              alt={`${fullName} Avatar`}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className="font-semibold text-[#1a202c] text-xl cursor-pointer"
                onClick={() =>
                  router.push(`/social-media/profile/${postOwnerId}`)
                }
              >
                {fullName || 'Civilian Company'}
              </h2>
              {feeling && (
                <p className="text-[#717171] text-base">is feeling {feeling}</p>
              )}
            </div>
            <p className="text-[#717171]">
              {from || 'Civil Engineering Company'}
            </p>

            <div className="flex items-center gap-1 text-[#717171] text-sm mt-1">
              <span>
                {getRelativeTime(isRepost ? createdAt : currentPost.createdAt)}
              </span>
            </div>
          </div>
        </div>
        {!isRepost && (
          <div className="flex items-center gap-4 text-[#717171]">
            {(isPostOwner || isRepostOwner) && (
              <AntdDropdown
                menu={{
                  items: getDropdownItems(),
                  onClick: (event) => {
                    const { key } = event;
                    handlePostDropdownClick(key);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  },
                }}
                placement="bottomRight"
                className="text-2xl"
              >
                <BsThreeDots className="h-5 w-5 cursor-pointer active:scale-105" />
              </AntdDropdown>
            )}
            <BsX
              className="h-6 w-6 cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors"
              onClick={handleHidePost}
            />
          </div>
        )}
      </div>

      <div className="px-4 pb-3">
        <p className="text-[#1a202c] text-lg whitespace-pre-wrap">
          {truncate(currentPost.description, {
            length: seeMore ? currentPost.description?.length || 0 : 100,
            omission: '...',
            separator: ' ',
          })}{' '}
          {(currentPost.description?.length || 0) > 100 && (
            <span>
              <button
                className="text-blueOrchid font-medium cursor-pointer bg-transparent"
                onClick={() => setSeeMore((prev) => !prev)}
              >
                {seeMore ? 'show less' : 'see more'}
              </button>
            </span>
          )}
        </p>
      </div>

      {currentPost.mediaFiles && currentPost.mediaFiles.length > 0 && (
        <div className="relative">
          <LightBox
            mediaUrls={currentPost.mediaFiles}
            open={openLightbox}
            setOpen={setOpenLightbox}
            index={lightboxIndex}
          />
          <div className="w-full relative h-[324px] rounded-md p-2">
            {currentPost.mediaFiles[0].type?.includes('video') ? (
              <video
                src={currentPost.mediaFiles[0].url}
                onClick={() => handleLightbox(0)}
                className="w-full h-full rounded-md object-cover cursor-pointer"
              />
            ) : (
              <Image
                src={currentPost.mediaFiles[0].url}
                alt="Post media"
                width={'100%'}
                height={'100%'}
                className="rounded-md object-cover cursor-pointer"
                preview={false}
                onClick={() => handleLightbox(0)}
              />
            )}
            {currentPost.mediaFiles.length > 1 && (
              <p
                onClick={() => handleLightbox(0)}
                className="absolute text-white font-semibold text-xl left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10"
              >
                +{currentPost.mediaFiles.length - 1}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="px-4 py-2 flex justify-between border-b border-[#e8e8e8]">
        <div className="flex items-center gap-1">
          <div className="flex">
            <div className="bg-[#378fe9] rounded-full p-1 z-10">
              <BsHandThumbsUp className="h-3 w-3 text-white" />
            </div>
            <div className="bg-[#df704d] rounded-full p-1 -ml-1">
              <BsHeart className="h-3 w-3 text-white" />
            </div>
          </div>
          <span className="text-[#717171] text-sm ml-1">{totalReactions}</span>
        </div>
        <div>
          <span
            className="text-[#717171] text-sm cursor-pointer hover:underline"
            onClick={() => setShowComments((prev) => !prev)}
          >
            {totalComments > 0 ? `${totalComments} comments` : '0 comments'}
          </span>
        </div>
      </div>

      <div className="px-2 py-1 flex justify-between">
        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-[#ededed] text-[#717171] cursor-pointer">
          <Reactions
            id={isRepost ? currentPost._id : _id}
            reactions={reactions}
            userReaction={currentUserReaction}
            isPost={true}
            onReactionUpdate={handleReactionUpdate}
          />
          <span className="font-medium">Like</span>
        </div>
        <div
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-[#ededed] text-[#717171] cursor-pointer"
          onClick={() => setShowComments((prev) => !prev)}
        >
          <BsChatSquare className="h-5 w-5" />
          <span className="font-medium">Comment</span>
        </div>
        <div
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-[#ededed] text-[#717171] cursor-pointer ${isReposting ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={handleRepostClick}
        >
          <BsArrowRepeat
            className={`h-5 w-5 ${isReposting ? 'animate-spin' : ''}`}
          />
          <span className="font-medium">
            {isReposting ? 'Reposting...' : 'Repost'}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-[#ededed] text-[#717171] cursor-pointer">
          <SharePost
            url={
              currentPost.mediaFiles?.length
                ? currentPost.mediaFiles[0].url
                : process.env.NEXT_PUBLIC_APP_URL +
                  `socialMedia/post/${isRepost ? currentPost._id : _id}`
            }
            id={isRepost ? currentPost._id : _id}
          />
        </div>
      </div>

      {showComments && (
        <div className="border-t border-[#e8e8e8] p-4">
          <Comments
            parentId={isRepost ? currentPost._id : _id}
            postId={isRepost ? currentPost._id : _id}
            setRefetchPost={setRefetchPost}
            setTotalComments={setTotalComments}
            isPostOwner={isPostOwner}
            isAdmin={isAdmin}
          />
          <AddComment parentId={isRepost ? currentPost._id : _id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
