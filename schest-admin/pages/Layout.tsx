import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Tabs from '../components/Tabs';
import { useLayoutEffect, useState } from 'react';
import { AppSidebar } from 'src/components/Sidebar';
import { useSelector } from 'react-redux';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';

const HOVERED_MARGIN_LEFT = 'ml-[240px]';
const UNHOVERED_MARGIN_LEFT = 'ml-[80px]';
const Layout = () => {
  const [collapsed, setCollapsed] = useState(true);

  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="flex h-screen relative">
      <AppSidebar isOpened={collapsed} toggleCollapsed={toggleCollapsed} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          collapsed ? HOVERED_MARGIN_LEFT : UNHOVERED_MARGIN_LEFT
        }`}
      >
        <Navbar />
        {/* <Tabs /> */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
