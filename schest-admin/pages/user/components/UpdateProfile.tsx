import { Dispatch, SetStateAction, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import filesUrlGenerator from 'src/utils/filesUrlGenerator';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import CustomButton from 'src/components/CustomButton/button';
import ModalComponent from 'src/components/modal';
import { userService } from 'src/services/user.service';
import { voidFc } from 'src/utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { setUserAction } from 'src/redux/authSlices/authSlice';

type Props = {
  name: string;
  avatar: string;
  fetchUser: voidFc;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};
const UpdateProfile = ({
  name,
  avatar,
  showModal,
  setShowModal,
  fetchUser,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileName, setProfileName] = useState(name);
  const { id } = useParams();
  const [profileAvatar, setProfileAvatar] = useState<string | File>(avatar);
  const dispatch = useDispatch();
  const authData = useSelector((state: RootState) => state.auth);

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
      const { data } = await userService.updateSocialProfile(id as string, {
        socialName: profileName,
        socialAvatar: mediaFiles[0].url,
      });
      updateUserInRedux(data);
    } else {
      const { data } = await userService.updateSocialProfile(id as string, {
        socialName: profileName,
      });
      updateUserInRedux(data);
    }
    fetchUser();
    setShowModal(false);
  }

  return (
    <ModalComponent setOpen={setShowModal} open={showModal} destroyOnClose>
      <div className="bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
        <div className="flex px-6 py-2.5 justify-between bg-mistyWhite">
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
            className="flex justify-center cursor-pointer relative max-w-16"
          >
            <img
              className="rounded-full size-14"
              src={
                !profileAvatar
                  ? '/assets/icons/profileAvatar.png'
                  : typeof profileAvatar === 'string'
                    ? avatar
                    : URL.createObjectURL(profileAvatar as File)
              }
              alt={name}
            />
            <img
              src="/assets/icons/edit-2.svg"
              className="cursor-pointer size-3.5 absolute right-5 bottom-5"
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
