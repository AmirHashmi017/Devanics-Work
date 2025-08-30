import Image from 'next/image';
import { useDispatch } from 'react-redux';
import type { ColumnsType } from 'antd/es/table';
import { Dropdown, Table, type MenuProps } from 'antd';
import { AppDispatch } from '@/redux/store';
import moment from 'moment';

// module imports
import { DeleteContent } from '@/app/component/delete/DeleteContent';
import ModalComponent from '@/app/component/modal';
import Button from '@/app/component/customButton/button';
import { fetchUsers } from '@/redux/userSlice/user.thunk';
import { setCurrentUser } from '@/redux/userSlice/user.slice';
import { useCallback, useEffect, useState } from 'react';
import AddNewUser from '../addCompanyUser';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { userService } from '@/app/services/user.service';
import { toast } from 'react-toastify';

interface DataType extends IUserInterface {}

const items: MenuProps['items'] = [
  {
    key: 'edit',
    label: <a href="#">Edit</a>,
  },
  {
    key: 'delete',
    label: <p>Delete</p>,
  },
];
export function CompanyUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState('');
  const [userData, setUserData] = useState<IUserInterface[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserInterface | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Invite User
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);

  const fetchCompanyEmployeeHandler = useCallback(async () => {
    let result: any = await dispatch(fetchUsers({ limit: 9, page: 1 }));

    setUserData(
      result.payload?.data?.employees
      // .filter((u: any) => !u.roles.includes('Subcontractor'))
      // .map((user: any) => {
      //     return {
      //         _id: user._id,
      //         name: `${user.firstName} ${user.lastName}`,
      //         email: user.email,
      //         roles: user.roles,
      //         invitationDate: moment(user.createdAt).format('ll'),
      //     };
      // })
    );
  }, []);

  const deleteCompanyEmployeeHandler = async (id: string) => {
    setIsDeletingUser(true);
    try {
      const response = await userService.httpDeleteUser(id);
      if (response.data) {
        setUserData(userData.filter((user) => user._id !== response.data?._id));
        toast.success('user deleted successfully');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    } finally {
      setIsDeletingUser(false);
    }
  };

  useEffect(() => {
    fetchCompanyEmployeeHandler();
  }, []);

  const handleDropdownItemClick = async (key: string, user: any) => {
    if (key === 'edit') {
      setShowInviteUserModal(true);
      setSelectedUser(user);
    } else if (key === 'delete') {
      setShowDeleteModal(true);
      setSelectedUser(user);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      render(_value, record) {
        return record.firstName && record.lastName
          ? `${record.firstName} ${record.lastName}`
          : record.name;
      },
    },

    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      render: (text, records): any => {
        return records.roles
          ? records.roles.map((role) => {
              if (typeof role === 'string') {
                return null;
              }
              return (
                <p
                  key={role._id}
                  className="w-max text-[#027A48] bg-[#ECFDF3] px-2 py-1 rounded-full"
                >
                  {role.name}
                </p>
              );
            })
          : [];
      },
    },
    {
      title: 'Invitation Date',
      dataIndex: 'createdAt',
      render(value) {
        return moment(value).format('ll');
      },
    },

    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (text, record) => (
        <Dropdown
          menu={{
            items,
            onClick: (event) => {
              const { key } = event;
              console.log({ record });
              handleDropdownItemClick(key, record);
            },
          }}
          placement="bottomRight"
        >
          <Image
            src={'/menuIcon.svg'}
            alt="logo white icon"
            width={20}
            height={20}
            className="active:scale-105 cursor-pointer"
          />
        </Dropdown>
      ),
    },
  ];

  const filteredUserData =
    userData.length > 0
      ? userData.filter((user: { name: string; email: string }) => {
          if (!search) {
            return user;
          }
          return (
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
          );
        })
      : [];
  return (
    <div>
      <ModalComponent
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        width="30%"
      >
        <DeleteContent
          onClick={async () => {
            if (selectedUser) {
              await deleteCompanyEmployeeHandler(selectedUser._id);
            }
            setShowDeleteModal(false);
          }}
          onClose={() => setShowDeleteModal(false)}
          isLoading={isDeletingUser}
        />
      </ModalComponent>

      <ModalComponent
        open={showInviteUserModal}
        setOpen={setShowInviteUserModal}
        title="Add User"
      >
        <AddNewUser
          onCancel={() => {
            setShowInviteUserModal(false);
            setSelectedUser(null);
          }}
          onSuccess={(user) => {
            setShowInviteUserModal(false);
            if (selectedUser) {
              // update the user
              setUserData(
                userData.map((u) => {
                  if (u._id === selectedUser._id) {
                    return user;
                  }
                  return u;
                })
              );
            } else {
              setUserData([user, ...userData]);
            }
          }}
          user={selectedUser}
        />
      </ModalComponent>

      <div className="flex justify-between items-center mb-3">
        <div
          className="rounded-lg border border-Gainsboro
                      w-[464px] h-[40px] 
                      my-5 flex items-center gap-2 px-3.5 py-2.5"
        >
          <Image
            src={'/search.svg'}
            alt="search icon "
            width={16}
            height={16}
            className="cursor-pointer"
          />
          <input
            type="search"
            name=""
            id=""
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full bg-transparent outline-none"
          />
        </div>
        <Button
          text="Invite new user"
          className="!w-auto "
          icon="/plus.svg"
          iconwidth={20}
          iconheight={20}
          onClick={() => {
            dispatch(setCurrentUser(null));
            setShowInviteUserModal(true);
          }}
        />
      </div>
      <article>
        <Table
          columns={columns}
          dataSource={filteredUserData}
          pagination={{ position: ['bottomCenter'] }}
        />
      </article>
    </div>
  );
}
