/* eslint-disable @typescript-eslint/no-unused-vars */
import { DailyWorkForm } from '@/app/(pages)/daily-work/components/DailyWorkForm';
import { DisplayPriority } from '@/app/(pages)/daily-work/components/DisplayPriority';
import { DisplayDailyWorkStatus } from '@/app/(pages)/daily-work/components/DisplayStatus';
import CustomButton from '@/app/component/customButton/button';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import {
  IDailyWorkPriorty,
  IDailyWorkStatus,
} from '@/app/interfaces/crm/crm-daily-work.interface';
import crmDailyWorkService, {
  ICrmDailyWorkCreate,
} from '@/app/services/crm/crm-daily-work.service';
import { getRangeFromDateString } from '@/app/utils/date.utils';
import { AppDispatch } from '@/redux/store';
import { useUserDashboardSelector } from '@/redux/user-dashboard/user-dashboard.selector';
import { pushDailyWorkAction } from '@/redux/user-dashboard/user-dashboard.slice';
import { getUserDashboardDailyWorkLeadsThunk } from '@/redux/user-dashboard/user-dashboard.thunk';
import { LoadingOutlined } from '@ant-design/icons';
import { Select, Spin, Timeline, Tooltip } from 'antd';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const ValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email'),
  phone: Yup.string().test({
    test: (value) => {
      if (value) {
        return isValidPhoneNumber(value);
      }
      return true;
    },
    message: 'Invalid phone number',
  }),
  work: Yup.string().required('Work Needed is required'),
  deadline: Yup.string(),
  note: Yup.string(),
});

export function DashboardDailyManagement() {
  const { dailyLeads } = useUserDashboardSelector();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statuses, setStatuses] = useState<IDailyWorkStatus[]>([]);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [priorities, setPriorities] = useState<IDailyWorkPriorty[]>([]);
  const [isPriorityLoading, setIsPriorityLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUserDashboardDailyWorkLeadsThunk());
  }, []);

  const formik = useFormik<ICrmDailyWorkCreate>({
    initialValues: {
      email: '',
      phone: '',
      work: '',
      deadline: '',
      note: '',
      status: '',
      priority: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      createDailyWorkLead(values);
    },
    enableReinitialize: true,
  });
  useEffect(() => {
    getDailyWorkStatus();
    getDailyWorkPriorities();
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  async function createDailyWorkLead(values: ICrmDailyWorkCreate) {
    setIsSubmitting(true);
    try {
      const response = await crmDailyWorkService.httpCreateDailyWork(values);
      if (response.data) {
        toast.success('Daily work created successfully');
        dispatch(pushDailyWorkAction(response.data));
        setOpen(false);
        formik.resetForm();
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function getDailyWorkStatus() {
    setIsStatusLoading(true);
    crmDailyWorkService
      .httpGetAllDailyWorkStatus()
      .then((response) => {
        if (response.data) {
          setStatuses(response.data);
        }
      })
      .finally(() => {
        setIsStatusLoading(false);
      });
  }

  async function getDailyWorkPriorities() {
    setIsPriorityLoading(true);
    crmDailyWorkService
      .httpGetAllDailyWorkPriority()
      .then((response) => {
        if (response.data) {
          setPriorities(response.data);
        }
      })
      .finally(() => {
        setIsPriorityLoading(false);
      });
  }

  return (
    <div className="p-4 bg-white border border-schestiLightGray rounded-md space-y-3">
      <div className="flex justify-between items-center">
        <SenaryHeading
          title="Daily Management"
          className="text-sm font-normal"
        />

        <Tooltip title="Daily Management">
          <IoIosInformationCircleOutline className="text-2xl text-schestiLightBlack" />
        </Tooltip>
      </div>

      <div className="flex justify-between items-center">
        <CustomButton
          text="New Task"
          className="!w-fit !py-2 !bg-[#2CA6FF] !border-[#2CA6FF]"
          icon="/plus.svg"
          iconheight={20}
          iconwidth={20}
          onClick={showDrawer}
        />

        <Select
          placeholder="Select period"
          options={[
            { label: 'Last Week', value: 'lastWeek' },
            { label: 'Last Month', value: 'lastMonth' },
            { label: 'Last Year', value: 'lastYear' },
          ]}
          onChange={(value) => {
            const result = getRangeFromDateString(value);
            if (result) {
              dispatch(
                getUserDashboardDailyWorkLeadsThunk([result[0], result[1]])
              );
            } else {
              dispatch(getUserDashboardDailyWorkLeadsThunk());
            }
          }}
          allowClear
        />
      </div>

      <DailyWorkForm
        formik={formik}
        onClose={onClose}
        open={open}
        isSubmitting={isSubmitting}
        onSubmit={formik.handleSubmit}
        priorities={priorities}
        statuses={statuses}
      />

      <div
        style={{
          height: 360,
          overflowY: 'auto',
          padding: 15,
        }}
      >
        <Spin
          spinning={dailyLeads.loading}
          indicator={<LoadingOutlined spin />}
        >
          <Timeline
            items={dailyLeads.data.map((item) => ({
              key: item._id,
              color: 'gray',
              dot: (
                <Image
                  src={'/new-dashboard/timeline-dot.svg'}
                  alt="Timeline dot"
                  width={24}
                  height={24}
                />
              ),
              children: (
                <div className="space-y-2 border-b">
                  <div className="flex justify-between items-center">
                    {!item.status || typeof item.status === 'string' ? null : (
                      <DisplayDailyWorkStatus item={item.status} />
                    )}

                    {!item.priority ||
                    typeof item.priority === 'string' ? null : (
                      <DisplayPriority item={item.priority} />
                    )}
                  </div>

                  <div className="space-y-2 py-3">
                    <SenaryHeading
                      title={item.work}
                      className="text-base font-semibold"
                    />

                    <SenaryHeading
                      title={item.note}
                      className="text-sm font-normal"
                    />
                  </div>
                </div>
              ),
            }))}
          />
        </Spin>
      </div>
    </div>
  );
}
