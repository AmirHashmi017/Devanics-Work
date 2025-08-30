import {
  IBidManagement,
  ISaveUserBid,
} from '@/app/interfaces/bid-management/bid-management.interface';
import { BidIntro } from '../../sub-contractor/components/BidIntro';
import { useState } from 'react';
import { BidDetails } from './BidDetails';
import { useQuery } from 'react-query';
import { bidManagementService } from '@/app/services/bid-management.service';
import { proposalService } from '@/app/services/proposal.service';

type Props = {
  search: string;
  tab: string;
};
export function ActiveProjects({ search, tab }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBid, setSelectedBid] = useState<IBidManagement | null>(null);
  const [selectedBidProjectDetails, setSelectedBidProjectDetails] =
    useState<any>(null);

  let currentPage = 1;

  const params = {
    page: currentPage,
    status: tab.toLowerCase(),
    limit: 10,
  };
  const fetchSavedBids = async () => {
    return bidManagementService.httpGetUserSavedBids(params);
  };

  const getProjectProposalDetails = async (bidProject: any) => {
    setIsLoading(true);
    setSelectedBidProjectDetails(null);
    try {
      setSelectedBid(bidProject as unknown as IBidManagement);

      const { data }: any =
        await proposalService.httpGetProposalDetailsByProjectId(
          bidProject.projectId?._id
        );
      if (data) {
        setIsLoading(false);
        setSelectedBidProjectDetails(data?.bidDetails);
      }
    } catch (err) {
      setIsLoading(false);
      console.log('could not get project proposal details', err);
    }
  };

  const savedBids = useQuery(['saved-bids', tab], fetchSavedBids);

  console.log({
    savedBids,
  });

  const savedUserBids: any =
    savedBids.data && savedBids.data.data ? savedBids.data.data?.savedBids : [];

  return (
    <div>
      <div className={`grid grid-cols-12 gap-4`}>
        <div className={`${selectedBid ? 'col-span-8' : 'col-span-12'}`}>
          {savedUserBids
            .filter((bidProject: any) => {
              if (!search) {
                return true;
              }
              return (
                (bidProject.projectId as IBidManagement).projectName
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                (bidProject.projectId as IBidManagement).description
                  .toLowerCase()
                  .includes(search.toLowerCase())
              );
            })
            .map((bidProject: any) => {
              return (
                <BidIntro
                  key={bidProject._id}
                  bid={bidProject as unknown as ISaveUserBid}
                  onClick={() => getProjectProposalDetails(bidProject)}
                  isSelected={selectedBid?._id === bidProject._id}
                />
              );
            })}
        </div>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : !isLoading && selectedBid && selectedBidProjectDetails ? (
          <div className="col-span-4 py-[24px] px-[17px] rounded-lg mt-3 border border-[#E9E9EA]">
            <BidDetails
              bid={selectedBid}
              selectedBidProjectDetails={selectedBidProjectDetails}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
