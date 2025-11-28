import { Dropdown, Skeleton, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { userService } from 'src/services/user.service';
import type { ColumnsType } from 'antd/es/table';
import { IUserInterface } from 'src/interfaces/authInterfaces/user.interface';
import moment from 'moment';
import { setFetchBlockedUsers } from 'src/redux/social-media/social-media.slice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { fetchBlockedUsers } = useSelector(
    (state: RootState) => state.socialMedia
  );
  const navigate = useNavigate();
  const getPosts = async () => {
    setIsLoading(true);
    const { data } = await userService.httpGetBlockedUsers({
      role: user._id,
      page: 1,
      limit: 9,
    });
    setIsLoading(false);
    setBlockedUsers(data?.users as any);
  };

  useEffect(() => {
    getPosts();
  }, [fetchBlockedUsers]);

  if (isLoading) {
    return <Skeleton />;
  }

  const columns: ColumnsType<IUserInterface> = [
    {
      title: 'Username',
      dataIndex: 'username',
      render(_, { name, organizationName, companyName }) {
        return name || companyName || organizationName;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render(value) {
        return value;
      },
    },

    {
      title: 'Phone',
      dataIndex: 'phone',
      render(value) {
        return value;
      },
    },
    {
      title: 'Subscription Level',
      dataIndex: 'subscription',
      render(value) {
        return value;
      },
    },

    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      render(_, { subscription }) {
        const { current_period_end = 'N/A' } = subscription || {};
        return subscription
          ? moment(
              new Date((current_period_end as number) * 1000).toISOString()
            ).format('DD/MM/YYYY')
          : current_period_end;
      },
    },

    {
      title: 'Status',
      dataIndex: 'status',
      render() {
        return (
          <p className="bg-veryLightPink flex items-center justify-center py-1 px-2 rounded-xl">
            <span className="rounded-full inline-block me-1 bg-cornellRed font-medium text-xs size-1.5 text-riverBed"></span>
            Blocked
          </p>
        );
      },
    },

    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (_, { _id }) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'unblock',
                label: (
                  <p
                    onClick={async () => {
                      const data = await userService.httpUnBlockEmployee(_id);
                      toast.success(data.message);
                      dispatch(setFetchBlockedUsers());
                    }}
                  >
                    Unblock User
                  </p>
                ),
              },
              {
                key: 'view',
                label: (
                  <p onClick={() => navigate(`/user/${_id}`)}>View User</p>
                ),
              },
            ],
          }}
        >
          <div className="flex justify-center">
            <img
              src="/assets/icons/moreOptions.svg"
              className="cursor-pointer h-6 w-6"
              width={20}
              height={20}
              alt="edit"
            />
          </div>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Table
        loading={isLoading}
        columns={columns}
        className="mt-4"
        dataSource={blockedUsers}
        pagination={{ position: ['bottomCenter'] }}
      />
    </div>
  );
};

export default BlockedUsers;
