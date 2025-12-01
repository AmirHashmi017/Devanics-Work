'use client';
import React, { useState } from 'react';
import SettingSidebar from '../verticleBar';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { Tabs } from 'antd';
import MySubscription from './me';
import Plans from './plans';
import { SubscriptionHistory } from './history';
import CountrySelectionModal from '@/app/component/plans/CountrySelectionModal';
import { useCountrySelection } from '@/app/hooks/useCountrySelection';
import { withAuth } from '@/app/hoc/withAuth';

const TABS = {
  MY_SUBSCRIPTION: 'My Subscription',
  PLANS: 'Plans',
  HISTORY: 'Subscription History',
};

const SettingPlans = () => {
  const [activeTab, setActiveTab] = useState(TABS.MY_SUBSCRIPTION);
  const { country, showModal, selectCountry, changeCountry } = useCountrySelection();

  return (
    <>
      {/* Country Selection Modal */}
      <CountrySelectionModal
        open={showModal}
        onSelect={selectCountry}
        onClose={() => {}} // Cannot close without selecting
      />

      <SettingSidebar>
        <div className="w-full mx-4 p-4 rounded-md mb-4 bg-white">
          <div className="flex justify-between items-center mb-6">
            <TertiaryHeading title="Plans" className="text-graphiteGray" />

            {country && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600">
                  Pricing in: <strong>{country.name} ({country.currency})</strong>
                </span>
                <button
                  onClick={changeCountry}
                  className="text-[#007AB6] hover:underline font-medium"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            destroyInactiveTabPane
            items={[
              {
                key: TABS.MY_SUBSCRIPTION,
                label: <span className={activeTab === TABS.MY_SUBSCRIPTION ? 'text-[#007AB6]' : ''}>My Subscription</span>,
                children: <MySubscription onUpgradeClick={() => setActiveTab(TABS.PLANS)} />,
              },
              {
                key: TABS.PLANS,
                label: <span className={activeTab === TABS.PLANS ? 'text-[#007AB6]' : ''}>Plans</span>,
                children: country ? <Plans country={country} /> : <div>Please select your country first.</div>,
              },
              {
                key: TABS.HISTORY,
                label: <span className={activeTab === TABS.HISTORY ? 'text-[#007AB6]' : ''}>Subscription History</span>,
                children: <SubscriptionHistory />,
              },
            ]}
          />
        </div>
      </SettingSidebar>
    </>
  );
};

export default withAuth(SettingPlans);