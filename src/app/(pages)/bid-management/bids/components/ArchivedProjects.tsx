import {
  IBidManagement,
  ISaveUserBid,
} from '@/app/interfaces/bid-management/bid-management.interface';
import { useState } from 'react';
import { BidIntro } from '../../sub-contractor/components/BidIntro';
import { BidDetails } from './BidDetails';
import { bidManagementService } from '@/app/services/bid-management.service';
import { useQuery } from 'react-query';
import { proposalService } from '@/app/services/proposal.service';
import { BiddingProjectDetails } from './BiddingProjectDetails';

type Props = {
  search: string;
  tab: string;
};

type ArchiveType = 'active' | 'invited' | 'upcoming';
export function ArchivedProjects({ search, tab }: Props) {
  const [selectedBid, setSelectedBid] = useState<ISaveUserBid | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBidProjectDetails, setSelectedBidProjectDetails] =
    useState<any>(null);
  const [activeTab, setActiveTab] = useState<ArchiveType>('active');

  let currentPage = 1;
  const params = {
    page: currentPage,
    status: tab.toLowerCase(),
    limit: 10,
  };

  const isArchiveProposalType = selectedBid?.archiveType === 'active';

  const getProjectProposalDetails = async (bidProject: any) => {
    setIsLoading(true);
    setSelectedBidProjectDetails(null);
    try {
      setSelectedBid(bidProject);

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
  const fetchSavedBids = async () => {
    return bidManagementService.httpGetUserSavedBids(params);
  };

  const savedBids = useQuery(['saved-bids', tab], fetchSavedBids);

  const savedUserBids =
    savedBids.data && savedBids.data.data ? savedBids.data.data?.savedBids : [];

  function handleClickTab(tab: ArchiveType) {
    setActiveTab(tab);
    setSelectedBid(null);
  }

  return (
    <div>
      <div className="my-2 flex items-center gap-2.5">
        <Segment
          isActive={activeTab === 'active'}
          text="Previously Active"
          onClick={() => handleClickTab('active')}
        />

        <Segment
          isActive={activeTab === 'upcoming'}
          text="Previously Upcoming"
          onClick={() => handleClickTab('upcoming')}
        />

        <Segment
          isActive={activeTab === 'invited'}
          text="Previously Invited"
          onClick={() => handleClickTab('invited')}
        />
      </div>

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
            .filter((savedBid) => {
              return savedBid.archiveType === activeTab;
            })
            .map((bidProject: any) => {
              return (
                <BidIntro
                  key={bidProject._id}
                  bid={bidProject}
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
            {isArchiveProposalType ? (
              <BidDetails
                bid={selectedBid}
                selectedBidProjectDetails={selectedBidProjectDetails}
              />
            ) : (
              <BiddingProjectDetails
                bid={selectedBid}
                refetchSavedBids={() => {}}
                setSelectedBid={setSelectedBid}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type SegmentProps = React.ComponentProps<'div'> & {
  text: string;
  isActive: boolean;
};
function Segment({ isActive, text, ...props }: SegmentProps) {
  return (
    <div
      {...props}
      className={`py-1 px-2.5 border ${isActive ? 'bg-schestiLightPrimary border-schestiLightPrimary text-[#475467]' : 'bg-white text-[#98A2B3]  border-[#D0D5DD]'}  font-normal text-[14px] leading-5 rounded-full cursor-pointer hover:bg-schestiLightPrimary hover:text-[#475467] hover:border-schestiLightPrimary`}
    >
      {text}
    </div>
  );
}
