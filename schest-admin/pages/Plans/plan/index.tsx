// module imports

import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { twMerge } from 'tailwind-merge';
import { Badge, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// redux imports
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/redux/store';
import {
  tertiaryHeading,
  quinaryHeading,
  minHeading,
} from '../../../components/TailwindVariables';
import { IPricingPlan } from 'src/interfaces/pricing-plan.interface';
import { pricingPlanService } from 'src/services/pricingPlan.service';
import type { MenuProps } from 'antd';
import {
  setPricingPlan,
  updatePricingPlanStatus,
} from 'src/redux/pricingPlanSlice/pricingPlanSlice';
import { featureOptions, getKeyByValue } from '../utils';
import _ from 'lodash';

const SinglePlan = (props: IPricingPlan) => {
  const {
    _id,
    planName,
    price,
    planDescription,
    isActive,
    features,
    duration,
  } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleDropdownItemClick = async (key: string) => {
    if (key === 'edit') {
      dispatch(setPricingPlan(props));
      navigate(`/plan/${_id}`);
    }
    // else if (key === 'delete') {
    //   const { statusCode } = await pricingPlanService.httpDeletePricingPlan(
    //     _id!
    //   );
    //   if (statusCode === 200) {
    //     dispatch(deletePricingPlan(_id));
    //   }
    // }
    else if (key === 'active') {
      const { statusCode } =
        await pricingPlanService.httpUpdateStatusPricingPlan(_id!);
      if (statusCode === 200) {
        dispatch(updatePricingPlanStatus(_id));
      }
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: <p>Edit Plan</p>,
    },
    {
      key: 'active',
      label: <p>{isActive ? 'Inactive' : 'Active'}</p>,
    },
    // {
    //   key: 'delete',
    //   label: <p>Delete Plan</p>,
    // },
  ];

  const child = (
    <div className="p-8 rounded-[20px] items-center flex flex-col justify-between shadow-secondaryShadow gap-5 relative">
      <div className=" flex flex-col gap-8 w-full items-start">
        <div className="flex justify-between w-full">
          <h2 className={`${tertiaryHeading} text-graphiteGray`}>{planName}</h2>
          <Dropdown
            menu={{
              items,
              onClick: (event) => {
                const { key } = event;
                handleDropdownItemClick(key);
              },
            }}
            className="cursor-pointer"
            placement="bottomRight"
          >
            <DownOutlined />
          </Dropdown>
        </div>
        <div className="flex items-center">
          <span className="tracking-[-0.72px] font-semibold text-[42px] leading-[46px] !text-goldenrodYellow">
            ${price}
          </span>
          <p className={`${minHeading} text-lightdark  font-normal`}>
            /{duration}
          </p>
        </div>
        {props.egpPrice ? (
          <div className="flex items-center">
            <span className="tracking-[-0.72px] font-semibold text-[32px] leading-[46px] !text-goldenrodYellow">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EGP',
              }).format(props.egpPrice)}
            </span>
            <p className={`${minHeading} text-lightdark  font-normal`}>
              /{duration}
            </p>
          </div>
        ) : null}
        <p className={`${quinaryHeading} text-lightdark2 whitespace-pre-wrap`}>
          {planDescription}
        </p>
        <div className="w-full h-px bg-mistyWhite" />

        <div className="flex flex-col gap-y-4">
          <h4 className={`${tertiaryHeading} font-normal text-ebonyGray`}>
            Features
          </h4>
          <div className="flex gap-2 flex-col">
            {_.uniq(
              features.split(',').concat(['/social-media', '/daily-work'])
            )?.map((benefit, index) => (
              <Fragment key={index}>
                <div className="self-start flex gap-2 items-center">
                  <img
                    src="assets/icons/purplecheck.svg"
                    width={20}
                    height={20}
                    className="rounded-md"
                    alt="tick"
                  />
                  <label
                    htmlFor={benefit}
                    className={twMerge(
                      `${quinaryHeading} text-ebonyGray leading-normal`
                    )}
                  >
                    {getKeyByValue(featureOptions, benefit)}
                  </label>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return props.freeTrailDays ? (
    <div className="h-full">
      <Badge.Ribbon
        text={`Free for ${props.freeTrailDays} days`}
        rootClassName="h-full"
      >
        {child}
      </Badge.Ribbon>
    </div>
  ) : (
    child
  );
};

export default SinglePlan;
