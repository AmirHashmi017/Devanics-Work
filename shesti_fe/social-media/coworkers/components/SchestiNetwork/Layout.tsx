import React, { useEffect, useState } from 'react';
import Search from '../Search';
import { Pagination, Spin } from 'antd';
import SingleUserCard from '../SingleUserCard';
import NoData from '../NoData';
import { useSelector } from 'react-redux';
import { networkingService } from '@/app/services/networking.service';
import { NetworkSearchTypes } from '../../page';
import { IUserInterface } from '@/app/interfaces/user.interface';
const { debounce } = require('lodash');

type Props = {
  userRole: string;
};

const Layout = ({ userRole }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [schestiUsers, setSchestiUsers] = useState<[] | null>(null);
  const [searchText, setSearchText] = useState('');
  const [locationText, setLocationText] = useState('');
  const { schestiNetwork } = useSelector((state: any) => state.network);
  const {
    selectedStates,
    selectedTrades,
  }: {
    selectedStates: string[];
    selectedTrades: string[];
  } = useSelector((state: any) => state.network);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0,
  });

  const getSchestiUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await networkingService.httpGetSchestiUsers({
        userRole,
        page: filters.page - 1,
        limit: filters.limit,
        searchText,
        locationText,
        selectedTrades: selectedTrades.join(','),
        selectedStates: selectedStates.join(','),
      });

      const { users, totalPages, totalRecords } = data;

      setSchestiUsers(users);

      setFilters((prev) => ({ ...prev, totalPages, totalRecords }));
    } catch (error) {
      console.log(error, 'Error at getSchestiUsers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    debounce(getSchestiUsers, 500)();
  }, [
    userRole,
    schestiNetwork,
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
      {!schestiUsers || isLoading ? (
        <div className="flex justify-center py-6">
          <Spin size="default" style={{ color: '#007ab6' }} />
        </div>
      ) : schestiUsers.length > 0 ? (
        <div>
          <div className="grid grid-cols-3 gap-4">
            {schestiUsers.map((userData: IUserInterface, i: number) => (
              <SingleUserCard key={i} {...userData} />
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
