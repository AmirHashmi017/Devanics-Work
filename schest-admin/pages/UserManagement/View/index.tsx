import { Avatar, Segmented, Skeleton } from 'antd';

import { VscVerifiedFilled } from 'react-icons/vsc';
import { useEffect, useState } from 'react';
import { IGetUserDetail, userService } from 'src/services/user.service';
import { useSearchParams } from 'react-router-dom';
import NoData from 'src/components/noData';
import { ViewUserInfoHeader } from './components/ViewUserInfoHeader';
import { ViewUserInfo } from './components/info';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { ViewUserSubscriptions } from './components/ViewUserSubscriptions';
import { ViewUserDocuments } from './components/ViewUserDocuments';
import { ViewUserTrades } from './components/ViewUserTrades';

const SUBSCRIPTIONS = 'Subscriptions';
const DOCUMENTS = 'Documents';
const TRADES = 'Trades';

export function UserManagementViewUserDetails() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IGetUserDetail | null>(null);
  const [activeSegmenet, setActiveSegment] = useState('Documents');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      getUserDetail(id);
    }
  }, [searchParams]);

  async function getUserDetail(id: string) {
    setLoading(true);
    try {
      const response = await userService.httpGetUserById({
        id,
      });
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.log('Error while fetching user detail');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (!data) {
    return <NoData title="User" description="No User Found" btnText="Back" />;
  }

  function getUserOptions(role: USER_ROLE_ENUM) {
    let options: string[] = [];
    if (role === USER_ROLE_ENUM.OWNER) {
      options = [SUBSCRIPTIONS];
    } else if (
      role === USER_ROLE_ENUM.CONTRACTOR ||
      role === USER_ROLE_ENUM.PROFESSOR ||
      role === USER_ROLE_ENUM.STUDENT
    ) {
      options = [DOCUMENTS, SUBSCRIPTIONS];
    } else if (
      role === USER_ROLE_ENUM.SUBCONTRACTOR ||
      role === USER_ROLE_ENUM.ARCHITECT ||
      role === USER_ROLE_ENUM.VENDOR
    ) {
      options = [DOCUMENTS, TRADES, SUBSCRIPTIONS];
    }
    return options;
  }

  return (
    <section className="mt-6 mb-[39px] mx-4 rounded-xl bg-white shadow-xl">
      <div
        style={{
          background: `linear-gradient(129.19deg, #007AB6 38.38%, #FFC107 141.8%)`,
        }}
        className="h-[100px] rounded-xl relative"
      >
        <div className="absolute -bottom-16 border rounded-full z-10 left-2">
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            className="bg-white text-schestiPrimaryBlack relative"
            src={data.companyLogo || data.avatar || undefined}
          >
            {data.name.charAt(0)}
          </Avatar>
          <div className="absolute w-fit text-3xl  -bottom-1 -right-1 rounded-full  z-20">
            <VscVerifiedFilled
              style={{
                color: data.verification ? '#36B37E' : '#B0D6E8',
              }}
            />
          </div>
        </div>
      </div>

      <ViewUserInfoHeader
        data={data}
        onUpdate={(updatedUser) => {
          setData({
            ...data,
            ...updatedUser,
          });
        }}
      />

      <ViewUserInfo data={data} />

      <div className="p-5 space-y-2">
        <Segmented
          options={getUserOptions(data.userRole as USER_ROLE_ENUM)}
          size="large"
          value={activeSegmenet}
          onChange={(value) => setActiveSegment(value)}
        />

        {activeSegmenet === SUBSCRIPTIONS ? (
          <ViewUserSubscriptions data={data} />
        ) : activeSegmenet === DOCUMENTS ? (
          <ViewUserDocuments data={data} />
        ) : activeSegmenet === TRADES ? (
          <ViewUserTrades data={data} />
        ) : null}
      </div>
    </section>
  );
}
