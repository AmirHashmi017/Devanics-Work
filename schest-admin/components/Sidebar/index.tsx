import { ConfigProvider, Menu, MenuProps } from 'antd';
import { Key } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import { HiOutlineClipboardDocumentCheck } from 'react-icons/hi2';
import { TbDeviceDesktopAnalytics } from 'react-icons/tb';
import { BsBuildings } from 'react-icons/bs';
import { RiCoupon3Line } from 'react-icons/ri';
import { AiOutlineTransaction } from 'react-icons/ai';
import { IoTicketOutline } from 'react-icons/io5';
import { NavLink, useLocation } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import { CiDollar } from 'react-icons/ci';
import { NetworkingIcon } from '../../svgs/component-icons/NetworkIcon';
import { SocialIcon } from 'src/svgs/component-icons/SocialIcon';
import { Routes } from 'src/pages/Plans/utils';
import { GiMegaphone } from 'react-icons/gi';
type Props = {
  isOpened: boolean;
  toggleCollapsed: () => void;
};

const HOVERED_WIDTH = 'w-[240px]';
const UNHOVERED_WIDTH = 'w-[80px]';

function collectKeys(items: MenuProps['items']) {
  let keys: Key[] = [];
  if (items && items.length) {
    items.forEach((item) => {
      if (item?.key) {
        keys.push(item.key);
      }
      if (item && 'children' in item) {
        keys = keys.concat(collectKeys(item.children));
      }
    });
  }

  return keys;
}

const tabsData = [
  { name: 'Dashbaord', key: 'dashboard', route: '/', icon: IoHomeOutline },
  {
    name: 'User Management',
    key: 'users',
    route: '',
    icon: BsBuildings,
    children: [
      { name: 'Contractors', route: Routes.User_Management.Contractor },
      { name: 'Sub Contractors', route: Routes.User_Management.Subcontractor },
      { name: 'Owners', route: Routes.User_Management.Owner },
      { name: 'Vendors', route: Routes.User_Management.Vendor },
      { name: 'Architects', route: Routes.User_Management.Architect },
      { name: 'Professor', route: Routes.User_Management.Professor },
      { name: 'Student', route: Routes.User_Management.Student },
    ],
  },
  { name: 'Pricing Plans', key: 'plans', route: '/plans', icon: CiDollar },
  {
    name: 'Ad Managment',
    route: '/ad-managment',
    key: 'ad-managment',
    icon: HiOutlineClipboardDocumentCheck,
  },
  { name: 'Promo Code', route: '/promo-code', icon: RiCoupon3Line },
  {
    name: 'Bid Managment',
    route: '',
    key: 'bid-managment',
    icon: TbDeviceDesktopAnalytics,
    children: [
      { name: 'Posted Projects', route: '/projects' },
      { name: 'Find Projects', route: '/projects/find' },
      { name: 'Reported Projects', route: '/projects/reported' },
    ],
  },
  {
    name: 'Transaction History',
    route: '/transactions',
    icon: AiOutlineTransaction,
    key: 'transactions',
  },
  {
    name: 'Support Tickets',
    key: 'support',
    route: '/supportickets',
    icon: IoTicketOutline,
  },
  {
    name: 'Networking',
    route: '/networking',
    key: 'networking',
    icon: NetworkingIcon,
  },
  {
    name: 'Social Media',
    route: '/social-media',
    key: 'social-media',
    icon: SocialIcon,
  },
  {
    name: 'Email Notification',
    route: '/email-notification',
    key: 'email-notification',
    icon: GiMegaphone,
  },
];

export function AppSidebar({ isOpened, toggleCollapsed }: Props) {
  const authUser = useSelector(
    (state: RootState) => state.auth.user as { user?: any }
  );
  const { pathname } = useLocation();

  let menuItems: MenuProps['items'] = tabsData.map((item) => ({
    icon: <item.icon size={18} />,
    label: item.route.length ? (
      <NavLink to={item.route}>{item.name}</NavLink>
    ) : (
      item.name
    ),
    key: item.key!,
    children: item.children?.map((child) => ({
      key: child.route,
      label: <NavLink to={child.route}>{child.name}</NavLink>,
    })),
  }));
  const allKeys = collectKeys(menuItems);
  const activeKeys = allKeys
    .map((key) => key.toString())
    .filter((key) => {
      return (
        pathname === key.toString() ||
        (pathname.includes(key.toString()) && key.toString() !== '/')
      );
    });

  return (
    <div
      className={`fixed h-full bg-schestiPrimary transition-all duration-300 ease-in-out ${
        isOpened ? HOVERED_WIDTH : UNHOVERED_WIDTH
      }`}
    >
      {/* Logo */}
      <div className="flex justify-center mt-4">
        <img
          src={'/assets/icons/sidebar-logo.svg'}
          alt="Schest Logo"
          height={20}
          className={'px-1'}
        />
      </div>

      {/* Toggle Button */}
      <div
        onClick={toggleCollapsed}
        className="absolute border bg-white rounded-full px-3 py-2 top-12 -right-3 cursor-pointer"
      >
        {isOpened ? (
          <MenuUnfoldOutlined className=" text-lg text-schestiPrimary" />
        ) : (
          <MenuFoldOutlined className=" text-lg text-schestiPrimary" />
        )}
      </div>

      {/* Navigation */}
      <div className="mt-14 w-full">
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemBg: '#007AB6',
                itemColor: 'white',
                fontWeightStrong: 600,

                itemSelectedBg: 'white',
                itemHoverBg: '#FFFFFF17',
                itemHoverColor: 'white',

                itemSelectedColor: '#007AB6',
                itemActiveBg: '#FFFFFF',

                popupBg: '#007AB6',

                // colorItemBgSelected: "#fff",
                // controlItemBgActive: "#fff",
              },
            },
          }}
        >
          <Menu
            inlineCollapsed={!isOpened}
            mode="vertical"
            // if user not authenticated then don't show sidebar
            items={!authUser?.user?._id ? [] : menuItems}
            triggerSubMenuAction="click"
            selectedKeys={activeKeys}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
