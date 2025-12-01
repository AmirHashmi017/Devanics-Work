'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import SinglePlan from './components/plan/plan';
import ToggleBtn from '@/app/component/plans/toggleBtn';
import SwitchBtn from '@/app/component/plans/switchbtn';
import { pricingPlanService } from '@/app/services/pricingPlan.service';
import { Skeleton, Alert } from 'antd';
import { toast } from 'react-toastify';
import { Country } from '@/app/hooks/useCountrySelection';

interface Props {
  country: Country;
}

const Plans = ({ country }: Props) => {
  const [planType, setPlanType] = useState('Individual');
  const [duration, setDuration] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLocalPricing, setHasLocalPricing] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await pricingPlanService.httpGetPricingPlansByCountry(
        country.code,
        duration,
        planType
      );

      setPlans(res.data.pricingPlans || []);
      setHasLocalPricing(res.data.hasLocalPricing || false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load plans');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country.code, duration, planType]);

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDuration(e.target.checked ? 'yearly' : 'monthly');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <ToggleBtn planType={planType} onChange={setPlanType} />
        <SwitchBtn isDuration={duration} onChange={handleDurationChange} />
      </div>

      {/* Local Pricing Warning */}
      {!hasLocalPricing && (
        <Alert
          message={`No local pricing available for ${country.name}`}
          description="Showing all plans in USD. Contact support for custom pricing."
          type="warning"
          showIcon
          className="mb-6"
        />
      )}

      {hasLocalPricing && (
        <Alert
          message={`Showing localized pricing for ${country.name} (${country.currency})`}
          type="success"
          showIcon
          className="mb-6"
        />
      )}

      {/* Plans Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} active paragraph={{ rows: 8 }} />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No plans available for your selection.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan: any, index: number) => (
            <SinglePlan
              key={plan._id || index}
              {...plan}
              displayPrice={plan.displayPrice}
              displayCurrency={plan.displayCurrency}
              preferredPaymentMethod={plan.preferredPaymentMethod}
              country={country}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;