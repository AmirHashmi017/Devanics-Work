'use client';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

// module imports
import { AppDispatch } from '@/redux/store';
import CustomButton from '../customButton/button';
import { logout } from '@/redux/authSlices/authSlice';
import { useUser } from '@/app/hooks/useUser';
import { useUserPlanFeatures } from '@/app/hooks/useUserPlanFeatures';
import { SelectComponent } from '../customSelect/Select.component';
import { DownOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, type MenuProps } from 'antd';
import SenaryHeading from '../headings/senaryHeading';
import { planFeatureOptions } from '@/app/utils/plans.utils';
import { resetPostProjectAction } from '@/redux/post-project/post-project.slice';
import { useRouterHook } from '@/app/hooks/useRouterHook';

function filterMenuItemsByPermissions(
  items: MenuProps['items'],
  permissions: string[]
): MenuProps['items'] {
  return permissions.map((permission) => {
    const item = items!.find((item) => {
      if (item && 'key' in item && item.key?.toString().includes(permission)) {
        return item;
      }
    });

    return item
      ? item
      : {
          key: permission,
          label: undefined,
        };
  });
}
const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { planFeatures } = useUserPlanFeatures();
  const user = useUser();
  const router = useRouterHook();
  function resetPostProjectState(canCall: boolean) {
    if (canCall) {
      dispatch(resetPostProjectAction());
    }
  }

  const isCompanyEmployee = user && user.associatedCompany;
  // employee links to show on sidebar
  const companyEmployeePermissions =
    user && user.associatedCompany && user.roles
      ? user.roles
          .map((role) => (typeof role !== 'string' ? role.permissions : ''))
          .flat()
      : [];
  let menuItems = [
    {
      label: <span className="text-xs">Dashboard</span>,
      value: '/dashboard',
      onClick: () => router.push('/dashboard'),
    },
    ...planFeatureOptions.map((feature) => {
      if (feature.options) {
        return {
          label: <span className="text-xs">{feature.label}</span>,
          value: feature.value || feature.label,
          options: feature.options.map((option) => ({
            label: option.label,
            value: option.value,
            onClick: () => {
              if (option.value) {
                router.push(option.value);
              }
              if (!option.isAction) {
                resetPostProjectState(Boolean(option.isAction));
              }
            },
            options:
              option.children &&
              option.children.map((child) => ({
                label: child.label,
                value: child.value,
                onClick: () => router.push(child.value),
              })),
          })),
        };
      }

      return {
        label: <span className="text-xs">{feature.label}</span>,
        value: feature.value,
        onClick: () => router.push(feature.value),
      };
    }),
    {
      label: <span className="text-xs">Settings</span>,
      value: '/settings',
      onClick: () => router.push('/settings/general'),
    },
  ];

  // Filter permissions if needed
  if (isCompanyEmployee) {
    // @ts-ignore
    menuItems = filterMenuItemsByPermissions(
      menuItems! as unknown as MenuProps['items'],
      companyEmployeePermissions!
    ).filter(
      (item: any) => item && 'label' in item && item.label !== undefined
    );
  }
  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem('schestiToken');
    window.location.pathname = '/login';
  };
  return (
    <nav className="py-3 px-16 md:h-[60px] md:flex flex-col shadow-lg  md:flex-row items-center justify-between w-full bg-white">
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
          {user?.associatedCompany || planFeatures.length >= 7 ? null : (
            <Link href={'/upgradeplans'} className="">
              <CustomButton
                className="!py-2.5 !px-6 !h-full  !bg-[#FFF5EA] border !border-[#FFD29E] !text-[#FF9D2C] !font-semibold shadow-scenarySubdued"
                icon="/crown.svg"
                iconwidth={20}
                iconheight={20}
                text="Upgrade Plan"
              />
            </Link>
          )}
          <Link
            href={'/settings/supporttickets'}
            className="border-[#E0E1E1] border bg-[#f8f8f8f] py-3 px-4 rounded-md"
          >
            <Image
              src={'/message-question.svg'}
              alt="logo white icon"
              width={24}
              height={24}
              className="active:scale-105 cursor-pointer"
            />
          </Link>

          <Link
            href={'/settings/currency'}
            className="border-[#E0E1E1] border bg-[#f8f8f8f] py-3 px-4 rounded-md"
          >
            <Image
              src={'/dollar-circle.svg'}
              alt="logo white icon"
              width={24}
              height={24}
              className="active:scale-105 cursor-pointer"
            />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Badge with Avatar */}
            <Badge
              color="#52c41a" // Green color for online status
              offset={[-5, 40]} // Position the badge
              dot
            >
              <Avatar
                size={48}
                src={user?.avatar} // Replace with user profile image URL
                icon={<UserOutlined />}
                alt="Profile Picture"
              />
            </Badge>

            {/* Name with Dropdown */}
            <Dropdown
              menu={{
                items: [
                  {
                    label: <Link href={'/settings/general'}>Profile</Link>,
                    key: '1',
                  },
                  {
                    label: (
                      <Link href={'#'} onClick={logoutHandler}>
                        Logout
                      </Link>
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
                  title={user?.name || 'N/A'}
                  className="text-[16px] font-semibold"
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
