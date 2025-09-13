'use client';

import React, { useEffect } from 'react';
import Posts from './components/post';
import { setPostData } from '@/redux/social-media/social-media.slice';
import { useDispatch } from 'react-redux';
import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import MyPosts from './components/post/MyPosts';
import Setttings from './components/Setting';
import dynamic from 'next/dynamic';
import { withAuth } from '@/app/hoc/withAuth';

const CreatePost = dynamic(() => import('./components/post/CreatePost'), {
  ssr: false,
});

const SocialMedia = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPostData(null));
  }, []);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Schesti Feeds',
      children: (
        <>
          <CreatePost />
          <Posts />
        </>
      ),
    },
    {
      key: '2',
      label: 'My Feeds',
      children: <MyPosts />,
    },
    {
      key: '3',
      label: 'Settings',
      children: <Setttings />,
    },
  ];

  return (
    <section className="my-4 mx-8 px-4 gap-6">
      <h6 className="text-lg font-semibold text-graphiteGray">Social Media</h6>
      <Tabs destroyInactiveTabPane defaultActiveKey="1" items={items} />
    </section>
  );
};

export default withAuth(SocialMedia);
