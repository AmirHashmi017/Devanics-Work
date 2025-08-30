'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Comments from '../comment';
import { IPost } from '.';
import { socialMediaService } from '@/app/services/social-media.service';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import AddComment from './AddComment';
import { Dropdown } from 'antd';
import {
  setFetchPosts,
  setPostData,
} from '@/redux/social-media/social-media.slice';
import WarningModal from '@/app/component/modal/Warning';
import Reactions from './Reactions';
import Report from './Report';
import SharePost from './Share';
import { useRouter } from 'next/navigation';
import { postOptions, myPostOptions } from './Options';
import LightBox from '../Lightbox';
import { useUser } from '@/app/hooks/useUser';
import ProfileAvatar from './Profile';
import { truncate } from 'lodash';

type Props = {
  myFeed?: boolean;
} & IPost;
const SinglePost = (data: Props) => {
  const {
    _id,
    description,
    mediaFiles,
    feeling = '',
    userReaction,
    createdAt,
    reactions,
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
  // const [seeMore, setSeeMore] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  // const [showComments, setShowComments] = useState(true);
  let showComments = true;
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const fullName = socialName || name || companyName || organizationName;
  const from = companyName || university || organizationName || name;
  const userAvatar = socialAvatar || avatar || '/profileAvatar.png';
  const router = useRouter();
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [seeMore, setSeeMore] = useState(false);
  const user = useUser();

  const isPostOwner = postOwnerId === user?._id;
  const isAdmin = postOwnerRole === ('admin' as any);

  const getPostHandler = async () => {
    try {
      //   const {
      //     data: { post },
      //   } = await socialMediaService.httpGetPost({ id: _id });
    } catch (error) {
      const err = error as AxiosError<{ messsage: string }>;
      toast.error(err.response?.data.messsage);
      console.log(error, 'erro in post reaction...');
    }
  };

  useEffect(() => {
    getPostHandler();
  }, [refetchPost]);

  const handlePostDropdownClick = async (key: string) => {
    if (key === 'edit') {
      dispatch(setPostData({ _id, description, mediaFiles }));
    } else {
      setShowDeleteModal(true);
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
    }
  };

  const handleLightbox = (i: number) => {
    setLightboxIndex(i);
    setOpenLightbox(true);
  };
  return (
    <section className="w-full my-3.5 shadow relative rounded-xl p-6 bg-white">
      <WarningModal
        openModal={showDeleteModal}
        setOpenModal={setShowDeleteModal}
        isLoading={isDeletingPost}
        deleteHandler={deletePostHandler}
      />
      {isPostOwner && (
        <Dropdown
          menu={{
            items: myFeed ? postOptions : myPostOptions,
            onClick: (event) => {
              const { key } = event;
              handlePostDropdownClick(key);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            },
          }}
          className="absolute right-4 text-2xl"
          placement="bottomRight"
        >
          <Image
            src={'/menuIcon.svg'}
            alt="logo white icon"
            width={20}
            height={20}
            className="active:scale-105 cursor-pointer"
          />
        </Dropdown>
      )}

      <ProfileAvatar
        name={fullName}
        feeling={feeling}
        date={createdAt}
        avatar={userAvatar}
        onClick={() => router.push(`/social-media/user/${postOwnerId}`)}
        from={isAdmin ? '' : from}
      />

      {description && (
        <div className="flex description mt-3 text-steelGray text-xs">
          <p className="whitespace-pre-wrap">
            {truncate(description, {
              length: seeMore ? description.length : 100,
              omission: '...',
              separator: ' ',
            })}{' '}
            {description.length > 100 && (
              <span>
                <button
                  className="text-blueOrchid font-medium cursor-pointer bg-transparent"
                  onClick={() => setSeeMore((prev) => !prev)}
                >
                  {seeMore ? 'show less' : 'see more'}
                </button>
              </span>
            )}{' '}
          </p>
        </div>
      )}

      {/* filesimages or video view on single post */}

      <div className="images-section mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        <LightBox
          mediaUrls={mediaFiles}
          open={openLightbox}
          setOpen={setOpenLightbox}
          index={lightboxIndex}
        />
        {mediaFiles.slice(0, 3).map(({ _id, url, type }, i) => (
          <div
            className="relative h-44 bg-slate-100 rounded-md pt-[75%] border w-auto col-span-1"
            key={_id}
          >
            {type.includes('video') ? (
              <video
                onClick={() => handleLightbox(i)}
                src={url}
                className="cursor-pointer absolute top-0 bottom-0 left-0 right-0 max-w-full max-h-full h-auto block m-auto shadow-sm"
              />
            ) : (
              <img
                alt={`media-${i}`}
                src={url}
                onClick={() => handleLightbox(i)}
                className="cursor-pointer absolute top-0 bottom-0 left-0 right-0 max-w-full max-h-full h-auto block m-auto shadow-sm"
              />
            )}
            {mediaFiles.length > 3 && i === 2 && (
              <p
                onClick={() => handleLightbox(i)}
                className="absolute text-white font-semibold text-xl left-[50%] top-[50%]"
              >
                +{mediaFiles.slice(3).length}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="post-actions-section flex justify-between mt-4 items-center">
        <div className="flex gap-2 items-center">
          <Reactions
            id={_id}
            reactions={reactions}
            userReaction={userReaction}
          />
          <div
            className="flex gap-2 items-center cursor-pointer"
            // onClick={() => setShowComments((prev) => !prev)}
          >
            <Image
              src="/comments-01.svg"
              width={20}
              height={20}
              alt="profile"
            />
            <p className="font-medium text-xs text-schestiPrimaryBlack">
              {totalComments > 0 && totalComments} Comments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isPostOwner && !isAdmin && (
            <Report id={_id} refetch={() => setRefetchPost((prev) => !prev)} />
          )}
          <SharePost
            url={
              mediaFiles.length
                ? mediaFiles[0].url
                : process.env.NEXT_PUBLIC_APP_URL + `socialMedia/post/${_id}`
            }
            id={_id}
          />
        </div>
      </div>
      {showComments && (
        <Comments
          parentId={_id}
          postId={_id}
          setRefetchPost={setRefetchPost}
          setTotalComments={setTotalComments}
          isPostOwner={isPostOwner}
          isAdmin={isAdmin}
        />
      )}
      <AddComment parentId={_id} />
    </section>
  );
};

export default SinglePost;
