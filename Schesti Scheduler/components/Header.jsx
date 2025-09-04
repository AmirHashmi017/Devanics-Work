'use client';
// import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// module imports
import CustomButton from './CustomButton';
// import { useUser } from '@/app/hooks/useUser';
// import { useUserPlanFeatures } from '@/app/hooks/useUserPlanFeatures';
import { SelectComponent } from './SelectComponent';
import { DownOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown } from 'antd';
import SenaryHeading from './SenaryHeading';
// import { planFeatureOptions } from '@/app/utils/plans.utils';
// import { resetPostProjectAction } from '@/redux/post-project/post-project.slice';
// import { useRouterHook } from '@/app/hooks/useRouterHook';
import { backend_url_core, shesti_original_app_url } from '../constants/api';
import { planFeatureOptions } from './plans';

import supportTicketImg from '../images/message-question.svg';
import dollarCirlcleSvg from '../images/dollar-circle.svg'
import crownSvg from '../images/crown.svg'
import axios from 'axios';

// function filterMenuItemsByPermissions(
//   items,
//   permissions
// ) {
//   return permissions.map((permission) => {
//     const item = items?.find((item) => {
//       if (item && 'key' in item && item.key?.toString().includes(permission)) {
//         return item;
//       }
//     });

//     return item
//       ? item
//       : {
//         key: permission,
//         label: undefined,
//       };
//   });
// }
const Navbar = () => {
  const dispatch = useDispatch();
  // const { planFeatures } = useUserPlanFeatures();
  // const user = useUser();
  // const router = useRouterHook();
  function resetPostProjectState(canCall) {
    if (canCall) {
      dispatch(resetPostProjectAction());
    }
  }

  // const isCompanyEmployee = user && user.associatedCompany;
  // employee links to show on sidebar
  // const companyEmployeePermissions =
  //   user && user.associatedCompany && user.roles
  //     ? user.roles
  //         .map((role) => (typeof role !== 'string' ? role.permissions : ''))
  //         .flat()
  //     : [];

  let menuItems = [
    {
      label: <span className="text-xs">Dashboard</span>,
      value: '/dashboard',
      icon: <HomeOutlined className="!text-2xl" />,
      onClick() {
        window.location.replace(shesti_original_app_url + '/dashboard')
      },
    },
    ...planFeatureOptions.map((feature) => {
      if (feature.options) {
        return {
          label: feature.label,
          key: feature.value ? feature.value : feature.label,
          icon: <feature.Icon />,

          options: feature.options?.map((option) => {
            return {
              label: option.label,
              value: option.value,
              onClick() {
                if (option.value) {
                  window.location.replace(shesti_original_app_url + option.value)
                }
                if ('isAction' in option) {
                  // resetPostProjectState(Boolean(option.isAction));
                  () => { }
                }
              },
              options:
                'children' in option
                  ? option.children?.map((child) => {
                    return {
                      label: child.label,
                      value: child.value,
                      onClick() {
                        window.location.replace(shesti_original_app_url + child.value)
                      },
                    };
                  })
                  : undefined,
            };
          }),
        };
      }

      return {
        label: feature.label,
        key: feature.value,
        icon: <feature.Icon />,
        onClick() {
          if (feature.value != '/') {
            window.location.replace(shesti_original_app_url + feature.value)
          }
        },
      };
    }),
    {
      label: <span className="text-xs">Settings</span>,
      value: '/settings',
      onClick: () => {window.location.replace(shesti_original_app_url + '/settings/general')},
    },
    // {
    //   type: 'divider',
    //   style: {
    //     borderColor: 'white',
    //     margin: '10px 0',
    //   },
    // },
    // {
    //   label: 'Settings',
    //   key: '/settings',
    //   icon: <SettingIcon />,
    //   onClick() {
    //     router.push('/settings/general');
    //     window.location.replace(shesti_original_app_url + '/settings/general')
    //   },
    // },
  ]
  // let menuItems = [
  //   {
  //     label: <span className="text-xs">Dashboard</span>,
  //     value: '/dashboard',
  //     onClick: () => router.push('/dashboard'),
  //   },
  //   ...planFeatureOptions.map((feature) => {
  //     if (feature.options) {
  //       return {
  //         label: <span className="text-xs">{feature.label}</span>,
  //         value: feature.value || feature.label,
  //         options: feature.options.map((option) => ({
  //           label: option.label,
  //           value: option.value,
  //           onClick: () => {
  //             if (option.value) {
  //               router.push(option.value);
  //             }
  //             if (!option.isAction) {
  //               resetPostProjectState(Boolean(option.isAction));
  //             }
  //           },
  //           options:
  //             option.children &&
  //             option.children.map((child) => ({
  //               label: child.label,
  //               value: child.value,
  //               onClick: () => router.push(child.value),
  //             })),
  //         })),
  //       };
  //     }

  //     return {
  //       label: <span className="text-xs">{feature.label}</span>,
  //       value: feature.value,
  //       onClick: () => router.push(feature.value),
  //     };
  //   }),
  //   {
  //     label: <span className="text-xs">Settings</span>,
  //     value: '/settings',
  //     onClick: () => router.push('/settings/general'),
  //   },
  // ];

  // Filter permissions if needed
  // if (isCompanyEmployee) {
  //   // @ts-ignore
  //   menuItems = filterMenuItemsByPermissions(
  //     menuItems,
  //     companyEmployeePermissions
  //   ).filter(
  //     (item) => item && 'label' in item && item.label !== undefined
  //   );
  // }
  const [user, setuser] = useState(null)
  const getMyProfile = async() => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(backend_url_core+'/api/auth/me',{
        headers:{
          Authorization : `Bearer ${token}`
        }
      })
      setuser(res.data?.data)
      console.log(res, res.data?.data, " ===> response of my profile")
    } catch (error) {
      console.log(error, " ===> error while getting my profile")
    }
  }
  useEffect(()=>{
    getMyProfile()
  },[])
  const logoutHandler = () => {
    localStorage.removeItem('token');
    window.location.replace(shesti_original_app_url + '/login');
  };
  return (
    <nav className="!relative !py-3 !px-16 md:!h-[60px] md:!flex !flex-col !shadow-lg  md:!flex-row !items-center !justify-between !w-full !bg-white">
      <div className="">
        <div className="w-96">
          <SelectComponent
            label=""
            name=""
            placeholder="Search here..."
            field={{
              showSearch: true,

              suffixIcon: <SearchOutlined />,
              options: menuItems,
              onSelect: (value) => {
                const selectedItem = menuItems.find(
                  (item) => item.value === value
                );
                if (selectedItem?.onClick) {
                  selectedItem.onClick();
                }
              },
            }}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="flex items-center gap-3 my-2">
          {/* {
            // user?.associatedCompany || planFeatures.length >= 7 ? null : (
            <span onClick={() => { window.location.replace(shesti_original_app_url + '/upgradeplans') }} href={'/upgradeplans'} className="">
              <CustomButton
                className="!py-2.5 !px-6 !h-full  !bg-[#FFF5EA] border !border-[#FFD29E] !text-[#FF9D2C] !font-semibold shadow-scenarySubdued"
                icon={crownSvg}
                iconwidth={20}
                iconheight={20}
                text="Upgrade Plan"
              />
            </span>
            // )
          } */}
          <span
            onClick={() => { window.location.replace(shesti_original_app_url + '/settings/supporttickets') }}
            href={'/settings/supporttickets'}
            className="border-[#E0E1E1] border bg-[#f8f8f8f] !py-3 !px-4 rounded-md"
          >
            <img
              src={supportTicketImg}
              alt="logo white icon"
              width={24}
              height={24}
              className="active:scale-105 cursor-pointer"
            />
          </span>

          <span
            onClick={() => { window.location.replace(shesti_original_app_url + '/settings/currency') }}
            href={'/settings/currency'}
            className="border-[#E0E1E1] border bg-[#f8f8f8f] !py-3 !px-4 rounded-md"
          >
            <img
              src={dollarCirlcleSvg}
              alt="logo white icon"
              width={24}
              height={24}
              className="active:scale-105 cursor-pointer"
            />
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Badge with Avatar */}
            <Badge
              color="#52c41a" // Green color for online status
              offset={[-5, 40]} // Position the badge
              dot
            >
              <Avatar
                size={48}
                src={
                  user?.user?.socialAvatar ||
                  user?.user?.companyLogo ||
                  user?.user?.avatar ||
                  'https://i.pravatar.cc/300'
                } // Replace with user profile image URL
                alt="Profile Picture"
              />
            </Badge>

            {/* Name with Dropdown */}
            <Dropdown
              menu={{
                items: [
                  {
                    label: <span onClick={() => { window.location.replace(shesti_original_app_url + '/settings/general') }}>Profile</span>,
                    key: '1',
                  },
                  {
                    label: (
                      <span href={'#'} onClick={logoutHandler}>
                        Logout
                      </span>
                    ),
                    key: '2',
                  },
                ],
              }}
              trigger={['click']}
            >
              <div
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <SenaryHeading
                  title={user?.user?.name ?? user?.user?.companyName ??'User'}
                  className="text-[16px] font-semibold !m-0"
                />
                <DownOutlined style={{ fontSize: '12px' }} />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
