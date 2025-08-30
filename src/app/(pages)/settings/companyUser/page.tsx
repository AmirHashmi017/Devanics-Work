'use client';
import { useEffect } from 'react';

import { Tabs } from 'antd';

import VerticleBar from '../verticleBar';
import { CompanyUsers } from './components/CompanyUsers';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { CompanyRoles } from './components/CompanyRoles';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { getCompanyRolesThunk } from '@/redux/company-roles/company-roles.thunk';
import { useLocalStorageState } from 'ahooks';

const USERS_TAB = 'Users';
const ROLES_TAB = 'Roles';

const Index = () => {
  const [activeTabKey, setActiveTabKey] = useLocalStorageState<
    string | undefined
  >('company-role-tab', {
    defaultValue: USERS_TAB,
  });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getCompanyRolesThunk({}));
  }, []);

  return (
    <VerticleBar>
      <div className="w-full">
        <TertiaryHeading title="User Managements" />

        <div className="bg-snowWhite rounded-2xl mt-4 shadow-instentWhite py-5 px-6">
          <Tabs
            activeKey={activeTabKey}
            items={[USERS_TAB, ROLES_TAB].map((tab) => {
              return {
                label: (
                  <p
                    className={`text-base font-normal ${activeTabKey === tab ? 'text-schestiPrimary font-semibold ' : 'text-graphiteGray'}`}
                  >
                    {tab}
                  </p>
                ),
                key: tab,
              };
            })}
            onChange={(key) => {
              setActiveTabKey(key);
            }}
          />
          {activeTabKey === 'Users' ? <CompanyUsers /> : null}
          {activeTabKey === 'Roles' ? <CompanyRoles /> : null}
        </div>
      </div>
    </VerticleBar>
  );
};

export default Index;
