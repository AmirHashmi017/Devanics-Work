import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CustomButton from '@/app/component/customButton/button';
import { toast } from 'react-toastify';
import { socialMediaService } from '@/app/services/social-media.service';
import filesUrlGenerator from '@/app/utils/filesUrlGenerator';
import { CloseCircleOutlined } from '@ant-design/icons';
import { IMediaFile } from '.';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFetchPosts,
  setPostData,
} from '@/redux/social-media/social-media.slice';
import { RootState } from '@/redux/store';
import ModalComponent from '@/app/component/modal';
import FeelingActivityFeature from './FeelingActivity';
import { userService } from '@/app/services/user.service';
import { useUser } from '@/app/hooks/useUser';

type IPost = {
  mediaFiles: IMediaFile[];
  description: string;
  feeling: string;
};
const CreatePost = () => {
  const dispatch = useDispatch();
  const user = useUser();
  const [isFilesUploading, setIsFilesUploading] = useState(false);
  const [files, setFiles] = useState([] as File[]);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [description, setDescription] = useState('');
  const { postData } = useSelector((state: RootState) => state.socialMedia);
  const [postOldMediaUrls, setPostOldMediaUrls] = useState<IMediaFile[]>([]);
  const [showFeelingActivity, setShowFeelingActivity] = useState(false);
  const [feeling, setFeeling] = useState('');

  async function createPost() {
    setIsFilesUploading(true);

    const { data } = await userService.httpIsBlocked();

    if (data.isBlocked) {
      setIsFilesUploading(false);
      return toast.error('You are Blocked contact administrator');
    }
    try {
      const { mediaFiles, mediaFilesLength } = await filesUrlGenerator(files);
      if (mediaFilesLength || description) {
        const payload: Partial<IPost> = {};

        if (mediaFiles) {
          payload['mediaFiles'] = mediaFiles;
        }

        if (description) {
          payload['description'] = description;
        }

        if (feeling) {
          payload['feeling'] = feeling;
        }
        const { message } = await socialMediaService.httpCreatePost(payload);
        toast.success(message);
      } else {
        toast.error('Description or image,video is required!');
      }
    } catch (error: any) {
      console.error('Error uploading file to S3:', error);
      toast.error(error?.response?.data?.message || `Unable to upload Files`);
      setIsFilesUploading(false);
    } finally {
      dispatch(setFetchPosts());
      setFiles([]);
      setFeeling('');
      setIsFilesUploading(false);
      setDescription('');
    }
  }

  async function updatePost() {
    try {
      setIsFilesUploading(true);
      const { mediaFiles, mediaFilesLength } = await filesUrlGenerator(files);
      if (mediaFilesLength || postOldMediaUrls || description) {
        const allMediaFiles: IMediaFile[] = [];
        const payload: Partial<IPost> = {};

        if (mediaFilesLength) {
          allMediaFiles.push(...mediaFiles);
        }
        if (postOldMediaUrls.length > 0) {
          allMediaFiles.push(...postOldMediaUrls);
        }

        if (mediaFilesLength > 0 || postOldMediaUrls.length > 0) {
          payload['mediaFiles'] = allMediaFiles;
        }

        if (description) {
          payload['description'] = description;
        }

        if (feeling) {
          payload['feeling'] = feeling;
        }

        const { message } = await socialMediaService.httpUpdatePost(
          postData?._id!,
          payload
        );
        toast.success(message);
      } else {
        toast.error('Description or image,video is required!');
      }
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      toast.error(`Unable to upload Files`);
      setIsFilesUploading(false);
    } finally {
      setIsFilesUploading(false);
      dispatch(setFetchPosts());
      resetPost();
    }
  }

  useEffect(() => {
    if (postData) {
      const { description, mediaFiles } = postData;
      setDescription(description);
      setPostOldMediaUrls(mediaFiles);
    }
  }, [postData]);

  function resetPost() {
    setFiles([]);
    setDescription('');
    setFeeling('');
    setPostOldMediaUrls([]);
    dispatch(setPostData(null));
  }

  const userAvatar = user?.socialAvatar || user?.avatar || '/profileAvatar.png';
  const fullName = user?.socialName || user?.name || '';

  return (
    <div className="w-full mt-3.5 shadow rounded-xl p-6 bg-white">
      <ModalComponent
        setOpen={setShowFeelingActivity}
        open={showFeelingActivity}
      >
        <FeelingActivityFeature
          setIsModalOpen={setShowFeelingActivity}
          setFeeling={setFeeling}
        />
      </ModalComponent>
      <ModalComponent setOpen={setOpenCreatePost} open={openCreatePost}>
        <h1>Create Post</h1>
      </ModalComponent>
      <div className="flex items-center gap-2">
        <Image
          src={userAvatar}
          className="rounded-full"
          width={36}
          height={36}
          alt={fullName}
        />
        <p className="font-medium text-graphiteGray text-sm">Create Post</p>
      </div>

      <textarea
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        rows={5}
        className="w-full placeholder:text-coolGray border border-mercury rounded-md mt-3 p-3"
        placeholder="What’s in your mind..."
      />

      {/* small old image or video irls to view in create or update post*/}
      <div className="media-list-section mt-3 flex flex-wrap gap-2">
        {postOldMediaUrls.map(({ url, type }, i) => (
          <div className="relative" key={i}>
            <CloseCircleOutlined
              onClick={() =>
                setPostOldMediaUrls((prev) =>
                  prev.filter((_, fileIndex) => fileIndex !== i)
                )
              }
              className="text-red-600 absolute -right-1 cursor-pointer rounded-full -top-1 bg-cloudWhite"
            />
            {type.includes('image') ? (
              <Image
                className="rounded-md"
                key={i}
                src={url}
                height={100}
                width={100}
                alt={'img-' + i}
              />
            ) : (
              <video
                className="rounded-md size-[100px] object-cover"
                key={i}
                src={url}
              />
            )}
          </div>
        ))}

        {/* files selected from computer of images or video to view on single post */}
        {files &&
          files.map((file, i) => (
            <div className="relative" key={i}>
              <CloseCircleOutlined
                onClick={() =>
                  setFiles((prev) =>
                    prev.filter((_, fileIndex) => fileIndex !== i)
                  )
                }
                className="text-red-600 absolute -right-1 cursor-pointer rounded-full -top-1 bg-cloudWhite"
              />
              {file.type.includes('image') ? (
                <Image
                  className="rounded-md"
                  key={i}
                  src={URL.createObjectURL(file)}
                  height={100}
                  width={100}
                  alt={'img-' + i}
                />
              ) : (
                <video
                  className="rounded-md size-[200px] object-cover"
                  key={i}
                  src={URL.createObjectURL(file)}
                />
              )}
            </div>
          ))}
      </div>
      <div className="upload-media-section flex flex-wrap justify-between items-center mt-3">
        <div className="flex gap-4 items-center ">
          <label
            htmlFor="photo-video"
            className="flex items-center cursor-pointer gap-2"
          >
            <Image
              src="/photo-video.svg"
              width={16}
              height={12}
              alt="profile"
            />
            <p className="font-medium text-xs text-schestiPrimaryBlack">
              Photo/Video
            </p>
          </label>
          <input
            multiple
            id="photo-video"
            className="hidden"
            type="file"
            accept="image/* , video/*"
            onChange={({ target }) => {
              if (target.files) {
                if (target.files.length > 0) {
                  const selectedMediaFiles = Array.from(
                    target.files as FileList
                  );
                  setFiles((prev) => [
                    ...prev,
                    ...selectedMediaFiles.filter(
                      ({ type }) =>
                        type.includes('video') || type.includes('image')
                    ),
                  ]);
                }
              }
            }}
          />
          <label
            className="flex items-center cursor-pointer gap-2"
            onClick={() => setShowFeelingActivity(true)}
          >
            <Image src="/camera-02.svg" width={16} height={12} alt="profile" />
            <p className="font-normal text-xs text-schestiPrimaryBlack">
              Feeling/Activity {feeling && `is ${feeling}`}
            </p>
          </label>
        </div>
        <div className="flex gap-3 items-center">
          {postData && (
            <CustomButton
              disabled={isFilesUploading}
              onClick={resetPost}
              text={'Cancel'}
              className="max-w-16 flex justify-center bg-vividRed text-xs text-white"
            />
          )}
          <CustomButton
            isLoading={isFilesUploading}
            onClick={() => (postData ? updatePost() : createPost())}
            text={postData ? 'Update' : 'Create'}
            className="max-w-16 flex justify-center bg-lavenderPurpleReplica text-xs text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
