'use client';

import React, { useState } from 'react';
import SettingSidebar from '../verticleBar';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { Tabs } from 'antd';
import MySubscription from './me';
import Plans from './plans';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { IUser } from '@/app/interfaces/companyEmployeeInterfaces/user.interface';
import { withAuth } from '@/app/hoc/withAuth';
import { SubscriptionHistory } from './history';

const My_Subscription_Tab = 'My Subscription';
const Plans_Tab = 'Plans';
const Subscription_History_Tab = 'Subscription History';

const SettingPlans = () => {
  const [activeTab, setActiveTab] = useState<string>(My_Subscription_Tab);
  const user = useSelector(
    (state: RootState) => state.auth.user as { user?: IUser }
  );

  return (
    <SettingSidebar>
      <div className="w-full mx-4 p-4 rounded-md mb-4 bg-white">
        <TertiaryHeading title="Plans" className="text-graphiteGray" />
        <Tabs
          defaultActiveKey="My Subscriptions"
          destroyInactiveTabPane
          activeKey={activeTab}
          onChange={(value) => {
            setActiveTab(value);
          }}
          items={[My_Subscription_Tab, Plans_Tab, Subscription_History_Tab].map(
            (type) => {
              return {
                key: type,
                label:
                  type === activeTab ? (
                    <p className="text-schestiPrimary">{type}</p>
                  ) : (
                    <p className="text-schestiPrimaryBlack">{type}</p>
                  ),
                tabKey: type,
                children:
                  activeTab === My_Subscription_Tab ? (
                    <MySubscription
                      onUpgradeClick={() => {
                        setActiveTab(Plans_Tab);
                      }}
                    />
                  ) : activeTab === Plans_Tab ? (
                    <Plans user={user ? user.user : undefined} />
                  ) : activeTab === Subscription_History_Tab ? (
                    <SubscriptionHistory />
                  ) : null,
              };
            }
          )}
        />
      </div>
    </SettingSidebar>
  );
};

export default withAuth(SettingPlans);
