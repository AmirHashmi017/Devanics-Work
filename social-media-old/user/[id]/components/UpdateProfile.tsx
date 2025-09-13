import React, { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import ModalComponent from '@/app/component/modal';
import CustomButton from '@/app/component/customButton/button';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { CloseOutlined } from '@ant-design/icons';
import { userService } from '@/app/services/user.service';
import filesUrlGenerator from '@/app/utils/filesUrlGenerator';
import { useParams } from 'next/navigation';
import { voidFc } from '@/app/utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { setUserAction } from '@/redux/authSlices/authSlice';
import { RootState } from '@/redux/store';

type Props = {
  name: string;
  avatar: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  fetchUser: voidFc;
};
const UpdateProfile = ({
  name,
  avatar,
  showModal,
  setShowModal,
  fetchUser,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const authData = useSelector((state: RootState) => state.auth);
  const [profileName, setProfileName] = useState(name);
  const { id } = useParams();
  const [profileAvatar, setProfileAvatar] = useState<string | File>(avatar);

  const updateUserInRedux = (data: any) => {
    dispatch(
      dispatch(
        setUserAction({ ...authData, user: { ...authData.user, ...data.user } })
      )
    );
    setIsLoading(false);
  };

  async function updateProfileHandler() {
    setIsLoading(true);
    if (typeof profileAvatar === 'object') {
      const { mediaFiles } = await filesUrlGenerator([profileAvatar]);
      const { data } = await userService.updateSocialProfile(id, {
        socialName: profileName,
        socialAvatar: mediaFiles[0].url,
      });
      updateUserInRedux(data);
    } else {
      const { data } = await userService.updateSocialProfile(id, {
        socialName: profileName,
      });
      updateUserInRedux(data);
    }
    setShowModal(false);
    fetchUser();
  }

  return (
    <ModalComponent setOpen={setShowModal} open={showModal} destroyOnClose>
      <div className="bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
        <div className="flex px-6 py-2.5 justify-between border-b pb-3">
          <TertiaryHeading
            title="Update Profile"
            className="text-graphiteGray"
          />
          <CloseOutlined
            className="cursor-pointer"
            style={{ fontSize: '24px', height: '24px' }}
            onClick={() => setShowModal(false)}
          />
        </div>

        <div className="px-6 py-3 flex items-center flex-col gap-4">
          <label
            htmlFor="avatar"
            className="flex justify-center cursor-pointer max-w-16 relative"
          >
            <Image
              className="rounded-full border border-slate-700"
              width={60}
              height={60}
              src={
                !profileAvatar
                  ? '/profileAvatar.png'
                  : typeof profileAvatar === 'string'
                    ? profileAvatar
                    : URL.createObjectURL(profileAvatar as File)
              }
              alt={name}
            />
            <Image
              width={16}
              height={16}
              src="/edit.svg"
              className="cursor-pointer absolute right-3 bottom-3.5"
              alt="edit"
            />
          </label>
          <input
            className="hidden"
            id="avatar"
            type="file"
            onChange={({ target }) => {
              if (target.files) {
                setProfileAvatar(target.files[0]);
              }
            }}
          />
          <input
            type="text"
            className="w-full border !rounded-lg focus:border-blue-500 !px-3.5 !py-2.5 !mt-1.5  p-3"
            placeholder="Enter Name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
          <div className="flex justify-center">
            <CustomButton
              text="Update"
              className="w-40"
              isLoading={isLoading}
              onClick={updateProfileHandler}
            />
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default UpdateProfile;
