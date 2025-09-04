import React from 'react';

// Component imports
import CustomButton from './heading/button';
import  SelectComponent  from './heading/SelectComponent';
import { DownOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown } from 'antd';
import SenaryHeading from './heading/senaryHeading';
import dollar from "../images/dollar-circle.svg";
import message from "../images/message-question.svg";

const Navbar = ({ user }) => {
  // Placeholder for plan features, UI preserved without logic
  const planFeatures = [];

  // Simplified menu items without navigation logic
  const menuItems = [
    {
      label: <span className="text-xs">Dashboard</span>,
      value: 'dashboard',
    },
    {
      label: <span className="text-xs">Projects</span>,
      value: 'projects',
    },
    {
      label: <span className="text-xs">Settings</span>,
      value: 'settings',
    },
  ];

  return (
    <nav className="py-3 px-16 md:h-[60px] md:flex flex-col shadow-lg md:flex-row items-center justify-between w-full bg-white">
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
            }}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="flex items-center gap-3 my-2">
          
          <div className="border-[#E0E1E1] border bg-[white] py-2.5 px-3 rounded-md">
            <img
              src={message}
              alt="support icon"
              width={24}
              height={24}
              className="active:scale-105 cursor-pointer"
            />
          </div>
          <div className="border-[#E0E1E1] border bg-[white] py-2.5 px-3 rounded-md">
            <img
              src={dollar}
              alt="currency icon"
              width={24}
              height={24}
              className="active:scale-105 cursor-pointer"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge
              color="#52c41a"
              offset={[-5, 40]}
              dot
            >
              <Avatar
                size={48}
                src={user?.data?.avatar}
                icon={<UserOutlined />}
                alt="Profile Picture"
              />
            </Badge>
            <Dropdown
              menu={{
                items: [
                  {
                    label: <span>Profile</span>,
                    key: '1',
                  },
                  {
                    label: <span>Account</span>,
                    key: '2',
                  },
                ],
              }}
              trigger={[]}
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
                  title={user?.data?.name || 'N/A'}
                  className="text-[18px] font-semibold"
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