import React, { useEffect, useState } from 'react';
import Search from './Search';
import InvitedCard from './SingleCard';
import NoData from '../NoData';
import { useSelector } from 'react-redux';
import { networkingService } from '@/app/services/networking.service';
import { InvitedSearchTypes } from './Search';
import Loader from '@/app/component/loader';

const InvitedClients = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [invitedUsers, setinvitedUsers] = useState({ invited: [] });
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0,
  });

  const { invited } = useSelector((state: any) => state.network);
  const getInvitedUsers = async () => {
    const { data } = await networkingService.httpGetInvitedClients({
      searchText,
      page: filters.page - 1,
      limit: filters.limit,
    });
    const { user, totalPages, totalRecords } = data;
    setFilters({ ...filters, totalRecords, totalPages });
    setinvitedUsers(user);
  };
  useEffect(() => {
    try {
      setIsLoading(true);
      getInvitedUsers();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [invited, searchText, filters.page]);

  return (
    <div>
      <Search
        searchValuesHandler={({ searchText }: InvitedSearchTypes) => {
          setSearchText(searchText);
        }}
      />
      {isLoading ? (
        <Loader />
      ) : invitedUsers.invited.length ? (
        <div className="grid grid-cols-3 gap-4 mt-3.5">
          {invitedUsers.invited.map((userData: any, i: number) => (
            <div className="col-span-1" key={i}>
              <InvitedCard {...userData} />
            </div>
          ))}
        </div>
      ) : (
        <NoData />
      )}
      {/* {
                filters.totalPages > 0 && (
                    <div className="mt-1 flex justify-center">
                        <Pagination
                            current={filters.page}
                            pageSize={filters.limit}
                            showPrevNextJumpers={false}
                            total={filters.totalRecords}
                            onChange={(page) => {
                                setFilters({ ...filters, page })
                            }
                            }
                        />
                    </div>
                )
            } */}
    </div>
  );
};

export default InvitedClients;
