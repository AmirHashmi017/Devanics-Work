'use client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
// import ToggleBtn from './components/toggleBtn';

import SinglePlan from './components/plan/plan';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPricingPlans,
  selectPricingPlansError,
  selectPricingPlansLoading,
} from '@/redux/pricingPlanSlice/pricingPlan.selector';
import { Skeleton } from 'antd';
import { AppDispatch } from '@/redux/store';
import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';
import { fetchPricingPlan } from '@/redux/pricingPlanSlice/pricingPlan.thunk';
import { IUser } from '@/app/interfaces/companyEmployeeInterfaces/user.interface';
import ToggleBtn from '@/app/component/plans/toggleBtn';
import SwitchBtn from '@/app/component/plans/switchbtn';

type Props = {
  user?: IUser;
};
const Plans = ({ user }: Props) => {
  const [planType, setPlanType] = useState('Individual');
  const dispatch = useDispatch<AppDispatch>();
  const [pricingPlansData, setPricingPlansData] = useState(
    [] as IPricingPlan[]
  );
  const [isDuration, setIsDuration] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [autoRenew, setAutoRenew] = useState(true);

  const plansData = useSelector(selectPricingPlans);
  const isLoading = useSelector(selectPricingPlansLoading);
  const isError = useSelector(selectPricingPlansError);

  const handlePlanType = (planType: string) => {
    const currentPlanType = planType;
    const newPlansData = plansData.pricingPlans.filter(
      ({ type, duration }: IPricingPlan) =>
        type === currentPlanType && duration === isDuration
    );
    setPlanType(currentPlanType);
    setPricingPlansData(newPlansData);
  };

  const handlePlanDuration = (event: ChangeEvent<HTMLInputElement>) => {
    const currentPlanDuration = event.target.checked ? 'yearly' : 'monthly';
    const newPlansData = plansData.pricingPlans.filter(
      ({ duration, type }: IPricingPlan) =>
        duration === currentPlanDuration && type === planType
    );
    setIsDuration(currentPlanDuration);
    setPricingPlansData(newPlansData);
  };

  const pricingPlansHandler = useCallback(async () => {
    const {
      payload: {
        statusCode,
        data: { pricingPlans },
      },
    }: any = await dispatch(fetchPricingPlan({ page: 1, limit: 10 }));
    if (statusCode === 200) {
      setPricingPlansData(
        pricingPlans.filter(
          ({ type, duration }: IPricingPlan) =>
            type === 'Individual' && duration === isDuration
        )
      );
    }
  }, []);

  useEffect(() => {
    pricingPlansHandler();
  }, []);

  console.log(selectedPlan, 'selectedPlanselectedPlan');

  return (
    <>
      <div className="flex justify-between">
        <ToggleBtn planType={planType} onChange={handlePlanType} />
        <SwitchBtn isDuration={isDuration} onChange={handlePlanDuration} />
      </div>
      <div className="mt-6">
        {isLoading ? (
          <Skeleton />
        ) : isError ? (
          <p>Something Went Wrong</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5">
            {pricingPlansData?.map(
              (plan: IPricingPlan, index: React.Key | null | undefined) => {
                return (
                  <SinglePlan
                    key={index}
                    {...plan}
                    setSelectedPlan={setSelectedPlan}
                    user={user}
                  />
                );
              }
            )}
          </div>
        )}
      </div>
    </>
  );
  // return (
  //   <>
  //     {!selectedPlan ? (
  //       <>
  //         <div className="flex justify-between">
  //           <ToggleBtn planType={planType} onChange={handlePlanType} />
  //           <SwitchBtn isDuration={isDuration} onChange={handlePlanDuration} />
  //         </div>
  //         <div className="mt-6">
  //           {isLoading ? (
  //             <Skeleton />
  //           ) : isError ? (
  //             <p>Something Went Wrong</p>
  //           ) : (
  //             <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5">
  //               {pricingPlansData?.map(
  //                 (plan: IPricingPlan, index: React.Key | null | undefined) => {
  //                   return (
  //                     <SinglePlan
  //                       key={index}
  //                       {...plan}
  //                       setSelectedPlan={setSelectedPlan}
  //                       user={user}
  //                     />
  //                   );
  //                 }
  //               )}
  //             </div>
  //           )}
  //         </div>
  //       </>
  //     )
  //     : (
  //       <>
  //         <p
  //           className="text-[#1D2939] cursor-pointer hover:text-blue-600 text-[15px] mb-5"
  //           onClick={() => setSelectedPlan(null)}
  //         >
  //           {`<`} Back
  //         </p>
  //         <div className="flex gap-10">
  //           <div className="flex flex-col gap-5 shadow-md rounded-s max-w-lg w-full p-6">
  //             <div>
  //               <TertiaryHeading title="Subscribe to" />
  //               <SecondaryHeading
  //                 title={selectedPlan?.planName!}
  //                 className="!text-[#101828]"
  //               />
  //             </div>
  //             <div className="flex items-center">
  //               <span className="tracking-[-0.72px] font-semibold text-[40px] leading-[52px] !text-goldenrodYellow">
  //                 ${selectedPlan?.price}
  //               </span>
  //               <p
  //                 className={`${minHeading} !text-[18px] !text-[#98A2B3]  font-normal`}
  //               >
  //                 /{selectedPlan?.duration}
  //               </p>
  //             </div>
  //             <div className="flex flex-col">
  //               <label className="text-4 text-[#6A6A6A] mb-2">Promo Code</label>
  //               <input
  //                 className="border border-doveGray px-3 py-4 rounded-md"
  //                 type="text"
  //                 placeholder="Enter Promo Code"
  //               />
  //             </div>
  //             <div className="">
  //               <div className="flex align-center justify-between border-b-[1px] py-4">
  //                 <p className="text-[#667085] text-[18px]">Plan Price</p>
  //                 <h6 className="text-[#1D2939] text-[18px]">
  //                   ${selectedPlan?.price}
  //                 </h6>
  //               </div>
  //               <div className="flex align-center justify-between border-b-[1px] py-4">
  //                 <p className="text-[#667085] text-[18px]">Discount</p>
  //                 <h6 className="text-[#1D2939] text-[18px]">00.00</h6>
  //               </div>
  //               <div className="flex align-center justify-between border-b-[1px] py-4">
  //                 <p className="text-[#667085] text-[18px]">Total</p>
  //                 <h6 className="text-[#1D2939] text-[18px]">
  //                   ${selectedPlan?.price}
  //                 </h6>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="w-full">
  //             <div className="flex align-center justify-between">
  //               <SecondaryHeading
  //                 title="Select Payment Method"
  //                 className="!text-[#344054]"
  //               />
  //               <div className="flex align-center gap-3">
  //                 <p className="text-[#667085] text-[16px]">
  //                   Enable auto-payment to renew subscription
  //                 </p>

  //                 <Switch
  //                   checkedChildren={<CheckOutlined />}
  //                   unCheckedChildren={<CloseOutlined />}
  //                   defaultChecked
  //                   onChange={(checked) => setAutoRenew(checked)}
  //                 />
  //               </div>
  //             </div>
  //             <div className="flex flex-col">
  //               <div className="h-52 grid place-items-center w-full shadow-md  my-6 gap-10  rounded-s cursor-pointer">
  //                 <Image
  //                   src={'/stripe.svg'}
  //                   alt={'stripe icon'}
  //                   width={190}
  //                   height={80}
  //                 />
  //               </div>
  //               <div className="h-52 grid place-items-center w-full shadow-md   rounded-s">
  //                 <Image
  //                   src={'/paypal.svg'}
  //                   alt={'paypal icon'}
  //                   width={190}
  //                   height={80}
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </>
  //     )}
  //   </>
  // );
};

export default Plans;
