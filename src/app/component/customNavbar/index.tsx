import React, { useState } from 'react';
import Navbar from '../navbar/minnavbar';
import { AppSidebar } from '../sidebar';

const HOVERED_MARGIN_LEFT = 'ml-[240px]';
const UNHOVERED_MARGIN_LEFT = 'ml-[80px]';

const CustomNavbar = ({ children }: any) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="flex h-screen relative">
      <AppSidebar isOpened={collapsed} toggleCollapsed={toggleCollapsed} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? HOVERED_MARGIN_LEFT : UNHOVERED_MARGIN_LEFT}`}
      >
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default CustomNavbar;
