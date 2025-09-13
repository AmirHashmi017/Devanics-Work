import type { MenuProps } from 'antd';

export const myPostOptions: MenuProps['items'] = [
  {
    key: 'edit',
    label: <p>Edit</p>,
  },
  {
    key: 'delete',
    label: <p>Delete</p>,
  },
];

export const postOptions: MenuProps['items'] = [
  {
    key: 'delete',
    label: <p>Delete</p>,
  },
];
