import { Dropdown, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { Routes } from 'src/pages/Plans/utils';
import { IActiveUserResponse, userService } from 'src/services/user.service';
import { exportToCSV } from 'src/utils/downloadFile';
import { ExtendSubscription } from '../ExtendSubscription';
import { DeleteContent as BlockContent } from 'src/components/deleteConfirmation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import ModalComponent from 'src/components/customModal';
import { UserManagementEmailTemplate } from '../EmailTemplate';

type DataType = IActiveUserResponse['users'][0];

type Props = {
  role: USER_ROLE_ENUM;
  search: string;

  selectedRowKeys: string[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<string[]>>;
};
export const UserManagementVerificationRequestTable = forwardRef<
  {
    handleExport: () => void;
  },
  Props
>(({ role, search, selectedRowKeys, setSelectedRowKeys }, ref) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DataType | null>(null);
  const [data, setData] = useState<IActiveUserResponse>({
    count: 0,
    users: [],
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    getUsers();
  }, [pagination, role]);

  async function getUsers() {
    setLoading(true);
    try {
      const response = await userService.httpGetUsersWithVerificationRequest({
        ...pagination,
        role,
      });
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.log('Error while fetching active users');
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Company Name',
      render(value, record, index) {
        if (!record) return null;
        return record.companyName || record.organizationName;
      },
    },

    {
      title: 'Name',
      dataIndex: 'name',
    },

    {
      title: 'Email',
      dataIndex: 'email',
    },

    {
      title: 'Phone',
      dataIndex: 'phone',
    },

    {
      title: 'Request Date',
      dataIndex: 'createdAt',
      render(value) {
        return value ? moment(value).format('YYYY-MM-DD') : null;
      },
    },

    {
      title: 'Subscription Level',
      dataIndex: 'planId',
      render(value: DataType['planId']) {
        if (!value || typeof value === 'string') {
          return null;
        }
        return <p className="capitalize">{value.type}</p>;
      },
    },
    {
      title: 'Expiry Date',
      dataIndex: 'subscription',
      render(value: DataType['subscription']) {
        if (value && value.status === 'active') {
          return moment(value.currentPeriodEnd).format('DD/MM/YYYY');
        }
        return null;
      },
    },
    {
      title: 'Action',
      render(value, record, index) {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'extend',
                  label: (
                    <ExtendSubscription id={record._id}>
                      <span>Extend Package</span>
                    </ExtendSubscription>
                  ),
                },
                { key: 'view', label: 'View' },
                { key: 'email', label: 'Email' },
                { key: 'block', label: 'Block' },
              ],
              onClick: ({ key }) => {
                if (key === 'view') {
                  navigate(
                    `${Routes.User_Management.View_Info}?id=${record._id}`
                  );
                } else if (key === 'block') {
                  setShowBlockModal(true);
                  setSelectedRow(record);
                }
              },
            }}
          >
            <img
              src={'/assets/icons/menuIcon.svg'}
              alt="logo white icon"
              className="active:scale-105 cursor-pointer text-lg text-center mx-auto"
            />
          </Dropdown>
        );
      },
    },
  ];

  const filteredData = data.users.filter((user) => {
    if (!search) {
      return true;
    }
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.toLowerCase().includes(search.toLowerCase()) ||
      user.companyName.toLowerCase().includes(search.toLowerCase()) ||
      user.organizationName?.lowerCase().includes(search.toLowerCase())
    );
  });

  const roleBasedColumns =
    role === USER_ROLE_ENUM.STUDENT || role === USER_ROLE_ENUM.PROFESSOR
      ? columns.map((column, idx) => {
          if (idx === 0) {
            return {
              ...column,
              title: 'University Name',
              dataIndex: 'university',
              render: (value: string) => <p>{value}</p>,
            };
          }
          return column;
        })
      : columns;

  useImperativeHandle(ref, () => ({
    handleExport: () =>
      exportToCSV(data.users, roleBasedColumns, 'Verification Request Users'),
  }));

  return (
    <>
      {showBlockModal && selectedRow ? (
        <ModalComponent open={showBlockModal} setOpen={setShowBlockModal}>
          <BlockContent
            onClick={async () => {
              setIsBlocking(true);
              try {
                const response = await userService.httpBlockUser(
                  selectedRow._id
                );
                if (response.data) {
                  setData({
                    ...data,
                    users: data.users.filter(
                      (user) => user._id !== selectedRow._id
                    ),
                  });
                  toast.success('User blocked successfully');
                  setShowBlockModal(false);
                }
              } catch (error) {
                const err = error as AxiosError<{ message: string }>;
                toast.error(err.response?.data.message);
              } finally {
                setIsBlocking(false);
              }
            }}
            onClose={() => setShowBlockModal(false)}
            description="Are you sure you want to block this user?"
            okText="Block"
            title="Block User"
            isLoading={isBlocking}
          />
        </ModalComponent>
      ) : null}

      {selectedRow && showEmailModal ? (
        <ModalComponent
          open={showEmailModal}
          setOpen={setShowEmailModal}
          width="600px"
        >
          <UserManagementEmailTemplate
            setEmailModal={setShowEmailModal}
            submitHandler={() => {}}
            to={selectedRow.email}
            title="Send Email"
            isDisabledTo
          />
        </ModalComponent>
      ) : null}

      <Table
        columns={roleBasedColumns}
        bordered
        dataSource={filteredData}
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          total: data.count,
          current: pagination.page,
          onChange(page, pageSize) {
            setPagination({ ...pagination, page, limit: pageSize });
          },
          showSizeChanger: true,
          pageSize: pagination.limit,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) =>
            setSelectedRowKeys(selectedRowKeys as string[]),
        }}
        rowKey={(row) => row.email}
      />
    </>
  );
});
