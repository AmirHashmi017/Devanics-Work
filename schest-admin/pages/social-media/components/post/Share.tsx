import { useState } from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import { toast } from 'react-toastify';
import ModalComponent from 'src/components/modal';
import useApiMutation from 'src/hooks/useApiMutation';
import { useCopyToClipboard } from 'usehooks-ts';

const SharePost = ({ url, id }: { url: string; id: string }) => {
  const [showModal, setShowModal] = useState(false);
  const [, copyFn] = useCopyToClipboard();

  const { mutate } = useApiMutation();

  const updateSocialMediaShare = () => {
    console.log('in update post shre...');
    mutate({
      method: 'post',
      url:
        process.env.REACT_APP_BACKEND_BASE_URL +
        `/api/social-media/postShare/${id}`,
    });
  };

  return (
    <>
      <ModalComponent
        destroyOnClose
        width="500px"
        open={showModal}
        setOpen={setShowModal}
      >
        <div className="bg-white px-6 py-4 rounded-lg">
          <div className="flex items-center justify-between ">
            <p className="text-graphiteGray text-lg font-bold">Share Post </p>
            <img
              src="assets/icons/closeicon.svg"
              alt="close"
              className="cursor-pointer size-6"
              onClick={() => setShowModal(false)}
            />
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <FacebookShareButton
              url={url}
              className="flex gap-2 items-center"
              onClick={updateSocialMediaShare}
            >
              <FacebookIcon className="rounded-full size-7" />
              <p className="text-graphiteGray font-semibold text-md">
                Facebook
              </p>
            </FacebookShareButton>

            <TwitterShareButton
              url={url}
              className="flex gap-2 items-center"
              onClick={updateSocialMediaShare}
            >
              <TwitterIcon className="rounded-full size-7" />
              <p className="text-graphiteGray font-semibold text-md">X</p>
            </TwitterShareButton>

            <LinkedinShareButton
              url={url}
              className="flex gap-2 items-center"
              onClick={updateSocialMediaShare}
            >
              <LinkedinIcon className="rounded-full size-7" />
              <p className="text-graphiteGray font-semibold text-md">
                Linkedin
              </p>
            </LinkedinShareButton>
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => {
                const postUrl =
                  process.env.REACT_APP_BACKEND_BASE_URL +
                  `/social-media/post/${id}`;
                copyFn(postUrl);
                toast.success('Copied', {
                  position: 'bottom-left',
                  hideProgressBar: true,
                });
              }}
            >
              <img
                src="assets/icons/link.svg"
                alt="close"
                className="cursor-pointer size-6"
                onClick={() => setShowModal(false)}
              />
              <p className="text-graphiteGray font-semibold text-md">
                Copy link
              </p>
            </div>
          </div>
        </div>
      </ModalComponent>
      <div
        className="flex gap-1 items-center cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <img
          src="/assets/icons/share-07.svg"
          className="size-5"
          alt="profile"
        />
        <p className="font-medium text-xs text-schestiPrimaryBlack">Share</p>
      </div>
    </>
  );
};

export default SharePost;
