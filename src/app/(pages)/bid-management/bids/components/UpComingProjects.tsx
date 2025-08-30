import { useState } from 'react';
import {
  IBidManagement,
  ISaveUserBid,
} from '@/app/interfaces/bid-management/bid-management.interface';
import { BidIntro } from '../../sub-contractor/components/BidIntro';
import { useQuery } from 'react-query';
import { bidManagementService } from '@/app/services/bid-management.service';
import { BiddingProjectDetails } from './BiddingProjectDetails';
import { createProjectActivity } from '../../utils';

type Props = {
  search: string;
  tab: string;
};
export function UpComingProjects({ search, tab }: Props) {
  const [selectedBid, setSelectedBid] = useState<ISaveUserBid | null>(null);

  let currentPage = 1;

  const params = {
    page: currentPage,
    status: tab.toLowerCase(),
    limit: 10,
  };
  const fetchSavedBids = async () => {
    return bidManagementService.httpGetUserSavedBids(params);
  };

  const savedBids = useQuery(['saved-bids', tab], fetchSavedBids);
  const refetchSavedBids = () => {
    savedBids.refetch();
  };
  const savedUserBids: any =
    savedBids.data && savedBids.data.data ? savedBids.data.data?.savedBids : [];

  return (
    <div>
      <div className={`grid grid-cols-12 gap-4`}>
        <div className={`${selectedBid ? 'col-span-8' : 'col-span-12'}`}>
          {savedUserBids
            .filter((userBid: any) => {
              if (!search) return true;
              return (
                (userBid?.projectId as IBidManagement).projectName
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                (userBid?.projectId as IBidManagement).description
                  .toLowerCase()
                  .includes(search.toLowerCase())
              );
            })
            .map((bidProject: any) => {
              return (
                <BidIntro
                  key={bidProject._id}
                  bid={bidProject}
                  onClick={async () => {
                    setSelectedBid(bidProject);
                    await createProjectActivity(bidProject._id, 'clicked');
                  }}
                  isSelected={selectedBid?._id === bidProject._id}
                />
              );
            })}
        </div>
        {selectedBid ? (
          <div className="col-span-4 py-[24px] px-[17px] rounded-lg mt-3 border border-[#E9E9EA]">
            <BiddingProjectDetails
              refetchSavedBids={refetchSavedBids}
              setSelectedBid={setSelectedBid}
              bid={selectedBid}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
