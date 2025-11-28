import { useSearchParams } from 'react-router-dom';
import { UserManagementLayout } from '../components/UserManagementPageLayout';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import PrimaryHeading from 'src/components/Headings/Primary';
import { GetUserForm } from './forms';
import { useCallback, useEffect } from 'react';
import { AppDispatch } from 'src/redux/store';
import { useDispatch } from 'react-redux';
import { fetchPricingPlan } from 'src/redux/pricingPlanSlice/pricingPlan.thunk';

export function UserManagementAddUser() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const role = searchParams.get('role') as USER_ROLE_ENUM;

  const pricingPlansHandler = useCallback(async () => {
    const {
      payload: {
        statusCode,
        data: { pricingPlans },
      },
    }: any = await dispatch(fetchPricingPlan({ page: 1, limit: 10 }));
  }, []);

  useEffect(() => {
    pricingPlansHandler();
  }, [pricingPlansHandler]);

  return (
    <UserManagementLayout>
      <div className="">
        {Object.values(USER_ROLE_ENUM).includes(role) ? (
          <div className="">
            <PrimaryHeading
              title={`Add New ${role}`}
              className="text-[20px] capitalize text-schestiPrimaryBlack"
            />
          </div>
        ) : null}

        <GetUserForm role={role} />
      </div>
    </UserManagementLayout>
  );
}
