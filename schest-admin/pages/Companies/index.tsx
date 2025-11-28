import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { Dropdown, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// module imports
import { bg_style } from 'src/components/TailwindVariables';
import { userService } from 'src/services/user.service';
import { useSelector } from 'react-redux';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';

interface DataType {
  company: string;
  email: string;
  phone: string;
  address: string;
  isActive: string;
  status: string;
  action: string;
}

const Companies = () => {
  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  const [isLoading, setisLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [pagination] = useState({
    page: 1,
    limit: 9,
  });

  const fetchedUsers = useCallback(async () => {
    let result = await userService.httpGetAdminUsers(
      pagination.page,
      pagination.limit
    );
    setisLoading(false);
    setUsersData(result.data.users);
  }, []);

  useEffect(() => {
    fetchedUsers();
  }, []);

  const items = (type: string): MenuProps['items'] => [
    {
      key: type === 'block' ? 'unBlock' : 'block',
      label: <a href="#">{type === 'block' ? 'UnBlock' : 'Block'}</a>,
    },
    {
      key: 'delete',
      label: <a href="#">Delete</a>,
    },
  ];

  const handleDropdownItemClick = async (key: string, user: any) => {
    if (key == 'block') {
    } else if (key === 'unBlock') {
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Company Name',
      dataIndex: 'name',
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
    },
    {
      title: 'Subscription Type',
      dataIndex: 'activeSubscription',
      render: (text, record) => 'Stripe',
    },
    {
      title: 'Subscription Level',
      dataIndex: 'isActive',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (text, record) => {
        return (
          <Dropdown
            menu={{
              items: items(record.isActive),
              onClick: (event) => {
                const { key } = event;
                handleDropdownItemClick(key, record);
              },
            }}
            placement="bottomRight"
          >
            <div className="flex justify-center">
              <img
                src="/assets/icons/menuIcon.svg"
                alt="logo white icon"
                className="active:scale-105 cursor-pointer"
              />
            </div>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <section className="mt-6 mb-[39px] md:ms-[69px] md:me-[59px] mx-4 rounded-xl ">
      <div className={`${bg_style} p-5 border border-solid border-silverGray`}>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={usersData}
          pagination={{ position: ['bottomCenter'] }}
        />
      </div>
    </section>
  );
};

export default Companies;
