'use client';
import { Image } from "antd";
import ImageNext from 'next/image';
import React, { useEffect, useState } from 'react';
import { BsGlobe, BsX, BsHandThumbsUp, BsChatSquare, BsArrowRepeat, BsSend, BsHeart, BsChevronDown } from "react-icons/bs";
import Comments from './comment'; // Adjust path as needed
import { IPost, IUserReaction } from '.'; // Adjust path as needed
import { socialMediaService } from '@/app/services/social-media.service';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import AddComment from './AddComment'; // Adjust path as needed
import { Dropdown as AntdDropdown } from 'antd';
import { setFetchPosts, setPostData } from '@/redux/social-media/social-media.slice';
import WarningModal from '@/app/component/modal/Warning'; // Adjust path as needed
import Reactions from './Reactions'; // Adjust path as needed
import SharePost from './Share'; // Adjust path as needed
import { useRouter } from 'next/navigation';
import { postOptions, myPostOptions } from './Options'; // Adjust path as needed
import LightBox from './Lightbox'; // Adjust path as needed
import { useUser } from '@/app/hooks/useUser';
import { truncate } from 'lodash';
import Report from './Report'; // Adjust path as needed

type Props = {
  myFeed?: boolean;
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
  } = data;
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
  const [reactions, setReactions] = useState<IUserReaction[]>(initialReactions || []);
  const fullName = socialName || name || companyName || organizationName;
  const from = companyName || university || organizationName || name;
  const userAvatar = socialAvatar || avatar || '/profileAvatar.png';
  const router = useRouter();
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [seeMore, setSeeMore] = useState(false);
  const user = useUser();

  const isPostOwner = postOwnerId === user?._id;
  const isAdmin = postOwnerRole === 'admin';

  const getPostHandler = async () => {
    try {
      const { data: { post } } = await socialMediaService.httpGetPost({ id: _id });
      setTotalComments(post.comments?.length || 0); // Set initial comment count
      setReactions(post.reactions || []); // Update reactions from server
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'Error fetching post');
      console.log(error, 'error in post fetch...');
    }
  };

  useEffect(() => {
    getPostHandler();
  }, [refetchPost]);

  const handlePostDropdownClick = async (key: string) => {
    if (key === 'edit') {
      dispatch(setPostData({ _id, description, mediaFiles }));
    } else if (key === 'delete') {
      setShowDeleteModal(true);
    } else if (key === 'report') {
      // Report handled via modal in Report component
    }
  };

  const deletePostHandler = async () => {
    setIsDeletingPost(true);
    try {
      const { message } = await socialMediaService.httpDeletePost(_id);
      setIsDeletingPost(false);
      setShowDeleteModal(false);
      dispatch(setFetchPosts());
      toast.success(message);
    } catch (error) {
      console.log(error);
      setIsDeletingPost(false);
    }
  };

  const handleLightbox = (i: number) => {
    setLightboxIndex(i);
    setOpenLightbox(true);
  };

  const handleReactionUpdate = (newReaction: IUserReaction | null) => {
    setReactions((prev) => {
      if (newReaction) {
        const existingReactionIndex = prev.findIndex(
          (r) => r.associatedCompany === user?._id
        );
        if (existingReactionIndex >= 0) {
          const updatedReactions = [...prev];
          updatedReactions[existingReactionIndex] = newReaction;
          return updatedReactions;
        } else {
          return [...prev, newReaction];
        }
      } else {
        return prev.filter((r) => r.associatedCompany !== user?._id);
      }
    });
    setRefetchPost((prev) => !prev); // Trigger refetch to sync with server
  };

  const totalReactions = reactions?.length || 0;

  const dropdownItems = isPostOwner
    ? myFeed
      ? [...postOptions, ...myPostOptions]
      : myPostOptions
    : [...postOptions, { key: 'report', label: <Report id={_id} refetch={() => setRefetchPost((prev) => !prev)} /> }];

  return (
    <div className="w-full max-w-3xl bg-white border rounded-2xl shadow overflow-hidden relative mb-4">
      <WarningModal
        openModal={showDeleteModal}
        setOpenModal={setShowDeleteModal}
        isLoading={isDeletingPost}
        deleteHandler={deletePostHandler}
      />

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
                onClick={() => router.push(`/social-media/user/${postOwnerId}`)}
              >
                {fullName || 'Civilian Company'}
              </h2>
              <span className="text-[#717171]">•</span>
              <span className="text-[#717171]">1st</span>
            </div>
            <p className="text-[#717171]">{from || 'Civil Engineering Company'}</p>
            <div className="flex items-center gap-1 text-[#717171] text-sm mt-1">
              <span>{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span>•</span>
              <BsGlobe className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#717171]">
          {isPostOwner && (
            <AntdDropdown
              menu={{
                items: dropdownItems,
                onClick: (event) => {
                  const { key } = event;
                  handlePostDropdownClick(key);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                },
              }}
              placement="bottomRight"
              className="text-2xl"
            >
              <BsChevronDown
                className="h-5 w-5 cursor-pointer active:scale-105"
              />
            </AntdDropdown>
          )}
          <BsX className="h-6 w-6" />
        </div>
      </div>

      <div className="px-4 pb-3">
        <p className="text-[#1a202c] text-lg whitespace-pre-wrap">
          {truncate(description, {
            length: seeMore ? description.length : 100,
            omission: '...',
            separator: ' ',
          })}{' '}
          {description?.length > 100 && (
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

      {mediaFiles && mediaFiles.length > 0 && (
        <div className="relative">
          <LightBox
            mediaUrls={mediaFiles}
            open={openLightbox}
            setOpen={setOpenLightbox}
            index={lightboxIndex}
          />
          <div className="w-full relative h-[324px] rounded-md p-2">
            {mediaFiles[0].type?.includes('video') ? (
              <video
                src={mediaFiles[0].url}
                onClick={() => handleLightbox(0)}
                className="w-full h-full rounded-md object-cover cursor-pointer"
              />
            ) : (
              <Image
                src={mediaFiles[0].url}
                alt="Post media"
                width={'100%'}
                height={'100%'}
                className="rounded-md object-cover cursor-pointer"
                preview={false}
                onClick={() => handleLightbox(0)}
              />
            )}
            {mediaFiles.length > 1 && (
              <p
                onClick={() => handleLightbox(0)}
                className="absolute text-white font-semibold text-xl left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10"
              >
                +{mediaFiles.length - 1}
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
          <span className="text-[#717171] text-sm ml-1">{reactions.length}</span>
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
            id={_id}
            reactions={reactions}
            userReaction={userReaction}
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
        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-[#ededed] text-[#717171] cursor-pointer">
          <BsArrowRepeat className="h-5 w-5" />
          <span className="font-medium">Repost</span>
        </div>
        <SharePost
          url={
            mediaFiles?.length
              ? mediaFiles[0].url
              : process.env.NEXT_PUBLIC_APP_URL + `socialMedia/post/${_id}`
          }
          id={_id}
        />
      </div>

      {showComments && (
        <div className="border-t border-[#e8e8e8] p-4">
          <Comments
            parentId={_id}
            postId={_id}
            setRefetchPost={setRefetchPost}
            setTotalComments={setTotalComments}
            isPostOwner={isPostOwner}
            isAdmin={isAdmin}
          />
          <AddComment parentId={_id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;