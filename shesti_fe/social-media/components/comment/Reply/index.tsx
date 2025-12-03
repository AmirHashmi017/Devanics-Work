import Image from 'next/image';
import React from 'react';
import { ICommentProps } from '../SingleComment';
import moment from 'moment';
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '@/redux/store'
// import { socialMediaService } from '@/app/services/social-media.service'
// import { setFetchComments } from '@/redux/social-media/social-media.slice'

const ReplyComent = ({
  content,
  updatedAt,
  associatedCompany,
}: ICommentProps) => {
  // const { user } = useSelector((state: RootState) => state.auth.user);
  // const dispatch = useDispatch();

  // const deletePostCommentHandler = async () => {
  //     try {
  //         await socialMediaService.httpDeletePostComment(_id);
  //         dispatch(setFetchComments());
  //     } catch (error) {
  //         console.log(error);
  //     }
  // }

  return (
    <>
      <div className="flex gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/profileAvatar.png"
            width={36}
            height={36}
            alt="profile"
          />
          <div>
            <p className="font-bold text-xs text-graphiteGray">
              {associatedCompany.name}
            </p>
            <p className="mt-1.5 text-coolGray text-[10px]">
              {moment(updatedAt).fromNow()}
            </p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-stormGrey">{content}</p>
    </>
  );
};

export default ReplyComent;
