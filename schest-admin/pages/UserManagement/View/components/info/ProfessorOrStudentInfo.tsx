import { Switch } from 'antd';
import { Country, State } from 'country-state-city';
import moment from 'moment';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import { IGetUserDetail } from 'src/services/user.service';
import {
  getPlanFromUserSubscription,
  getSubscriptionFromUserData,
} from '../../utils';

type Props = {
  data: IGetUserDetail;
};
export function ProfessorOrStudentInfo({ data }: Props) {
  const userSubscription = getSubscriptionFromUserData(data.subscriptions);
  const userPlan = getPlanFromUserSubscription(data.plans, userSubscription);

  return (
    <div className="mt-5 grid grid-cols-4 p-5 gap-8">
      <div className="space-y-1">
        <SenaryHeading
          title="University Name"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={data.university}
          className="text-schestiPrimaryBlack font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="Phone Number"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={data.phone}
          className="text-schestiPrimaryBlack font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="Email"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={data.email}
          className="text-schestiPrimary font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="Subscription Level"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={userPlan ? userPlan.type : '-'}
          className="text-schestiPrimaryBlack capitalize font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="Subscription Type"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={userPlan ? userPlan.planName : '-'}
          className="text-schestiPrimaryBlack capitalize font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="Expiry Date"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={
            userSubscription && userSubscription.status === 'active'
              ? moment(userSubscription.currentPeriodEnd).format('MMM DD, YYYY')
              : '-'
          }
          className="text-schestiPrimaryBlack font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="Joining Date"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={moment(data.createdAt).format('MMM DD, YYYY')}
          className="text-schestiPrimaryBlack font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="Auto Payment"
          className="text-schestiLightBlack font-semibold"
        />

        <Switch checked={data.isAutoPayment} disabled />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="Verification Date"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={
            data.verification
              ? moment(data.verification.date).format('MMM DD, YYYY')
              : 'Not Verified'
          }
          className="text-schestiPrimaryBlack font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="Country"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={
            data.country ? Country.getCountryByCode(data.country)!.name : '-'
          }
          className="text-schestiPrimaryBlack font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="State"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={
            data.state && data.country
              ? State.getStateByCodeAndCountry(data.state, data.country)!.name
              : '-'
          }
          className="text-schestiPrimaryBlack font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="City"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={data.city ? data.city : '-'}
          className="text-schestiPrimaryBlack font-semibold"
        />
      </div>

      <div className="space-y-1">
        <SenaryHeading
          title="Address"
          className="text-schestiLightBlack font-semibold"
        />

        <SenaryHeading
          title={data.address}
          className="text-schestiPrimaryBlack font-semibold"
        />
      </div>
    </div>
  );
}
