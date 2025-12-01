import { useUser } from '@/app/hooks/useUser';
import { IUserInterface } from '@/app/interfaces/user.interface';
import AuthNavbar from '../../../authNavbar';
import { twMerge } from 'tailwind-merge';
import { tertiaryHeading } from '@/globals/tailwindvariables';
import PrimaryHeading from '@/app/component/headings/primary';
import { useFormik } from 'formik';
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
import { ShowFileComponent } from '@/app/(pages)/bid-management/components/ShowFile.component';
import { getFileNameAndExtensionFromURL } from '@/app/utils/utils';
import AwsS3 from '@/app/utils/S3Intergration';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';
import _ from 'lodash';

type CommonCompanyDetailsFormType = Pick<
  IUserInterface,
  | 'address'
  | 'phone'
  | 'country'
  | 'state'
  | 'city'
  | 'companyName'
  | 'companyLogo'
  | 'employee'
  | 'industry'
>;

const validationSchema = Yup.object({
  address: Yup.string().required('Address is required'),
  phone: Yup.string().test({
    test: (value) => {
      if (value && !isValidPhoneNumber(value)) {
        return false;
      }
      return true;
    },
    message: 'Please enter a valid phone number',
  }),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  companyLogo: Yup.string().required('Company Logo is required'),
  companyName: Yup.string().required('Company Name is required'),
  employee: Yup.string().required('Employee is required'),
  industry: Yup.string().required('Industry is required'),
});

export function CommonCompanyDetails({ userId }: { userId?: string }) {
  const user = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const pricingHook = usePricing();
  const router = useRouterHook();

  const formik = useFormik<CommonCompanyDetailsFormType>({
    initialValues: user
      ? {
          address: user.address,
          phone: user.phone,
          country: user.country,
          state: user.state,
          city: user.city,
          companyLogo: user.companyLogo,
          companyName: user.companyName,
          employee: user.employee,
          industry: user.industry,
        }
      : {
          address: '',
          phone: '',
          country: '',
          state: '',
          city: '',
          companyLogo: '',
          companyName: '',
          employee: '',
          industry: '',
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

          if (user?.userRole === 'subcontractor') {
            router.push('/trades');
          } else {
            router.push('/verification');
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
    validationSchema: validationSchema,
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
              title={'Company Information'}
              className="text-center mb-12"
            />

            <section className="space-y-4">
              <InputComponent
                label="Company Name"
                name="companyName"
                placeholder="Company Name"
                hasError={
                  formik.touched.companyName &&
                  Boolean(formik.errors.companyName)
                }
                errorMessage={
                  formik.touched.companyName && formik.errors.companyName
                    ? formik.errors.companyName
                    : ''
                }
                type="text"
                field={{
                  value: formik.values.companyName
                    ? formik.values.companyName
                    : undefined,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                }}
                value=""
              />

              <InputComponent
                label="Industry"
                name="industry"
                placeholder="Industry"
                hasError={
                  formik.touched.industry && Boolean(formik.errors.industry)
                }
                errorMessage={
                  formik.touched.industry && formik.errors.industry
                    ? formik.errors.industry
                    : ''
                }
                type="text"
                field={{
                  value: formik.values.industry
                    ? formik.values.industry
                    : undefined,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                }}
                value=""
              />

              <PhoneNumberInputWithLable
                label="Phone Number"
                // name="phone"
                // placeholder="Phone Number"
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
                value=""
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
                label="Employee"
                name="employee"
                placeholder="Employee"
                hasError={
                  formik.touched.employee && Boolean(formik.errors.employee)
                }
                errorMessage={
                  formik.touched.employee && formik.errors.employee
                    ? formik.errors.employee
                    : ''
                }
                type="number"
                field={{
                  value: formik.values.employee
                    ? formik.values.employee
                    : undefined,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                }}
                value=""
              />

              {/* Company logo */}
              <div className="space-y-2">
                <label htmlFor="myInput">Company Logo</label>
                <div className="flex items-center">
                  {formik.values.companyLogo ? (
                    <div className="w-fit">
                      <ShowFileComponent
                        file={{
                          extension: getFileNameAndExtensionFromURL(
                            formik.values.companyLogo
                          ).extension,
                          name: _.truncate(
                            getFileNameAndExtensionFromURL(
                              formik.values.companyLogo
                            ).fileName,
                            {
                              length: 10,
                            }
                          ),
                          type: 'image',
                          url: formik.values.companyLogo,
                        }}
                        onDelete={() => formik.setFieldValue('companyLogo', '')}
                        shouldFit={false}
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-22 h-22 border-2 border-solid rounded-lg cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center p-5">
                        <svg
                          className="w-6 h-6 mb-3 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        {!formik.values.companyLogo && (
                          <>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold text-schestiPrimary">
                                Click to upload
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG (max. 800x400px)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        id="dropzone-file"
                        onChange={async (e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await new AwsS3(
                              file,
                              'company/logos/'
                            ).getS3URL();

                            formik.setFieldValue('companyLogo', url);
                          }
                        }}
                        type="file"
                        style={{ opacity: '0' }}
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>

                {formik.touched.companyLogo &&
                Boolean(formik.errors.companyLogo) ? (
                  <p className="text-red-500 text-xs">
                    {formik.errors.companyLogo}
                  </p>
                ) : null}
              </div>

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
