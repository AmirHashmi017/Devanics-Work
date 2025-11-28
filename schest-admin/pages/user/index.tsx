import { useCallback, useEffect, useState } from 'react';
import Intro from './components/Intro';
import UserPosts from '../social-media/components/post/UserPosts';
import { useParams } from 'react-router-dom';
import { IUserInterface } from 'src/interfaces/authInterfaces/user.interface';
import { userService } from 'src/services/user.service';
import SkeletonLoader from 'src/components/loader/Skeleton';

const UserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState<IUserInterface>(
    {} as IUserInterface
  );
  const [fetchUser, setFetchUser] = useState(false);
  const [fetchPosts, setFetchPosts] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const getUserDetail = useCallback(async () => {
    setIsLoading(true);
    const { data } = await userService.httpGetCompanyInfo(id as string);
    setUserData(data.user);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (id) {
      getUserDetail();
    }
  }, [id, fetchUser]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <section className="my-4 mx-8 px-4 gap-6">
      <h6 className="text-lg font-semibold text-graphiteGray">User Profile</h6>
      <Intro fetchPosts={() => setFetchPosts((prev) => !prev)} />
      <UserPosts refetchPosts={fetchPosts} />
    </section>
  );
};

export default UserProfile;
