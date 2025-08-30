import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import UpdateProfile from './UpdateProfile';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/app/hooks/useUser';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { userService } from '@/app/services/user.service';
import Loader from '@/app/component/loader';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ProfileAvatar from '@/app/(pages)/social-media-old/components/post/Profile';
import { voidFc } from '@/app/utils/types';

type Props = {
  isSettings?: boolean;
  fetchPosts?: voidFc;
};
const ProfileIntro = ({ isSettings, fetchPosts = () => { } }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const user = useUser();
  const [userData, setUserData] = useState<IUserInterface>(
    {} as IUserInterface
  );
  const [fetchUser, setFetchUser] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const getUserDetail = async (id: string) => {
    setIsLoading(true);
    const { data } = await userService.httpGetCompanyInfo(id);
    setUserData(data.user);
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      getUserDetail(id);
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
        name={name}
        avatar={avatar}
        showModal={showModal}
        setShowModal={setShowModal}
        fetchUser={() => {
          setFetchUser((prev) => !prev);
          fetchPosts();
        }}
      />
      <div className="w-full mt-3.5 shadow rounded-xl p-6 bg-white flex justify-between">
        <div className="flex gap-4 items-center">
          {!isSettings && (
            <ArrowLeftOutlined
              className="text-xl cursor-pointer"
              onClick={() => router.push('/social-media')}
            />
          )}

          <ProfileAvatar avatar={avatar} name={name} />
        </div>
        {user?._id === id && (
          <Image
            onClick={() => setShowModal(true)}
            width={20}
            height={20}
            src="/edit.svg"
            className="cursor-pointer"
            alt="edit"
          />
        )}

        {isSettings && (
          <Image
            onClick={() => setShowModal(true)}
            width={20}
            height={20}
            src="/edit.svg"
            className="cursor-pointer"
            alt="edit"
          />
        )}
      </div>
    </>
  );
};

export default ProfileIntro;
