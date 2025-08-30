import { IPricingPlan } from '../interfaces/pricing-plan.interface';
import { useUser } from './useUser';

export function useUserPlanFeatures() {
  const user = useUser();
  let planFeatures: string[] = [];
  const userPlan =
    user && user.subscription && user.subscription.planId
      ? (user.subscription.planId as IPricingPlan)
      : '';
  if (user && user.associatedCompany) {
    let employeePermissions: string[] = user.roles
      ? user.roles
          .map((role) => (typeof role !== 'string' ? role.permissions : ''))
          .flat()
      : [];

    planFeatures = employeePermissions;
  } else if (user) {
    planFeatures =
      typeof userPlan !== 'string' ? userPlan.features.split(',') : [];
  }
  return {
    planFeatures,
    userPlan,
  };
}
