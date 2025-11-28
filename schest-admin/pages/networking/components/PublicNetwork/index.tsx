import { Pagination, Skeleton, Tabs } from 'antd';
import Search from '../Invited/Search';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { useEffect, useState } from 'react';
import { IPublicNetworkingMember } from 'src/interfaces/networking.interface';
import publicNetworkService from 'src/services/public-network.service';
import NoData from '../NoData';
import { MemberCard } from './MemberCard';

export function PublicNetwork() {
  const [activeKey, setActiveKey] = useState(USER_ROLE_ENUM.CONTRACTOR);
  const [isLoading, setIsLoading] = useState(false);

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
  }, [filters, activeKey]);

  async function getMembers() {
    setIsLoading(true);
    try {
      const response = await publicNetworkService.httpGetMembers({
        ...filters,
        role: activeKey,
      });
      if (response.data) {
        setMembers(response.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key as USER_ROLE_ENUM);
        }}
        destroyInactiveTabPane
        className="text-slateGray text-sm"
        items={[
          {
            key: USER_ROLE_ENUM.CONTRACTOR,
            label: 'Contractor',
          },
          {
            key: USER_ROLE_ENUM.SUBCONTRACTOR,
            label: 'Sub-contractor',
          },
          {
            key: USER_ROLE_ENUM.PROFESSOR,
            label: 'Professor',
          },
          {
            key: USER_ROLE_ENUM.STUDENT,
            label: 'Student',
          },
          {
            key: USER_ROLE_ENUM.VENDOR,
            label: 'Vendor',
          },
          {
            label: 'Architect',
            key: USER_ROLE_ENUM.ARCHITECT,
          },
          {
            key: USER_ROLE_ENUM.OWNER,
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
