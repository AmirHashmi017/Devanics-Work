'use client';

import { selectToken } from '@/redux/authSlices/auth.selector';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HttpService } from '../services/base.service';
import { AppDispatch } from '@/redux/store';
import { useQuery } from 'react-query';
import { IResponseInterface } from '../interfaces/api-response.interface';
import { IPricingPlan } from '../interfaces/pricing-plan.interface';
import { AxiosError } from 'axios';
import { usePathname } from 'next/navigation';
import { NoDataComponent } from '../component/noData/NoDataComponent';
import _ from 'lodash';
import { OtherRoutes } from '../utils/plans.utils';
import { useUser } from '../hooks/useUser';
import { Skeleton } from 'antd';
// import { ISubriptionHistory } from '../interfaces/subscription-history.interface';
// import moment from 'moment';
import { useRouterHook } from '../hooks/useRouterHook';
import { authService } from '../services/auth.service';
import { IUserInterface } from '../interfaces/user.interface';
import { logout, setUserAction } from '@/redux/authSlices/authSlice';
import { ISubriptionHistory } from '../interfaces/subscription-history.interface';

export const withAuth = (
  WrappedComponent: React.FunctionComponent,
  requiredRoles: string[] = []
) => {
  const WrappedComponentWithAuth = (props: any) => {
    const token = useSelector(selectToken);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouterHook();
    const pathname = usePathname();
    const user = useUser();
    console.log(user, ' ===> user');
    const userPlan =
      user && user.subscription && user.subscription.planId
        ? (user.subscription.planId as IPricingPlan)
        : '';
    requiredRoles =
      requiredRoles.length > 0 ? _.map(requiredRoles, _.capitalize) : [];
    useLayoutEffect(() => {
      if (token) {
        HttpService.setToken(token);
      }
    }, [token]);

    const query = useQuery<
      IResponseInterface<{ user: IUserInterface }>,
      AxiosError<{ message: string; statusCode: number }>
    >(['user details'], () => authService.httpGetLoggedInUserDetails(), {
      onSuccess(data) {
        if (data.data) {
          dispatch(setUserAction(data.data));
          if (!data.data.user.subscription) {
            router.push('/login');
            dispatch(logout());
            return;
          }
          //  Check if the user subscription is expired
          // const subscription = data.data.user
          //   .subscription as ISubriptionHistory;
          // if (
          //   subscription &&
          //   (subscription.status === 'active' ||
          //     subscription.status === 'trialing')
          // ) {
          //   const endDate =
          //     subscription.status === 'active'
          //       ? subscription.currentPeriodEnd
          //       : subscription.periodEnd;
          //   if (moment().isAfter(moment(endDate))) {
          //     router.push('/login');
          //     return;
          //   }
          // } else {
          //   router.push('/login');
          //   return;
          // }
        }
      },
      onError(err) {
        console.log('User Error', err.response?.data);
        if (err.response && err.response.data.statusCode >= 400) {
          router.push('/login');
          dispatch(logout());
        }
      },
    });

    const userRole = user?.userRole ? user?.userRole : '';

    let employeePermissions: string[] =
      user && user && user.roles
        ? user.roles
            .map((role) => (typeof role !== 'string' ? role.permissions : ''))
            .flat()
        : [];

    const userPlanFeatures = userPlan
      ? userPlan.features.split(',')
      : ([] as string[]);

    // if the query is not loaded, show skeleton
    if (query.isLoading) {
      return <Skeleton />;
    }

    const isEmployee = user?.associatedCompany;

    // const employeeAccessFeatures = _.intersection(
    //   userPlanFeatures,
    //   employeePermissions
    // );

    const employeeAccessFeatures = employeePermissions;

    const canAccessThePage = isEmployee
      ? canAccessRoute(
          pathname,
          employeeAccessFeatures,
          user?.subscription,
          true
        )
      : canAccessRoute(pathname, userPlanFeatures, user?.subscription);
    // const canAccessThePage = true;
    // if the required roles is empty; and there is already and a user with the plan
    if (canAccessThePage && !requiredRoles.length) {
      return <WrappedComponent {...props} />;
    }

    const hasRoles = _.every(
      requiredRoles,
      (role) => userRole.toLowerCase() === role.toLowerCase()
    );

    if (canAccessThePage && hasRoles) {
      return <WrappedComponent {...props} />;
    }

    if (!canAccessThePage && isEmployee && hasRoles) {
      return (
        <NoDataComponent
          title="Access Denied"
          description="You don't have access to this page."
        />
      );
    }

    if (canAccessThePage && !hasRoles) {
      return (
        <NoDataComponent
          title="Access Denied"
          description="You don't have access to this page."
        />
      );
    }

    return (
      <NoDataComponent
        title="Upgrade Your Plan"
        description="You can access the page after upgrade featured plan"
      />
    );
  };

  return WrappedComponentWithAuth;
};
function getAllRoutes(routes: { [key: string]: any } = OtherRoutes): string[] {
  return Object.values(routes).flatMap((route) =>
    typeof route === 'string' ? [route] : Object.values(route)
  );
}
export function canAccessRoute(
  pathname: string,
  userFeatures: string[],
  subscription?: ISubriptionHistory,
  isEmployee: boolean = false
) {
  let isPeriodEnded = false;

  if (
    subscription &&
    (subscription.status === 'active' || subscription.status === 'trialing')
  ) {
    // do nothing
  } else {
    isPeriodEnded = true;
  }

  const allRoutes = isPeriodEnded
    ? getAllRoutes(isEmployee ? {} : OtherRoutes)
    : getAllRoutes(isEmployee ? {} : OtherRoutes).concat(userFeatures);
  if (
    pathname.includes('take-off') &&
    allRoutes.some((route) => route.includes('takeoff'))
  ) {
    console.log(
      allRoutes,
      pathname.includes('take-off'),
      allRoutes.some((route) => route.includes('takeoff')),
      ' ===> user'
    );
    return true;
  }
  const result = allRoutes.some((route) => pathname.includes(route));
  return result;
}
