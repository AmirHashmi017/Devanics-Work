import { useUser } from '@/app/hooks/useUser';
import { IUserInterface } from '@/app/interfaces/user.interface';
import AuthNavbar from '../../../authNavbar';
import { twMerge } from 'tailwind-merge';
import { tertiaryHeading } from '@/globals/tailwindvariables';
import PrimaryHeading from '@/app/component/headings/primary';
import { useFormik } from 'formik';
import { OwnerSchema } from '@/app/utils/validationSchemas';
import { InputComponent } from '@/app/component/customInput/Input';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { City, Country, State } from 'country-state-city';
import Progessbar from '@/app/component/progressBar';
import Button from '@/app/component/customButton/button';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addCompanyDetail } from '@/redux/authSlices/auth.thunk';
import { toast } from 'react-toastify';
import { usePricing } from '../../../usePricing';
import { useRouterHook } from '@/app/hooks/useRouterHook';

type OwnerCompanyDetailsFormType = Pick<
  IUserInterface,
  'address' | 'phone' | 'country' | 'state' | 'city' | 'organizationName'
>;
export function OwnerCompanyDetails({ userId }: { userId?: string }) {
  const user = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const pricingHook = usePricing();
  const router = useRouterHook();

  const formik = useFormik<OwnerCompanyDetailsFormType>({
    initialValues: user
      ? {
          address: user.address,
          phone: user.phone,
          country: user.country,
          state: user.state,
          city: user.city,
          organizationName: user.organizationName,
        }
      : {
          address: '',
          phone: '',
          country: '',
          state: '',
          city: '',
          organizationName: '',
        },
    onSubmit: async (values) => {
      if (userId) {
        setIsLoading(true);
        let result: any = await dispatch(
          addCompanyDetail({ ...values, userId })
        );

        if (result.payload.statusCode == 200) {
          localStorage.setItem('schestiToken', result.payload.token);
          if (user?.invitation) {
            const plan = pricingHook.data?.find(
              (item) => item?._id === user?.invitation?.planId
            );
            if (plan) {
              pricingHook.setValueToStorage(plan);
            }
          }

          if (pricingHook.getValueFromStorage()) {
            router.push('/payment');
          } else {
            router.push('/plans');
          }
        } else {
          setIsLoading(false);
          toast.error(result.payload.message);
        }
        setIsLoading(false);
      } else {
        toast.error('Try login again');
      }
    },
    validationSchema: OwnerSchema,
    enableReinitialize: user ? true : false,
  });
  const countries = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));
  const states = State.getAllStates()
    .filter((state) => formik.values.country === state.countryCode)
    .map((state) => ({
      label: state.name,
      value: state.isoCode,
    }));
  const cities = City.getCitiesOfState(
    formik.values.country || '',
    formik.values.state || ''
  ).map((city) => ({ label: city.name, value: city.name }));
  return (
    <>
      <AuthNavbar />

      <div className="h-[calc(100vh-100px)] mt-4 grid place-items-center">
        <div className="w-full max-w-xl">
          <h2
            className={twMerge(
              `${tertiaryHeading} border-b-2 border=[#E7E7E7]`
            )}
          >
            Setup Profile
          </h2>

          <div className="mt-6 bg-white shadow-tertiaryMystery p-10 rounded-lg">
            <PrimaryHeading
              title={'Owner/Client Information'}
              className="text-center mb-12"
            />

            <section className="space-y-4">
              <PhoneNumberInputWithLable
                label="Phone Number"
                name="phone"
                placeholder="Phone Number"
                onChange={(val) => formik.setFieldValue('phone', val)}
                onBlur={formik.handleBlur}
                hasError={formik.touched.phone && Boolean(formik.errors.phone)}
                errorMessage={
                  formik.touched.phone && formik.errors.phone
                    ? formik.errors.phone
                    : ''
                }
                // @ts-ignore
                value={formik.values.phone ? formik.values.phone : undefined}
              />

              <InputComponent
                label="Address"
                name="address"
                placeholder="Address"
                hasError={
                  formik.touched.address && Boolean(formik.errors.address)
                }
                errorMessage={
                  formik.touched.address && Boolean(formik.errors.address)
                    ? formik.errors.address
                    : ''
                }
                type="text"
                field={{
                  value: formik.values.address
                    ? formik.values.address
                    : undefined,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                }}
              />

              <div className="flex items-center space-x-1 justify-between">
                <div className="flex-1">
                  <SelectComponent
                    label="Country"
                    name="country"
                    placeholder="Select Country"
                    field={{
                      options: countries,
                      value: formik.values.country,
                      showSearch: true,
                      onChange(value) {
                        formik.setFieldValue('country', value);
                        formik.setFieldValue('state', '');
                        formik.setFieldValue('city', '');
                      },
                      onClear() {
                        formik.setFieldValue('country', '');
                        formik.setFieldValue('state', '');
                        formik.setFieldValue('city', '');
                      },
                      optionFilterProp: 'label',
                    }}
                    hasError={
                      formik.touched.country && Boolean(formik.errors.country)
                    }
                    errorMessage={
                      formik.touched.country && formik.errors.country
                        ? formik.errors.country
                        : ''
                    }
                  />
                </div>

                <div className="flex-1">
                  <SelectComponent
                    label="State"
                    name="state"
                    placeholder="State"
                    field={{
                      options: states,
                      optionFilterProp: 'label',
                      value: formik.values.state
                        ? formik.values.state
                        : undefined,
                      showSearch: true,
                      placeholder: 'State',
                      onChange(value) {
                        formik.setFieldValue('state', value);
                        formik.setFieldValue('city', '');
                      },
                      onBlur: formik.handleBlur,
                      onClear() {
                        formik.setFieldValue('state', '');
                        formik.setFieldValue('city', '');
                      },
                    }}
                    errorMessage={
                      formik.touched.state && formik.errors.state
                        ? formik.errors.state
                        : ''
                    }
                    hasError={
                      formik.touched.state && Boolean(formik.errors.state)
                    }
                  />
                </div>
              </div>
              <SelectComponent
                label="City"
                name="city"
                placeholder="City"
                field={{
                  options: cities,
                  showSearch: true,
                  value: formik.values.city ? formik.values.city : undefined,
                  placeholder: 'City',
                  onChange: (value) => {
                    formik.setFieldValue('city', value);
                  },
                  onBlur: formik.handleBlur,
                  allowClear: true,
                  onClear() {
                    formik.setFieldValue('city', '');
                  },
                  optionFilterProp: 'label',
                }}
                errorMessage={
                  formik.touched.city && formik.errors.city
                    ? formik.errors.city
                    : ''
                }
                hasError={formik.touched.city && Boolean(formik.errors.city)}
              />

              <InputComponent
                label="Organization Name"
                name="organizationName"
                placeholder="Organization Name"
                hasError={
                  formik.touched.organizationName &&
                  Boolean(formik.errors.organizationName)
                }
                errorMessage={
                  formik.touched.organizationName &&
                  formik.errors.organizationName
                    ? formik.errors.organizationName
                    : ''
                }
                type="text"
                field={{
                  value: formik.values.organizationName
                    ? formik.values.organizationName
                    : undefined,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                }}
              />

              <Button
                text="Next"
                className="w-full my-3"
                onClick={formik.handleSubmit}
                isLoading={isLoading}
                loadingText="Please wait..."
              />
            </section>
          </div>
          <Progessbar progress={'25%'} step={1} className="my-3" />
        </div>
      </div>
    </>
  );
}
