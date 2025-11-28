import { DatePicker } from 'antd';
import { AxiosError } from 'axios';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-toastify';
import CustomButton from 'src/components/CustomButton/button';
import WhiteButton from 'src/components/CustomButton/white';
import ModalComponent from 'src/components/modal';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { IUserInterface } from 'src/interfaces/authInterfaces/user.interface';
import { Popups } from 'src/pages/Bid-Management/components/Popups';
import { IGetUserDetail, userService } from 'src/services/user.service';
import { date } from 'yup';
import { ExtendSubscription } from '../../components/ExtendSubscription';

type Props = {
  data: IGetUserDetail;
  onUpdate(data: IUserInterface): void;
};
export function ViewUserInfoHeader({ data, onUpdate }: Props) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUnVerifying, setIsUnVerifying] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [showManagePackage, setManagePackage] = useState(false);
  const [extendedDays, setExtendedDays] = useState(0);

  const handleVerify = async (id: string) => {
    setIsVerifying(true);
    try {
      const response = await userService.httpVerifyUser(id);
      if (response.data) {
        onUpdate(response.data);
        toast.success('User verified successfully');
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelVerify = async (id: string) => {
    setIsUnVerifying(true);
    try {
      const response = await userService.httpUnverifyUser(id);
      if (response.data) {
        onUpdate(response.data);
        toast.success('User verification canceled successfully');
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setIsUnVerifying(false);
    }
  };

  const handleAcceptInvite = async (id: string) => {
    setIsAccepting(true);
    try {
      const response = await userService.httpAcceptStudentOrProfessor(id);
      if (response.data) {
        onUpdate(response.data);
        toast.success('User accepted successfully');
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="ml-32 flex items-center justify-between p-2">
      <div className="space-y-2">
        <p className="text-3xl text-schestiPrimaryBlack font-semibold">
          {data.userRole !== USER_ROLE_ENUM.PROFESSOR &&
          data.userRole !== USER_ROLE_ENUM.STUDENT
            ? data.companyName || data.organizationName
            : data.name}
        </p>

        <p className="px-3 py-2 rounded-full text-center w-fit text-schestiPrimary bg-schestiLightPrimary capitalize">
          {data.userRole}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {(data.userRole === USER_ROLE_ENUM.PROFESSOR ||
          data.userRole === USER_ROLE_ENUM.STUDENT) &&
          data.isActive === 'pending' && (
            <>
              <WhiteButton
                text="Accept"
                className="!w-fit !border-schestiSuccess !bg-transparent !text-schestiSuccess"
                isLoading={isAccepting}
                onClick={() => handleAcceptInvite(data._id)}
              />
            </>
          )}
        {data.userRole !== USER_ROLE_ENUM.PROFESSOR &&
        data.userRole !== USER_ROLE_ENUM.STUDENT &&
        !data.verification ? (
          <>
            {' '}
            <WhiteButton
              text="Verify"
              className="!w-fit"
              loadingText="Verifying..."
              isLoading={isVerifying}
              onClick={() => handleVerify(data._id)}
            />
          </>
        ) : (
          <WhiteButton
            text="Cancel Verification"
            className="!w-fit"
            loadingText="Canceling..."
            isLoading={isUnVerifying}
            onClick={() => handleCancelVerify(data._id)}
          />
        )}

        {data.subscription ? (
          <ExtendSubscription id={data._id}>
            <CustomButton
              text="Manage Package"
              className="!w-fit"
              onClick={() => setManagePackage(true)}
            />
          </ExtendSubscription>
        ) : null}
      </div>
    </div>
  );
}
