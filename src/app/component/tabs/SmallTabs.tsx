'use client';

import { quaternaryHeading } from '@/globals/tailwindvariables';
import { useRouter } from 'next/navigation';
import { Dropdown, Space } from 'antd';
// import type { MenuProps } from 'antd';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import tabsStyle from './tabs.module.css';
import { DownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { planFeatureOptions } from '@/app/utils/plans.utils';
import {
  // useDispatch,
  useSelector,
} from 'react-redux';
import { selectToken } from '@/redux/authSlices/auth.selector';
import { useLayoutEffect } from 'react';
import { HttpService } from '@/app/services/base.service';
// import { useQuery } from 'react-query';
// import { IResponseInterface } from '@/app/interfaces/api-response.interface';
// import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';
// import { AxiosError } from 'axios';
// import { pricingPlanService } from '@/app/services/pricingPlan.service';
import {
  // AppDispatch,
  RootState,
} from '@/redux/store';
// import { setUserPricingPlan } from '@/redux/pricingPlanSlice/pricingPlanSlice';
// const items: MenuProps['items'] = [
//   {
//     key: '1',
//     label: <Link href="/estimates">Estimates Requests</Link>,
//   },

//   {
//     key: '2',
//     label: <Link href="/estimates/generate">Estimates List</Link>,
//   },
// ];

const SmallTabs = () => {
  const pathname = usePathname();
  const router = useRouter();
  const token = useSelector(selectToken);
  // const dispatch = useDispatch<AppDispatch>();
  const userPlan = useSelector(
    (state: RootState) => state.pricingPlan.userPlan
  );

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  // const userPricingQuery = useQuery<IResponseInterface<{ plan: IPricingPlan }>, AxiosError<{ message: string, statusCode: number }>>(['userPricing'], () => pricingPlanService.httpGetUserPricingPlan(), {
  //   onSuccess(data) {
  //     if (data.data?.plan) {
  //       dispatch(setUserPricingPlan(data.data.plan));
  //     }
  //   },
  //   onError(err) {
  //     console.log("User Pricing Plan Error", err.response?.data);
  //     if (err.response && err.response.data.statusCode >= 400) {
  //       router.push("/login");
  //     }
  //   },
  //   // staleTime: 60 * 5000
  // });

  const userPlanFeatures = userPlan ? userPlan.features.split(',') : [];

  return (
    <div className="md:flex block justify-between bg-white sticky top-0 !z-10 items-center px-16 xl:h-[67px] shadow-quinaryGentle">
      <ul
        className="list-none flex flex-wrap xl:gap-8 gap-3 text-sm font-medium text-center
            text-gray-500 dark:text-gray-400 justify-center mb-0"
      >
        <li
          key={'dashboard'}
          className={twMerge(
            clsx(
              `${quaternaryHeading} text-steelGray
                flex items-stretch justify-center py-2 
                 cursor-pointer
                `,
              pathname === '/dashboard' && tabsStyle.active
            )
          )}
          onClick={() => router.push('/dashboard')}
        >
          Dashboard
        </li>
        {planFeatureOptions.map((feature, index) => {
          if (feature.options) {
            if (
              process.env.NEXT_PUBLIC_IS_MVP_1 === 'true' &&
              feature.title.includes('Bid')
            ) {
              return '';
            }
            return (
              <li key={index}>
                <Dropdown
                  menu={{
                    items: feature.options.map((option, index) => {
                      return {
                        key: index,
                        label: (
                          <Link href={option.value ?? '/'}>{option.label}</Link>
                        ),
                      };
                    }),
                    selectable: true,
                  }}
                >
                  <Space
                    className={twMerge(
                      clsx(
                        `${quaternaryHeading} text-steelGray
                        flex items-stretch justify-center py-2 
                         cursor-pointer
                        `,
                        feature.options.find(
                          (option) =>
                            option.value && pathname.includes(option.value)
                        ) && tabsStyle.active
                      )
                    )}
                  >
                    {feature.title}
                    <DownOutlined />
                  </Space>
                </Dropdown>
              </li>
            );
          } else {
            return (
              <li
                key={index}
                className={twMerge(
                  clsx(
                    `${quaternaryHeading} text-steelGray
                  flex items-stretch justify-center py-2 
                   cursor-pointer
                  `,
                    pathname.includes(feature.value) && tabsStyle.active
                  )
                )}
              >
                {userPlanFeatures.includes(feature.value) ? (
                  <Link href={feature.value ?? '/'}>{feature.label}</Link>
                ) : (
                  <Link href="/upgrade-feature">{feature.label}</Link>
                )}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );

  // return (
  //   <div className="md:flex block justify-between bg-[#F0E9FD] items-center px-16 xl:h-[67px] shadow-quinaryGentle">
  //     <ul
  //       className="list-none flex flex-wrap xl:gap-8 gap-3 text-sm font-medium text-center
  //           text-gray-500 dark:text-gray-400 justify-center mb-0"
  //     >
  //       <li
  //         className={twMerge(
  //           clsx(
  //             `${quaternaryHeading} text-steelGray
  //               flex items-stretch justify-center py-2
  //                cursor-pointer
  //               `,
  //             pathname === '/dashboard' && tabsStyle.active
  //           )
  //         )}
  //         onClick={() => router.push('/dashboard')}
  //       >
  //         Dashboard
  //       </li>
  //       <li>
  //         <Dropdown
  //           menu={{
  //             items: [
  //               {
  //                 key: 'bid-owner',
  //                 label: <Link href="/bid/owner">Owner</Link>,
  //               },
  //               {
  //                 key: 'bid-contractor',
  //                 label: <Link href="/bid/contractor">Contractor</Link>,
  //               },
  //               {
  //                 key: 'bid-sub-contractor',
  //                 label: <Link href="/bid/sub-contractor">Sub Contractor</Link>,
  //               },
  //             ],
  //             selectable: true,
  //           }}
  //         >
  //           <Space
  //             className={twMerge(
  //               clsx(
  //                 `${quaternaryHeading} text-steelGray
  //                   flex items-stretch justify-center py-2
  //                    cursor-pointer
  //                   `,
  //                 pathname.includes('/bid'.split('/')[1]) && tabsStyle.active
  //               )
  //             )}
  //           >
  //             Bid Management
  //             <DownOutlined />
  //           </Space>
  //         </Dropdown>
  //       </li>
  //       <li>
  //         <Dropdown
  //           menu={{
  //             items: [
  //               {
  //                 key: 'crm-clients',
  //                 label: <Link href="/clients">Clients</Link>,
  //               },
  //               {
  //                 key: 'crm-subcontractor',
  //                 label: <Link href="/subcontractor">Sub Contractors</Link>,
  //               },
  //               {
  //                 key: 'crm-partners',
  //                 label: <Link href="/partners">Partners</Link>,
  //               },
  //             ],
  //             selectable: true,
  //           }}
  //         >
  //           <Space
  //             className={twMerge(
  //               clsx(
  //                 `${quaternaryHeading} text-steelGray
  //                   flex items-stretch justify-center py-2
  //                    cursor-pointer
  //                   `,
  //                 (pathname.includes('/clients') ||
  //                   pathname.includes('/subcontractor') ||
  //                   pathname.includes('/partners')) &&
  //                   tabsStyle.active
  //               )
  //             )}
  //           >
  //             CRM
  //             <DownOutlined />
  //           </Space>
  //         </Dropdown>
  //       </li>
  //       <li>
  //         <Dropdown
  //           menu={{
  //             items: [
  //               {
  //                 key: 'manual',
  //                 label: <Link href="/takeoff/manual">Manual</Link>,
  //               },
  //               {
  //                 key: 'ai-takeoff',
  //                 label: <Link href="/takeoff/ai">AI take off</Link>,
  //               },
  //             ],
  //             selectable: true,
  //           }}
  //         >
  //           <Space
  //             className={twMerge(
  //               clsx(
  //                 `${quaternaryHeading} text-steelGray
  //                   flex items-stretch justify-center py-2
  //                    cursor-pointer
  //                   `,
  //                 pathname.includes('/takeoff') && tabsStyle.active
  //               )
  //             )}
  //           >
  //             Quantity Takeoff
  //             <DownOutlined />
  //           </Space>
  //         </Dropdown>
  //       </li>
  //       <li>
  //         <Dropdown
  //           menu={{
  //             items,
  //             selectable: true,
  //           }}
  //         >
  //           <Space
  //             className={twMerge(
  //               clsx(
  //                 `${quaternaryHeading} text-steelGray
  //                   flex items-stretch justify-center py-2
  //                    cursor-pointer
  //                   `,
  //                 pathname.includes('/estimates'.split('/')[1]) &&
  //                   tabsStyle.active
  //               )
  //             )}
  //           >
  //             Estimates
  //             <DownOutlined />
  //           </Space>
  //         </Dropdown>
  //       </li>
  //       <li
  //         className={twMerge(
  //           clsx(
  //             `${quaternaryHeading} text-steelGray
  //               flex items-stretch justify-center py-2
  //                cursor-pointer
  //               `,
  //             pathname.includes('/schedule') && tabsStyle.active
  //           )
  //         )}
  //         onClick={() => router.push('/schedule')}
  //       >
  //         Schedule
  //       </li>
  //       <li>
  //         <Dropdown
  //           menu={{
  //             items: [
  //               {
  //                 key: 'standard-invoicing',
  //                 label: (
  //                   <Link href="/invoices/standard-invoicing">
  //                     Standard Invoicing
  //                   </Link>
  //                 ),
  //               },
  //               {
  //                 key: 'aia-invoicing',
  //                 label: (
  //                   <Link href="/invoices/aia-invoicing">AIA Invoicing</Link>
  //                 ),
  //               },
  //               {
  //                 key: 'financial-tools',
  //                 label: <Link href="/finance">Financial Tools</Link>,
  //               },
  //             ],
  //             selectable: true,
  //           }}
  //         >
  //           <Space
  //             className={twMerge(
  //               clsx(
  //                 `${quaternaryHeading} text-steelGray
  //                   flex items-stretch justify-center py-2
  //                    cursor-pointer
  //                   `,
  //                 (pathname.includes('/finance') ||
  //                   pathname.includes('/invoices')) &&
  //                   tabsStyle.active
  //               )
  //             )}
  //           >
  //             Financial
  //             <DownOutlined />
  //           </Space>
  //         </Dropdown>
  //       </li>
  //       <li
  //         className={twMerge(
  //           clsx(
  //             `${quaternaryHeading} text-steelGray
  //               flex items-stretch justify-center py-2
  //                cursor-pointer
  //               `,
  //             pathname.includes('/meeting'.split('/')[1]) && tabsStyle.active
  //           )
  //         )}
  //         onClick={() => router.push('/meeting')}
  //       >
  //         Meetings
  //       </li>
  //       <li
  //         className={twMerge(
  //           clsx(
  //             `${quaternaryHeading} text-steelGray
  //               flex items-stretch justify-center py-2
  //                cursor-pointer
  //               `,
  //             pathname.includes('/networking'.split('/')[1]) && tabsStyle.active
  //           )
  //         )}
  //         onClick={() => router.push('/networking')}
  //       >
  //         Networking
  //       </li>
  //     </ul>
  //   </div>
  // );
};

export default SmallTabs;
