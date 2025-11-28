import { IoSearchOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import CustomButton from 'src/components/CustomButton/button';
import { InputComponent } from 'src/components/CustomInput/Input';
import PrimaryHeading from 'src/components/Headings/Primary';
import { Routes } from '../Plans/utils';
import { useEffect, useLayoutEffect, useState } from 'react';
import { IEmailNotification } from 'src/interfaces/email-notification.interface';
import { useSelector } from 'react-redux';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import emailNotifiicationService from 'src/services/email-notifiication.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Dropdown, List } from 'antd';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import moment from 'moment';
import { DeletePopup } from '../Bid-Management/components/DeletePopup';
import ModalComponent from 'src/components/modal';
import { Popups } from '../Bid-Management/components/Popups';
import _ from 'lodash';

export default function EmailNotificationListingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<IEmailNotification | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [data, setData] = useState<{
    total: number;
    notifications: IEmailNotification[];
  }>({
    total: 0,
    notifications: [],
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const navigate = useNavigate();
  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [pagination]);

  async function fetchNotifications() {
    setIsLoading(true);
    try {
      const response = await emailNotifiicationService.httpGetAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <PrimaryHeading title="Email Notifications" className="text-[20px]" />

        <div className="flex items-center space-x-3">
          <div className="w-96">
            <InputComponent
              label=""
              name=""
              type="text"
              placeholder="Search..."
              field={{
                prefix: <IoSearchOutline />,
              }}
            />
          </div>
          <CustomButton
            text="Add Email Notification"
            className="!w-fit py-2.5"
            onClick={() => {
              navigate(Routes.Email_Notification.Create);
            }}
          />
        </div>
      </div>

      {selectedNotification && showDelete ? (
        <DeletePopup
          closeModal={() => {
            setShowDelete(false);
            setSelectedNotification(null);
          }}
          message="Are you sure you want to delete this notification?"
          open={showDelete}
          onConfirm={async () => {
            setIsDeleting(true);
            try {
              const response =
                await emailNotifiicationService.httpDeleteEmailNotification(
                  selectedNotification._id
                );
              if (response.data) {
                toast.success('Email notification deleted successfully');
                setShowDelete(false);
                setSelectedNotification(null);
                setData({
                  ...data,
                  notifications: data.notifications.filter(
                    (item) => item._id !== selectedNotification._id
                  ),
                });
              }
            } catch (error) {
              const err = error as AxiosError<{ message: string }>;
              toast.error(err.response?.data?.message);
            } finally {
              setIsDeleting(false);
            }
          }}
          title="Delete Email Notification"
          isLoading={isDeleting}
        />
      ) : null}

      {showResend && selectedNotification ? (
        <ModalComponent
          open={showResend}
          setOpen={() => {
            setShowResend(false);
            setSelectedNotification(null);
          }}
        >
          <Popups
            title="Resend Email Notification"
            onClose={() => {
              setShowResend(false);
              setSelectedNotification(null);
            }}
          >
            <div className="space-y-3">
              <TertiaryHeading title="Are you sure you want to resend this notification?" />

              <div className="flex justify-end">
                <CustomButton
                  text="Yes, Resend"
                  className="!w-fit"
                  isLoading={isResending}
                  onClick={async () => {
                    setIsResending(true);
                    try {
                      const response =
                        await emailNotifiicationService.httpResendEmailNotification(
                          selectedNotification._id
                        );
                      if (response.data) {
                        toast.success('Email notification resent successfully');
                        setShowResend(false);
                        setSelectedNotification(null);
                      }
                    } catch (error) {
                      const err = error as AxiosError<{ message: string }>;
                      toast.error(err.response?.data?.message);
                    } finally {
                      setIsResending(false);
                    }
                  }}
                />
              </div>
            </div>
          </Popups>
        </ModalComponent>
      ) : null}

      <List
        dataSource={data.notifications}
        pagination={{
          pageSize: pagination.limit,
          current: pagination.page,
          total: data.total,
          onChange: (page) => {
            setPagination({
              page,
              limit: pagination.limit,
            });
          },
          onShowSizeChange(current, size) {
            setPagination({
              page: 1,
              limit: size,
            });
          },
        }}
        loading={isLoading}
        renderItem={(item) => (
          <div className="mt-2 space-y-3  mx-1 rounded-md bg-white shadow p-5">
            <div className="flex justify-between items-center">
              <PrimaryHeading
                title={item.title}
                className="text-[20px] font-semibold"
              />

              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'edit',
                      label: 'Edit',
                      onClick: () => {
                        navigate(
                          `${Routes.Email_Notification.Edit}/${item._id}`
                        );
                      },
                    },
                    {
                      key: 'delete',
                      label: 'Delete',
                      onClick: () => {
                        setShowDelete(true);
                        setSelectedNotification(item);
                      },
                    },
                    {
                      key: 'resend',
                      label: 'Resend',
                      onClick: () => {
                        setShowResend(true);
                        setSelectedNotification(item);
                      },
                    },
                  ],
                }}
              >
                <img
                  src="/assets/icons/menuIcon.svg"
                  className="cursor-pointer"
                  alt=""
                />
              </Dropdown>
            </div>
            <div className="flex items-center space-x-3">
              <TertiaryHeading
                title={moment(item.createdAt).calendar(null, {
                  sameDay: '[Today at] h:mm A',
                  nextDay: '[Tomorrow at] h:mm A',
                  nextWeek: 'dddd [at] h:mm A',
                  lastDay: '[Yesterday at] h:mm A',
                  lastWeek: '[Last] dddd [at] h:mm A',
                  sameElse: 'MMMM Do YYYY, h:mm A',
                })}
                className="text-sm text-[#98A2B3] font-normal"
              />

              <div className="flex space-x-1 items-center ">
                <TertiaryHeading
                  title="Target User:"
                  className="text-sm text-[#98A2B3] font-normal"
                />
                <TertiaryHeading
                  title={item.roles.join(', ')}
                  className="text-sm capitalize font-semibold"
                />
              </div>
            </div>
            <TertiaryHeading
              title={_.truncate(item.message, {
                length: 30,
              })}
              className="text-base font-normal text-schestiPrimaryBlack whitespace-pre"
            />
          </div>
        )}
      />
    </div>
  );
}
