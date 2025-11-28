// modules import
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton, Tabs, Select } from 'antd';

// redux imports
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPricingPlans,
  selectPricingPlansError,
  selectPricingPlansLoading,
} from 'src/redux/pricingPlanSlice/pricingPlan.selector';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import { AppDispatch } from 'src/redux/store';
import { fetchPricingPlan } from 'src/redux/pricingPlanSlice/pricingPlan.thunk';
import { IPricingPlan } from 'src/interfaces/pricing-plan.interface';
import { setPricingPlan } from 'src/redux/pricingPlanSlice/pricingPlanSlice';
import SwitchBtn from 'src/pages/Plans/switchBtn';

import ToggleBtn from './toggleBtn/index';
import SinglePlan from './plan';
import { bg_style } from '../../components/TailwindVariables';
import CustomButton from '../../components/CustomButton/button';
import TertiaryHeading from '../../components/Headings/Tertiary';
import NoData from 'src/components/noData';

const Plans = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector(selectToken);
  const plansData = useSelector(selectPricingPlans);
  const isLoading = useSelector(selectPricingPlansLoading);
  const isError = useSelector(selectPricingPlansError);

  const [planType, setPlanType] = useState('Individual');
  const [pricingPlansData, setPricingPlansData] = useState(
    [] as IPricingPlan[]
  );
  const [isDuration, setisDuration] = useState('monthly');
  const [planExistance, setPlanExistance] = useState('active');
  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  useEffect(() => {
    pricingPlansHandler();
  }, []);

  // useEffect(() => {
  //   if (plansData) {
  //     const newPlansData = plansData.pricingPlans.filter(
  //       ({ type }: IPricingPlan) => type === planType
  //     );
  //     setPricingPlansData(newPlansData);
  //   }
  // }, [plansData, planType]);

  useEffect(() => {
    if (plansData?.pricingPlans?.length) {
      const filteredPlanData = plansData.pricingPlans.filter(
        (plan: IPricingPlan) => {
          if (
            planType === plan.type &&
            isDuration === plan.duration &&
            plan.isActive === (planExistance === 'active')
          ) {
            return {
              ...plan,
            };
          }
        }
      );
      setPricingPlansData(filteredPlanData);
    }
  }, [plansData, planType, isDuration, planExistance]);

  const handlePlanType = (planType: string) => {
    setPlanType(planType);
  };

  const pricingPlansHandler = useCallback(async () => {
    const {
      payload: {
        statusCode,
        data: { pricingPlans },
      },
    }: any = await dispatch(fetchPricingPlan({ page: 1, limit: 10 }));
    if (statusCode === 200) {
      const filteredPlanData = pricingPlans.filter((plan: IPricingPlan) => {
        if (
          planType === plan.type &&
          isDuration === plan.duration &&
          plan.isActive === (planExistance === 'active')
        ) {
          return {
            ...plan,
          };
        }
      });

      setPricingPlansData(filteredPlanData);
    }
  }, []);

  const handlePlanDuration = (event: ChangeEvent<HTMLInputElement>) => {
    const currentPlanDuration = event.target.checked ? 'yearly' : 'monthly';
    setisDuration(currentPlanDuration);
  };

  return (
    <section className="p-16 py-4 rounded-xl">
      <div className={`${bg_style} p-5 border border-silverGray`}>
        <div className="flex justify-between items-center mb-4">
          <TertiaryHeading
            title="Pricing Plans"
            className="text-graphiteGray"
          />
          <CustomButton
            text="Add New"
            className="!w-auto "
            icon="assets/icons/plus.svg"
            iconwidth={20}
            iconheight={20}
            onClick={() => {
              dispatch(setPricingPlan(null));
              navigate('/plan/create');
            }}
          />
        </div>
        <Tabs
          defaultActiveKey={planExistance}
          onChange={(value) => setPlanExistance(value)}
          items={[
            { label: 'Active', value: 'active' },
            { label: 'In Active', value: 'inActive' },
          ].map((type) => {
            return {
              key: type.value,
              label: type.label,
              tabKey: type.value,
            };
          })}
        />

        <div className="flex w-full align-items-center justify-center">
          <ToggleBtn planType={planType} onChange={handlePlanType} />
        </div>
        <div className="flex w-full align-items-center justify-center my-6">
          <SwitchBtn isDuration={isDuration} onChange={handlePlanDuration} />
        </div>
        {isLoading ? (
          <>
            <Skeleton active />
            <Skeleton active />
          </>
        ) : pricingPlansData.length === 0 ? (
          <NoData title="No Date Found in Plans" displayBtn={false} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5">
            {pricingPlansData?.map((plan: IPricingPlan, index: number) => {
              return <SinglePlan key={index} {...plan} />;
            })}
            {/* {pricingPlansData
              .filter(
                (planSet) =>
                  planSet.duration === isDuration && planSet.type == planType
              )
              ?.map((plan: IPricingPlan, index: number) => {
                return <SinglePlan key={index} {...plan} />;
              })} */}
          </div>
        )}
      </div>
    </section>
  );
};

export default Plans;
