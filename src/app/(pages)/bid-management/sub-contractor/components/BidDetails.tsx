import React, { useEffect, useState } from 'react';
import CustomButton from '@/app/component/customButton/button';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import {
  IBidManagement,
  ISaveUserBid,
  ISubmittedProjectBid,
} from '@/app/interfaces/bid-management/bid-management.interface';
import { Routes } from '@/app/utils/plans.utils';
import { Avatar, Divider } from 'antd';
import { Country } from 'country-state-city';
import moment from 'moment';
import Image from 'next/image';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { bidManagementService } from '@/app/services/bid-management.service';
import { CreateRFI } from './CreateRFI';
import { isEmpty, size } from 'lodash';
import { SendEmailModal } from './SendEamil';
import { downloadFile } from '@/app/utils/downloadFile';
import { proposalService } from '@/app/services/proposal.service';
import {
  WhatsappIcon,
  WhatsappShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { createProjectActivity } from '../../utils';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type Props = {
  bid: IBidManagement & { userDetails: IUserInterface[] };
  selectedProjectSavedBid?: ISaveUserBid;
  setSelectedProjectSavedBid?: any;
  bidClickHandler?: any;
  onBidRemove?: () => void;
  isInvitation?: boolean;
  onSuccessfullyDecline?: (_data: {
    project: IBidManagement;
    savedUserBid?: ISaveUserBid;
  }) => void;
};
type RemoveUserBidProps = {
  biddingId: string;
};

type SaveUserBidProps = {
  projectId: string;
  isFavourite?: boolean;
};
export function BidDetails({
  bid,
  bidClickHandler,
  selectedProjectSavedBid,
  setSelectedProjectSavedBid,
  onBidRemove,
  onSuccessfullyDecline,
  isInvitation = false,
}: Props) {
  const router = useRouterHook();
  const [isDeclining, setIsDeclining] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [bidSubmittedDetails, setBidSubmittedDetails] = useState<
    ISubmittedProjectBid[]
  >([]);
  const authUser = useSelector(
    (state: RootState) => state.auth.user as { user?: IUserInterface }
  );
  const currency = useCurrencyFormatter({ currency: bid?.currency });
  const saveUserBidMutation = useMutation<
    IResponseInterface<{ projectId: ISaveUserBid }>,
    AxiosError<{ message: string }>,
    SaveUserBidProps
  >({
    //@ts-ignore
    mutationKey: 'saveUserBid',
    mutationFn: (values: SaveUserBidProps) => {
      return bidManagementService.httpSaveUserProjectBid(values);
    },
    async onSuccess(res: any) {
      console.log('res', res);
      if (res.data && res.data.savedUserBid) {
        toast.success('Bid Saved Successfully');
      }

      if (bid) {
        await createProjectActivity(bid._id, 'favourite');
      }
    },
    onError(error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('An error occurred while saving the bid.');
      }
    },
  });

  const removeUserBidMutation = useMutation<
    IResponseInterface<{ biddingId: RemoveUserBidProps }>,
    AxiosError<{ message: string }>,
    RemoveUserBidProps
  >({
    //@ts-ignore
    mutationKey: 'saveUserBid',
    mutationFn: async (values: RemoveUserBidProps) => {
      return bidManagementService.httpRemoveUserProjectBid(values.biddingId);
    },
    async onSuccess(res: any) {
      console.log('res', res);
      if (res.data && res.data) {
        toast.success('Bid removed Successfully');
        setSelectedProjectSavedBid(null);
        if (bid) {
          await createProjectActivity(bid._id, 'removed favourite');
        }
      }
    },
    onError(error: any) {
      console.log('error', error);
      if (error.response?.data?.message) {
        toast.error(error.response?.data.message);
      }
    },
  });

  useEffect(() => {
    if (!isEmpty(bid?._id)) {
      getProjectProposalDetails(bid?._id);
    }
  }, [bid?._id]);

  const getProjectProposalDetails = async (bidProjectId: any) => {
    setIsDetailsLoading(true);
    setBidSubmittedDetails([]);
    try {
      const { data }: any =
        await proposalService.httpGetProposalDetailsByProjectId(bidProjectId);
      if (data && data.bidDetails) {
        setIsDetailsLoading(false);
        setBidSubmittedDetails(data?.bidDetails);
      }
    } catch (err) {
      setIsDetailsLoading(false);
      console.log('could not get project proposal details', err);
    }
  };

  async function handleDeclineInvitation(projectId: string) {
    // create project activity for invitation decline
    // createProjectActivity(projectId, 'declined invitation');
    setIsDeclining(true);
    try {
      const response =
        await bidManagementService.httpDeclineProjectInvitation(projectId);
      if (response.data) {
        toast.success('Invitation declined successfully');
        createProjectActivity(projectId, 'decline');
        if (onSuccessfullyDecline) {
          onSuccessfullyDecline({
            project: bid,
            savedUserBid: selectedProjectSavedBid,
          });
          setSelectedProjectSavedBid(response.data.userSavedBid);
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data.message;
      if (msg) {
        toast.error(msg);
      }
    } finally {
      setIsDeclining(false);
    }
  }

  const downloadAllFiles = async (files: any[]) => {
    files.forEach(async (file: any) => {
      await downloadFile(file.url, file.name);
    });
  };

  const handleProposalDetails = async (bidId: string) => {
    await createProjectActivity(bidId, 'viewed details');
    router.push(`/bid-management/details/${bidId}`);
  };

  // social media share click handler
  async function handleSocialMediaClick(
    projectId: string,
    socialMediaType: 'whatsapp' | 'facebook' | 'twitter'
  ) {
    // create project activity for social media share
    await createProjectActivity(projectId, `shared on ${socialMediaType}`);
  }

  // either projectOwner or projectCreator will be available and will be used by EmailSendModal component
  const projectOwner =
    bid.userDetails && bid.userDetails?.length > 0 && bid.userDetails[0].email;
  const projectCreator = typeof bid.user !== 'string' && bid.user.email;
  const isAuthUserBidSubmitter =
    bidSubmittedDetails.length > 0 &&
    bidSubmittedDetails.some((bid) => bid.user === authUser?.user?._id);

  // if selectedProjectSavedBid has archiveType then no need to show the user action button
  const isSelectedProjectSavedBidHasArchiveType =
    selectedProjectSavedBid &&
    selectedProjectSavedBid.archiveType &&
    selectedProjectSavedBid.archiveType.length > 0;

  return (
    <div>
      <div className="flex justify-end mb-1">
        <Image
          alt="close icon"
          src={'/closeicon.svg'}
          width={16}
          height={16}
          onClick={() => {
            if (onBidRemove) {
              onBidRemove();
            }
          }}
          className="cursor-pointer"
        />
      </div>
      {isAuthUserBidSubmitter && !isDetailsLoading && (
        <div className="flex rounded p-2 flex-col bg-[#F5F6FA]">
          <SenaryHeading
            title={'You have already submitted a proposal'}
            className="text-[#475467] text-[14px] leading-6 font-normal mt-2"
          />
          <div
            onClick={() => handleProposalDetails(bid?._id)}
            className="text-[#27AE60] underline underline-offset-2 mb-2 text-[14px] leading-6 font-normal cursor-pointer"
          >
            View Proposal
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <SenaryHeading
          title={`Posted: ${moment(bid.createdAt).format(
            'DD MMM YYYY, hh:mm'
          )}`}
          className="text-[#475467] text-sm leading-4 font-normal"
        />
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-schestiLightPrimary py-[5px] px-[11px]">
            <SenaryHeading
              title={bid.stage}
              className="text-schestiPrimary font-normal text-xs leading-4"
            />
          </div>
          <WhatsappShareButton
            url={`${window.location.protocol}//${window.location.hostname}/bid-management/details/${bid?._id}`}
            separator=":: "
            onClick={() => {
              if (bid?._id) {
                handleSocialMediaClick(bid?._id, 'whatsapp');
              }
            }}
          >
            <WhatsappIcon size={30} round />
          </WhatsappShareButton>
          <FacebookShareButton
            url={`${window.location.protocol}//${window.location.hostname}/bid-management/details/${bid?._id}`}
            onClick={() => {
              if (bid?._id) {
                handleSocialMediaClick(bid?._id, 'facebook');
              }
            }}
          >
            <FacebookIcon size={30} round />
          </FacebookShareButton>
          <TwitterShareButton
            url={`${window.location.protocol}//${window.location.hostname}/bid-management/details/${bid?._id}`}
            onClick={() => {
              if (bid?._id) {
                handleSocialMediaClick(bid?._id, 'twitter');
              }
            }}
          >
            <TwitterIcon size={30} round />
          </TwitterShareButton>
          <SendEmailModal
            to={projectCreator || projectOwner || ''}
            projectId={bid ? bid._id : ''}
          />
        </div>
      </div>

      <div className="mt-[14px]">
        <SenaryHeading
          title={bid.projectName}
          className="text-[#475467] text-base leading-6 font-semibold"
        />

        <SenaryHeading
          title={bid.description}
          className="text-[#475467] text-[14px] leading-6 font-normal mt-2"
        />
        <div
          onClick={() => handleProposalDetails(bid?._id)}
          className="text-schestiPrimary underline underline-offset-2 text-[14px] leading-6 font-normal cursor-pointer"
        >
          View full details
        </div>
      </div>
      <Divider />
      <div className="my-4 space-y-3">
        <div className="flex items-center space-x-1">
          <SenaryHeading
            title="Location:"
            className="text-[#475467] text-sm leading-4 font-normal"
          />
          <SenaryHeading
            title={`${bid.city}, ${
              Country.getCountryByCode(bid.country)?.name
            }`}
            className="text-[#475467] text-sm leading-4 font-semibold"
          />
        </div>

        <div className="flex items-center space-x-1">
          <SenaryHeading
            title="Project Value:"
            className="text-[#475467] text-sm leading-4 font-normal"
          />
          <SenaryHeading
            title={`${currency.format(bid.projectValue)}`}
            className="text-[#475467] text-sm leading-4 font-semibold"
          />
        </div>
        <div className="flex items-center space-x-1">
          <SenaryHeading
            title="Bid Date:"
            className="text-[#475467] text-sm leading-4 font-normal"
          />
          <SenaryHeading
            title={`${moment(bid.bidDueDate).format('DD MMM YYYY, hh:mm')}`}
            className="text-[#475467] text-sm leading-4 font-semibold"
          />
        </div>
      </div>
      {typeof bid.user !== 'string' && bid.user.userRole !== 'admin' ? (
        <div>
          <Divider />
          <SenaryHeading
            title="Who is bidding the project?"
            className="text-[#475467] text-base leading-6 font-semibold"
          />

          <div className="bg-schestiLightPrimary mt-3 rounded-md  p-3 border border-[#EBEAEC]">
            <div className="flex justify-between">
              <div className="flex mt-1 space-x-2">
                <Avatar size={24} src={bid.user?.companyLogo}>
                  {bid.user.name[0]}
                </Avatar>

                <SenaryHeading
                  title={bid.user.companyName}
                  className="text-[#475467] text-[14px] leading-6 font-semibold"
                />
              </div>

              <div className="">
                <SenaryHeading
                  title={bid.user.userRole}
                  className="text-schestiPrimary capitalize underline underline-offset-2 text-[14px] leading-6 font-normal"
                />
                <SenaryHeading
                  title={bid.user.name}
                  className="text-[#475467] text-[14px] leading-6 font-normal"
                />
              </div>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <SenaryHeading
                title={`Phone: ${bid.user.phone ? bid.user.phone : ''}`}
                className="text-[#475467] text-[14px] leading-6 font-normal"
              />

              <SenaryHeading
                title={`Email: ${bid.user.email}`}
                className="text-[#475467] text-[14px] leading-6 font-normal"
              />
            </div>
          </div>
        </div>
      ) : null}
      <Divider className="my-2" />
      <div className="flex items-center py-[5px] px-[11px] space-x-2 cursor-pointer">
        {size(bid?.projectFiles) > 0 && (
          <>
            <Image
              alt="cloud icon"
              src={'/uploadcloud.svg'}
              width={16}
              height={16}
            />
            <SenaryHeading
              onClick={() => downloadAllFiles(bid.projectFiles)}
              title="Download all files"
              className="text-schestiPrimary text-xs leading-4 font-semibold underline underline-offset-2"
            />
          </>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {!isAuthUserBidSubmitter ? (
          <CustomButton
            text="Send Bid"
            onClick={() => {
              router.push(`${Routes['Bid Management'].Submit}/${bid._id}`);
            }}
          />
        ) : null}

        {isAuthUserBidSubmitter ? null : isEmpty(selectedProjectSavedBid) ? (
          <CustomButton
            onClick={() => {
              saveUserBidMutation.mutate({ projectId: bid?._id });
              setTimeout(() => {
                if (bidClickHandler) {
                  bidClickHandler();
                }
              }, 500);
            }}
            text="Add to my Bidding Projects"
            className="!bg-white !text-schestiPrimary"
          />
        ) : !isSelectedProjectSavedBidHasArchiveType ? (
          <CustomButton
            onClick={() =>
              removeUserBidMutation.mutate({
                biddingId: selectedProjectSavedBid?._id,
              })
            }
            text="Remove from my bidding projects"
            className="!text-[red] !bg-transparent !border-[red] !text-base !leading-7 "
          />
        ) : null}

        <CreateRFI
          isProjectOwner={false}
          onSuccess={() => {}}
          projectId={bid._id}
        />

        {isInvitation &&
        !(
          selectedProjectSavedBid && selectedProjectSavedBid.status === 'active'
        ) ? (
          <CustomButton
            text="Decline"
            className="!bg-white !border-[#F32051] text-[#F32051]"
            isLoading={isDeclining}
            onClick={() => {
              if (bid && bid._id) {
                handleDeclineInvitation(bid._id);
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
