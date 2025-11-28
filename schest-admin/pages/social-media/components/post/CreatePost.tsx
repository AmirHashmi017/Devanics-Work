import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CloseCircleOutlined } from '@ant-design/icons';
import { IMediaFile } from './';
import { useDispatch, useSelector } from 'react-redux';
import FeelingActivityFeature from './FeelingActivity';
import { RootState } from 'src/redux/store';
import { socialMediaService } from 'src/services/social-media.service';
import {
  setFetchPosts,
  setPostData,
} from 'src/redux/social-media/social-media.slice';
import ModalComponent from 'src/components/modal';
import CustomButton from 'src/components/CustomButton/button';
import filesUrlGenerator from 'src/utils/filesUrlGenerator';
import { userService } from 'src/services/user.service';
import { useUser } from 'src/hooks/useUser';

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
  const [description, setDescription] = useState('');
  const { postData } = useSelector((state: RootState) => state.socialMedia);
  const [postOldUrls, setPostOldUrls] = useState<IMediaFile[]>([]);
  const [showFeelingActivity, setShowFeelingActivity] = useState(false);
  const [feeling, setFeeling] = useState('');

  const userAvatar =
    user?.socialAvatar || user?.avatar || '/assets/icons/profileAvatar.png';
  const fullName = user?.socialName || user?.name || '';

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
      if (mediaFilesLength || postOldUrls || description) {
        const allMediaFiles: IMediaFile[] = [];
        const payload: Partial<IPost> = {};

        if (mediaFilesLength) {
          allMediaFiles.push(...mediaFiles);
        }
        if (postOldUrls.length > 0) {
          allMediaFiles.push(...postOldUrls);
        }

        if (mediaFilesLength > 0 || postOldUrls.length > 0) {
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
      setPostOldUrls(mediaFiles);
    }
  }, [postData]);

  function resetPost() {
    setFiles([]);
    setDescription('');
    setFeeling('');
    setPostOldUrls([]);
    dispatch(setPostData(null));
  }

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
      <div className="flex items-center gap-2">
        <img src={userAvatar} className="size-9 rounded-full" alt={fullName} />
        <p className="font-medium text-graphiteGray text-sm">Create Post</p>
      </div>
      <textarea
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        rows={5}
        className="w-full placeholder:text-coolGray border border-mercury rounded-md mt-3 p-3"
        placeholder="What’s in your mind..."
      />
      {/* <ReactQuill
        value={description}
        placeholder="What’s in your mind..."
        onChange={setDescription}
        className="h-32 mt-3"
        modules={{ toolbar: false }}
      /> */}

      <div className="media-list-section mt-3 flex flex-wrap gap-2">
        {postOldUrls.map(({ url, type }, i) => (
          <div className="relative">
            <CloseCircleOutlined
              onClick={() =>
                setPostOldUrls((prev) =>
                  prev.filter((_, fileIndex) => fileIndex !== i)
                )
              }
              className="text-red-600 absolute -right-1 cursor-pointer rounded-full -top-1 bg-cloudWhite"
            />
            {type.includes('image') ? (
              <img
                className="rounded-md size-9"
                key={i}
                src={url}
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
        {files &&
          files.map((file, i) => (
            <div className="relative">
              <CloseCircleOutlined
                onClick={() =>
                  setFiles((prev) =>
                    prev.filter((_, fileIndex) => fileIndex !== i)
                  )
                }
                className="text-red-600 absolute -right-1 cursor-pointer rounded-full -top-1 bg-cloudWhite"
              />
              {file.type.includes('image') ? (
                <img
                  className="rounded-md size-[100px]"
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={'img-' + i}
                />
              ) : (
                <video
                  className="rounded-md size-[100px] object-cover"
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
            <img
              src="/assets/icons/photo-video.svg"
              className="w-4 h-3"
              alt="profile"
            />
            <p className="font-medium text-xs text-schestiPrimaryBlack">
              Photo/Video
            </p>
          </label>
          <input
            multiple
            accept="image/* , video/*"
            id="photo-video"
            className="hidden"
            type="file"
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
            <img
              src="/assets/icons/camera-02.svg"
              className="w-4 h-3"
              alt="profile"
            />
            <p className="font-medium text-xs text-schestiPrimaryBlack">
              Feeling/Activity {feeling && `is ${feeling}`}
            </p>
          </label>
        </div>
        <div className="flex gap-3">
          {postData && (
            <CustomButton
              isLoading={isFilesUploading}
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
