import { IPricingPlan } from 'src/interfaces/pricing-plan.interface';
import { ISubscriptionHistory } from 'src/interfaces/subscription-history.interface';

/**
 * Retrieves the active subscription from the provided subscription history.
 * If no active subscription is found, returns the first non-active subscription.
 *
 * @param {ISubscriptionHistory[]} subscriptions - The user's subscription history
 * @return {ISubscriptionHistory | undefined} The active or first non-active subscription
 */
export function getSubscriptionFromUserData(
  subscriptions: ISubscriptionHistory[]
) {
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === 'active'
  );
  if (activeSubscription) {
    return activeSubscription;
  }

  return subscriptions.find((sub) => sub.status !== 'active');
}

/**
 * Retrieves the pricing plan associated with the provided user subscription.
 *
 * @param {IPricingPlan[]} plans - The list of available pricing plans
 * @param {ISubscriptionHistory} subscription - The user's subscription (optional)
 * @return {IPricingPlan | null} The pricing plan associated with the subscription, or null if no subscription is provided
 */
export function getPlanFromUserSubscription(
  plans: IPricingPlan[],
  subscription?: ISubscriptionHistory
) {
  if (!subscription) {
    return null;
  }
  const plan = plans.find((plan) => plan._id === subscription.planId);
  return plan ? plan : null;
}
