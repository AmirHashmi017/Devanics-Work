'use client';
import { useEffect, useCallback, useState } from 'react';
import { Tabs } from 'antd';
import { useDispatch } from 'react-redux';

// module imports
import { AppDispatch } from '@/redux/store';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { bg_style } from '@/globals/tailwindvariables';
import { fetchSettingTargets } from '@/redux/company/settingSlices/setting.thunk';
import SettingSidebar from '../verticleBar';
import AddSubcategory from './Subcategory/page';
import AddCategory from './Category/page';
import { withAuth } from '@/app/hoc/withAuth';

export interface DataType {
  categoryId: string;
  companyName: string;
  _id: string;
  action: string;
}
const CATEGORY_TAB = 'Category';
const SUBCATEGORY_TAB = 'Sub Category';

const CategoriesTable = () => {
  const [activeTab, setActiveTab] = useState(CATEGORY_TAB);

  const dispatch = useDispatch<AppDispatch>();

  const fetchSettingTargetsHandler = useCallback(async () => {
    await dispatch(fetchSettingTargets({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    fetchSettingTargetsHandler();
  }, []);

  return (
    <SettingSidebar>
      <section className={`${bg_style} p-5 w-full`}>
        <TertiaryHeading title="Category Setup" className="text-graphiteGray" />
        <Tabs
          className="mt-2"
          destroyInactiveTabPane
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={[CATEGORY_TAB, SUBCATEGORY_TAB].map((name) => {
            return {
              key: name,
              label:
                activeTab === name ? (
                  <p className="text-schestiPrimary">{name}</p>
                ) : (
                  <p className="text-schestiPrimaryBlack">{name}</p>
                ),
              children:
                activeTab === CATEGORY_TAB ? (
                  <AddCategory />
                ) : activeTab === SUBCATEGORY_TAB ? (
                  <AddSubcategory />
                ) : null,
            };
          })}
        />
      </section>
    </SettingSidebar>
  );
};

export default withAuth(CategoriesTable);
