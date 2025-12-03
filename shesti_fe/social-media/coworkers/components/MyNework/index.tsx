import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Layout from './Layout';

const items: TabsProps['items'] = [
  {
    key: '2',
    label: 'Contractor',
    children: <Layout userRole="contractor" />,
  },
  {
    key: '3',
    label: 'Sub-contractor',
    children: <Layout userRole="subcontractor" />,
  },
  {
    key: '4',
    label: 'Professor',
    children: <Layout userRole="professor" />,
  },
  {
    key: '5',
    label: 'Student',
    children: <Layout userRole="student" />,
  },
  {
    key: '6',
    label: 'Vendor',
    children: <Layout userRole="vendor" />,
  },
  {
    key: '7',
    label: 'Architect',
    children: <Layout userRole="architect" />,
  },
  {
    key: '1',
    label: 'Owner/Client',
    children: <Layout userRole="owner" />,
  },
  // {
  //   key: '8',
  //   label: 'Estimator',
  //   children: <Layout userRole="estimator" />,
  // },
];
const MyNetwork = () => {
  return (
    <Tabs
      defaultActiveKey="1"
      destroyInactiveTabPane
      className="text-slateGray text-sm"
      items={items}
    />
  );
};

export default MyNetwork;
