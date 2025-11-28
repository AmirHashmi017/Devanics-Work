import QuinaryHeading from 'src/components/Headings/Quinary';
import TertiaryHeading from '../../components/Headings/Tertiary';
import { Checkbox, Radio } from 'antd';
import FormControl from 'src/components/FormControl';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import CustomButton from 'src/components/CustomButton/button';
import { bg_style } from 'src/components/TailwindVariables';
import { pricingPlanService } from 'src/services/pricingPlan.service';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { featureOptions } from './utils';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';

const options: SelectProps['options'] = [];
type PlanInitTypes = {
  type: string;
  planName: string;
  price: number;
  duration: string;
  freeTrailDays: number;
  planDescription: string;
  features: [];
  isInternal?: boolean;
  egpPrice?: number;
};

const Create = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { planData } = useSelector((state: any) => state.pricingPlan);
  const initialValues: PlanInitTypes = {
    type: planData?.type || 'Individual',
    planName: planData?.planName || '',
    price: planData?.price || 0,
    egpPrice: planData?.egpPrice || 0,
    duration: planData?.duration || 'monthly',
    freeTrailDays: planData?.freeTrailDays || 0,
    planDescription: planData?.planDescription || '',
    features: planData
      ? planData?.features?.split(',')
      : ['/social-media', '/daily-work'],
    isInternal: planData?.isInternal || false,
  };

  const CompanyDetailsSchema: any = Yup.object({
    type: Yup.string().required('planType is required!'),
    planName: Yup.string().required('planName is required!'),
    price: Yup.string().required('monthlyPrice is required!'),
    duration: Yup.string().required('Plan!'),
    freeTrailDays: Yup.number()
      .min(0, "Free Trial Days can't be negative")
      .max(14, "Free Trial Days can't be greater than 14")
      .required('freeTrailDays is required!'),
    planDescription: Yup.string().required('planDescription is required!'),
    features: Yup.array().min(1).required('Minimum two features are requied!'),
    egpPrice: Yup.number().optional(),
  });

  const submitHandler = async (values: PlanInitTypes) => {
    // update pricing when in edit mode else create it
    setIsLoading(true);
    try {
      if (planData) {
        const { statusCode } = await pricingPlanService.httpUpdatePricingPlan(
          planData._id,
          { ...values, features: values.features.join(',') }
        );
        if (statusCode === 200) {
          navigate('/plans');
        }
      } else {
        const { statusCode } = await pricingPlanService.httpAddPricingPlan({
          ...values,
          features: values.features.join(','),
        });
        if (statusCode === 201) {
          navigate('/plans');
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="p-16 py-4 rounded-xl ">
      <div className={`${bg_style} p-5 border border-silverGray`}>
        <div className="max-w-[870px]">
          <TertiaryHeading title="Add Plan" className="text-graphiteGray" />

          <Formik
            initialValues={initialValues}
            validationSchema={CompanyDetailsSchema}
            onSubmit={submitHandler}
          >
            {({ handleSubmit, values, setFieldValue, errors }) => {
              const { type, features } = values;
              return (
                <Form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-y-6 gap-x-4 "
                >
                  <div className="grid grid-cols-3 mt-6">
                    <div className="col-span-1">
                      <QuinaryHeading title="Plan Type" />
                    </div>
                    <div className="col-span-2">
                      <Radio.Group
                        options={['Individual', 'Enterprise', 'Educational']}
                        onChange={(e) => setFieldValue('type', e.target.value)}
                        value={type}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <label
                      className="text-graphiteGray text-sm font-medium leading-6 capitalize col-span-1 flex items-center"
                      htmlFor="name"
                    >
                      Plan Name
                    </label>
                    <div className="col-span-2">
                      <FormControl
                        control="input"
                        type="text"
                        name="planName"
                        placeholder="Enter Plan Name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label
                      className="text-graphiteGray text-sm font-medium leading-6 capitalize col-span-1 flex items-center"
                      htmlFor="name"
                    >
                      {values.duration === 'monthly'
                        ? 'Monthly USD Price'
                        : 'Yearly USD Price'}
                    </label>
                    <div className="col-span-2">
                      <FormControl
                        control="input"
                        type="number"
                        name="price"
                        placeholder="Enter USD Price"
                        disabled={planData ? 'disable' : undefined}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label
                      className="text-graphiteGray text-sm font-medium leading-6 capitalize col-span-1 flex items-center"
                      htmlFor="name"
                    >
                      {values.duration === 'monthly'
                        ? 'Monthly EGP Price'
                        : 'Yearly EGP Price'}
                    </label>
                    <div className="col-span-2">
                      <FormControl
                        control="input"
                        type="number"
                        name="egpPrice"
                        placeholder="Enter EGP Price"
                        disabled={planData ? 'disable' : undefined}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label
                      className="text-graphiteGray text-sm font-medium leading-6 capitalize col-span-1 flex items-center"
                      htmlFor="name"
                    >
                      Mark it as Internal
                    </label>
                    <div className="col-span-2">
                      <Checkbox
                        onChange={(e) =>
                          setFieldValue('isInternal', e.target.checked)
                        }
                        value={values.isInternal}
                        disabled={planData ? true : false}
                      >
                        Internal
                      </Checkbox>
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <label
                      className="text-graphiteGray text-sm font-medium leading-6 capitalize col-span-1 flex items-center"
                      htmlFor="name"
                    >
                      Duration
                    </label>
                    <div className="col-span-2">
                      <FormControl
                        control="select"
                        name="duration"
                        options={[
                          { label: 'Monthly', value: 'monthly' },
                          { label: 'Yearly', value: 'yearly' },
                        ]}
                        disabled={planData ? 'disable' : undefined}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <label
                      className="text-graphiteGray text-sm font-medium leading-6 capitalize col-span-1 flex items-center"
                      htmlFor="name"
                    >
                      Free Trial Days
                    </label>
                    <div className="col-span-2">
                      <FormControl
                        control="input"
                        type="number"
                        name="freeTrailDays"
                        placeholder="Enter Free Trial Days From 0 to 14"
                        disabled={planData ? 'disable' : undefined}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <label
                      className="text-graphiteGray text-sm font-medium leading-6 capitalize col-span-1 flex items-center"
                      htmlFor="name"
                    >
                      Plan Description
                    </label>
                    <div className="col-span-2">
                      <FormControl
                        control="textarea"
                        name="planDescription"
                        placeholder="Enter Plan Description"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3">
                    <label
                      className="text-graphiteGray text-sm font-medium leading-6 capitalize col-span-1 flex items-center"
                      htmlFor="name"
                    >
                      Feature
                    </label>
                    <div className="col-span-2">
                      <Select
                        mode="tags"
                        defaultValue={features}
                        placeholder="Please select"
                        onChange={(value) => setFieldValue('features', value)}
                        options={featureOptions}
                        className="w-full"
                      />
                      <p className="text-red-600 text-sm">
                        {errors && errors?.features}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <span>
                      <CustomButton
                        text="Cancel"
                        className="!px-5 !py-3 mt-8 !shadow-scenarySubdued !bg-white border !border-celestialGray !text-graphiteGray"
                        type="submit"
                        onClick={() => navigate('/plans')}
                      />
                    </span>
                    <span>
                      <CustomButton
                        text="Save"
                        className="!px-7 !py-3 mt-8"
                        type="submit"
                        isLoading={isLoading}
                        loadingText="Loading..."
                        disabled={isLoading}
                      />
                    </span>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default Create;
