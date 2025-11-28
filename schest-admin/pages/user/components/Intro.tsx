import { useCallback, useEffect, useState } from 'react';
import UpdateProfile from './UpdateProfile';
import { useNavigate, useParams } from 'react-router-dom';
import { voidFc } from 'src/utils/types';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Profile from 'src/pages/social-media/components/post/Profile';
import { useUser } from 'src/hooks/useUser';
import { IUserInterface } from 'src/interfaces/authInterfaces/user.interface';
import { userService } from 'src/services/user.service';
import Loader from 'src/components/loader';

type Props = {
  isSettings?: boolean;
  fetchPosts?: voidFc;
};
const ProfileIntro = ({ fetchPosts = () => {}, isSettings = false }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const user = useUser();
  const [userData, setUserData] = useState<IUserInterface>(
    {} as IUserInterface
  );
  const [fetchUser, setFetchUser] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const getUserDetail = useCallback(async () => {
    setIsLoading(true);
    const { data } = await userService.httpGetCompanyInfo(
      (id as string) || (user?._id as string)
    );
    setUserData(data.user);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (id || user?._id) {
      getUserDetail();
    }
  }, [id, fetchUser]);

  if (isLoading) {
    return <Loader />;
  }

  const name = userData.socialName || userData.name;
  const avatar = userData.socialAvatar || userData.avatar;

  return (
    <>
      <UpdateProfile
        name={name || ''}
        fetchUser={() => {
          setFetchUser((prev) => !prev);
          fetchPosts();
        }}
        avatar={avatar || ''}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <div className="w-full mt-3.5 shadow rounded-xl p-6 bg-white flex justify-between">
        <div className="flex gap-4 items-center">
          <ArrowLeftOutlined
            className="text-xl cursor-pointer"
            onClick={() => navigate('/social-media')}
          />
          <Profile name={name} avatar={avatar} />
        </div>

        {user?._id === id && (
          <img
            onClick={() => setShowModal(true)}
            src="/assets/icons/edit-2.svg"
            className="cursor-pointer size-5"
            alt="edit"
          />
        )}
        {isSettings && (
          <img
            onClick={() => setShowModal(true)}
            src="/assets/icons/edit-2.svg"
            className="cursor-pointer size-5"
            alt="edit"
          />
        )}
      </div>
    </>
  );
};

export default ProfileIntro;
