import { Pagination, Skeleton, Tabs } from 'antd';
import Search from '../Invited/Search';

import { useEffect, useState } from 'react';
import { USER_ROLES_ENUM } from '@/app/constants/constant';

import NoData from '../NoData';
import { IPublicNetworkingMember } from '@/app/interfaces/public-networking.interface';
import publicNetworkService from '@/app/services/public-network.service';
import { MemberCard } from './MemberCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export function PublicNetwork() {
  const [activeKey, setActiveKey] = useState(USER_ROLES_ENUM.CONTRACTOR);
  const [isLoading, setIsLoading] = useState(false);
  const networkingState = useSelector((state: RootState) => state.network);

  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 10,
  });
  const [members, setMembers] = useState<{
    total: number;
    data: IPublicNetworkingMember[];
  }>({
    total: 0,
    data: [],
  });

  useEffect(() => {
    getMembers();
  }, [filters, activeKey, networkingState.selectedCountry, networkingState.selectedStates, networkingState.selectedTrades]);

  async function getMembers() {
    setIsLoading(true);
    try {
      const response = await publicNetworkService.httpGetMembers({
        ...filters,
        role: activeKey,
        country: networkingState.selectedCountry,
        states: networkingState.selectedStates,
        trades: networkingState.selectedTrades,
      });
      if (response.data) {
        setMembers(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="my-5">
      <Tabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
        }}
        destroyInactiveTabPane
        className="text-slateGray text-sm"
        items={[
          {
            key: USER_ROLES_ENUM.CONTRACTOR,
            label: 'Contractor',
          },
          {
            key: USER_ROLES_ENUM.SUBCONTRACTOR,
            label: 'Sub-contractor',
          },
          {
            key: USER_ROLES_ENUM.PROFESSOR,
            label: 'Professor',
          },
          {
            key: USER_ROLES_ENUM.STUDENT,
            label: 'Student',
          },
          {
            key: USER_ROLES_ENUM.VENDOR,
            label: 'Vendor',
          },
          {
            label: 'Architect',
            key: USER_ROLES_ENUM.ARCHITECT,
          },
          {
            key: USER_ROLES_ENUM.OWNER,
            label: 'Owner/Client',
          },
        ]}
      />
      <Search
        searchValuesHandler={(values) => {
          setFilters({
            ...filters,
            search: values.searchText,
          });
        }}
      />

      {isLoading ? (
        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : members.data.length === 0 ? (
        <NoData />
      ) : (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {members.data.map((member, index) => (
              <MemberCard key={index} item={member} />
            ))}
          </div>

          <div className="flex justify-center">
            <Pagination
              total={members.total}
              onChange={(page) => {
                setFilters({
                  ...filters,
                  page,
                });
              }}
              current={filters.page}
            />
          </div>
        </div>
      )}
    </div>
  );
}
