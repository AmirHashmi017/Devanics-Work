import React, { useEffect, useState } from 'react';
import Search from '../Search';
import { Pagination } from 'antd';
import SingleUserCard from '../SingleUserCard';
import NoData from '../NoData';
import { useSelector } from 'react-redux';
import { networkingService } from '@/app/services/networking.service';
import { NetworkSearchTypes } from '../../page';
import SkeletonLoader from '@/app/component/loader/Skeleton';
const lodash = require('lodash');

type Props = {
  userRole: string;
};

type IMyNetwork = {
  connections: null | [];
};

const Layout = ({ userRole }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<unknown>('');
  const [searchText, setSearchText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [myNetworkUsers, setMyNetworkUsers] = useState<IMyNetwork>({
    connections: null,
  });
  const { myNetwork } = useSelector((state: any) => state.network);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0,
  });
  const {
    selectedStates,
    selectedTrades,
  }: {
    selectedStates: string[];
    selectedTrades: string[];
  } = useSelector((state: any) => state.network);

  const getMyNetworkUsers = async () => {
    const { data } = await networkingService.httpGetMyNetworkUsers({
      userRole,
      searchText,
      locationText,
      page: filters.page - 1,
      limit: filters.limit,
    });
    const { user, totalPages, totalRecords } = data;
    setFilters({ ...filters, totalRecords, totalPages });
    setMyNetworkUsers(user);
  };
  useEffect(() => {
    let debounce_fun = lodash.debounce(function () {
      try {
        setIsLoading(true);
        getMyNetworkUsers();
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(error);
      }
    }, 500);
    debounce_fun();
  }, [
    userRole,
    myNetwork,
    searchText,
    locationText,
    filters.page,
    selectedStates,
    selectedTrades,
  ]);

  return (
    <div>
      <Search
        searchValuesHandler={({
          searchText,
          locationText,
        }: NetworkSearchTypes) => {
          setSearchText(searchText);
          setLocationText(locationText);
        }}
      />
      {!myNetworkUsers.connections || isLoading ? (
        <SkeletonLoader />
      ) : myNetworkUsers.connections.length > 0 ? (
        <div>
          <div className="grid grid-cols-3 gap-4">
            {myNetworkUsers.connections.map((userData: any, i: number) => (
              <SingleUserCard key={i} {...userData} myNetwork />
            ))}
          </div>
          <div className="mt-1 flex justify-center">
            <Pagination
              current={filters.page}
              pageSize={filters.limit}
              showPrevNextJumpers={false}
              total={filters.totalRecords}
              onChange={(page) => {
                setFilters({ ...filters, page });
              }}
            />
          </div>
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default Layout;
