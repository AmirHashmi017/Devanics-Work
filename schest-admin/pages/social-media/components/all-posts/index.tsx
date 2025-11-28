import { Tabs, TabsProps } from 'antd';
import CreatePost from '../post/CreatePost';
import SchestiPosts from '../post';
import MyPosts from '../post/MyPosts';
import DeletedPosts from '../post/DeletedPosts';
import NoPostData from '../post/NoData';
import Setttings from '../Setting';

const AllPosts = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Schesti Feeds',
      children: (
        <>
          <CreatePost />
          <SchestiPosts />
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
      label: 'Deleted Posts',
      children: <DeletedPosts />,
    },
    {
      key: '4',
      label: 'Settings',
      children: <Setttings />,
    },
  ];

  return <Tabs destroyInactiveTabPane defaultActiveKey="1" items={items} />;
};

export default AllPosts;
