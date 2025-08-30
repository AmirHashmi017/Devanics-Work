import CustomButton from '@/app/component/customButton/button';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { Divider } from 'antd';
import { Country } from 'country-state-city';
import { useMutation } from 'react-query';
import moment from 'moment';
import Image from 'next/image';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { bidManagementService } from '@/app/services/bid-management.service';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type Props = {
  bid: any;
  setSelectedBid: any;
  refetchSavedBids: () => void;
};
type RemoveUserBidProps = {
  biddingId: string;
};
export function BidDetails({ bid, setSelectedBid, refetchSavedBids }: Props) {
  const router = useRouterHook();
  const currency = useCurrencyFormatter();
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
    onSuccess(res: any) {
      console.log('res', res);
      if (res.data && res.data) {
        toast.success('Bid removed Successfully');
        setSelectedBid(null);
        refetchSavedBids();
        // Dispatch any necessary actions after successful mutation
      }
    },
    onError(error: any) {
      console.log('error', error);
      if (error.response?.data?.message) {
        toast.error(error.response?.data.message);
        // router.push(`/bid-management/sub-contractor/bids`);
      }
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <SenaryHeading
          title={`Posted: ${moment(bid?.projectId.createdAt).format('DD MMM YYYY, hh:mm')}`}
          className="text-[#475467] text-sm leading-4 font-normal"
        />
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-[#E9EBF8] py-[5px] px-[11px]">
            <SenaryHeading
              title={bid?.projectId.stage}
              className="text-[#7138DF] font-normal text-xs leading-4"
            />
          </div>
          <Image
            alt="trash icon"
            src={'/trash.svg'}
            width={16}
            height={16}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-[14px]">
        <SenaryHeading
          title={bid?.projectId?.projectName}
          className="text-[#475467] text-base leading-6 font-semibold"
        />

        <SenaryHeading
          title={bid?.projectId?.description}
          className="text-[#475467] text-[14px] leading-6 font-normal mt-2"
        />

        <p className="text-[#7F56D9] underline underline-offset-2 mt-4 text-[14px] leading-6 font-normal cursor-pointer">
          View full details
        </p>
      </div>

      <Divider />

      <div className="my-4 space-y-3">
        <div className="flex items-center space-x-1">
          <SenaryHeading
            title="Location:"
            className="text-[#475467] text-sm leading-4 font-normal"
          />
          <SenaryHeading
            title={`${bid?.projectId.city}, ${Country.getCountryByCode(bid?.projectId.country)?.name}`}
            className="text-[#475467] text-sm leading-4 font-semibold"
          />
        </div>

        <div className="flex items-center space-x-1">
          <SenaryHeading
            title="Project Value:"
            className="text-[#475467] text-sm leading-4 font-normal"
          />
          <SenaryHeading
            title={`${currency.format(bid?.projectId?.projectValue)}`}
            className="text-[#475467] text-sm leading-4 font-semibold"
          />
        </div>

        <div className="flex items-center space-x-1">
          <SenaryHeading
            title="Bid Date:"
            className="text-[#475467] text-sm leading-4 font-normal"
          />
          <SenaryHeading
            title={`${moment(bid?.projectId.bidDueDate).format('DD MMM YYYY, hh:mm')}`}
            className="text-[#475467] text-sm leading-4 font-semibold"
          />
        </div>
      </div>

      <Divider />

      <div className="flex items-center py-[5px] px-[11px] space-x-2 cursor-pointer">
        <Image
          alt="cloud icon"
          src={'/uploadcloud.svg'}
          width={16}
          height={16}
        />
        <SenaryHeading
          title="Download all files"
          className="text-[#7138DF] text-xs leading-4 font-semibold underline underline-offset-2"
        />
      </div>

      <div className="mt-4 space-y-2">
        <CustomButton
          onClick={() => removeUserBidMutation.mutate({ biddingId: bid._id })}
          text="Remove from my bidding projects"
          className="!text-[red] !bg-transparent !border-[red] !text-base !leading-7 "
        />
      </div>
      <div className="mt-4 space-y-2">
        <CustomButton
          text="Send Bid"
          className="!bg-[#EAECF0] !text-[#667085] !border-[#EAECF0] !text-base !leading-7 "
        />
      </div>
      <div className="mt-4 space-y-2">
        <CustomButton
          onClick={() =>
            router.push(
              `/bid-management/contractor/details/${bid.projectId?._id}`
            )
          }
          text="View Details"
          className="!bg-[#EAECF0] !text-[#667085] !border-[#EAECF0] !text-base !leading-7 "
        />
      </div>
    </div>
  );
}
