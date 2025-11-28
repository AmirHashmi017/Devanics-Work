import { DatePicker } from 'antd';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-toastify';
import CustomButton from 'src/components/CustomButton/button';
import ModalComponent from 'src/components/modal';
import { Popups } from 'src/pages/Bid-Management/components/Popups';
import { userService } from 'src/services/user.service';

type Props = {
  id: string;
  children: React.ReactNode;
};
export function ExtendSubscription({ id, children }: Props) {
  const [showManagePackage, setManagePackage] = useState(false);
  const [extendedDays, setExtendedDays] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleExtendDays = async (id: string, extendedDays: number) => {
    setLoading(true);
    try {
      const response = await userService.httpExtendUserActiveSubscription(
        id,
        extendedDays
      );
      if (response.data) {
        toast.success('User Subscription Extended Successfully');
        setManagePackage(false);
        setExtendedDays(0);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <ModalComponent open={showManagePackage} setOpen={setManagePackage}>
        <Popups title="Manage Package" onClose={() => setManagePackage(false)}>
          <div className="h-[300px] flex flex-col justify-between">
            <div className="flex  justify-between">
              <DatePicker.RangePicker
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    // show total days
                    const end = dates[0];
                    const start = dates[1];
                    const diff = moment(start.format('YYYY-MM-DD')).diff(
                      moment(end.format('YYYY-MM-DD')),
                      'days'
                    );
                    setExtendedDays(diff);
                  }
                }}
                disabledDate={(curr) => {
                  return curr && curr < dayjs().subtract(1, 'days');
                }}
              />

              <div className="px-4 py-2.5 border text-xs font-semibold text-schestiPrimaryBlack border-[#D0D5DD] rounded-md">
                {extendedDays} {extendedDays > 1 ? 'Days' : 'Day'}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <CustomButton
                text="Extend Package"
                className="!w-fit"
                onClick={() => handleExtendDays(id, extendedDays)}
                isLoading={loading}
              />
            </div>
          </div>
        </Popups>
      </ModalComponent>

      <span
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setManagePackage(true);
        }}
      >
        {children}
      </span>
    </div>
  );
}
