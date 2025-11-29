import { useUser } from '@/app/hooks/useUser';
import { IUserInterface } from '@/app/interfaces/user.interface';
import AuthNavbar from '../../../authNavbar';
import { twMerge } from 'tailwind-merge';
import { tertiaryHeading } from '@/globals/tailwindvariables';
import PrimaryHeading from '@/app/component/headings/primary';
import { useFormik } from 'formik';
import { EducationalSchema } from '@/app/utils/validationSchemas';
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
import { FileInterface } from '@/app/interfaces/file.interface';
import AwsS3 from '@/app/utils/S3Intergration';

type EducationalCompanyDetailsFormType = Pick<
  IUserInterface,
  | 'address'
  | 'phone'
  | 'country'
  | 'state'
  | 'city'
  | 'university'
  | 'educationalDocuments'
>;
export function EducationalCompanyDetails({ userId }: { userId?: string }) {
  const user = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const pricingHook = usePricing();
  const router = useRouterHook();

  const formik = useFormik<EducationalCompanyDetailsFormType>({
    initialValues: user
      ? {
          address: user.address,
          phone: user.phone,
          country: user.country,
          state: user.state,
          city: user.city,
          university: user.university,
          educationalDocuments: user.educationalDocuments,
        }
      : {
          address: '',
          phone: '',
          country: '',
          state: '',
          city: '',
          university: '',
          educationalDocuments: [],
        },
    onSubmit: async (values) => {
      if (userId) {
        setIsLoading(true);
        if (!values.educationalDocuments.every((file) => 'url' in file)) {
          const filesData = values.educationalDocuments.map(async (file) => {
            const url = await new AwsS3(
              file,
              'documents/post-project/'
            ).getS3URL();
            return {
              url,
              name: file.name,
              type: file.type,
              extension: file.name.split('.').pop(),
            } as FileInterface;
          });
          values.educationalDocuments = await Promise.all(filesData);
        }

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

          if (user && user.isActive === 'pending') {
            router.push('/pending');
            return;
          } else if (user && user.isActive === 'active') {
            if (pricingHook.getValueFromStorage()) {
              router.push('/payment');
            } else {
              router.push('/plans');
            }
            return;
          } else {
            toast.error('Something went wrong');
            router.push('/login');
            return;
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
    validationSchema: EducationalSchema,
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
              title={'Personal Information'}
              className="text-center mb-12"
            />

            <section className="space-y-4">
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
                label="University Name"
                name="university"
                placeholder="University Name"
                hasError={
                  formik.touched.university && Boolean(formik.errors.university)
                }
                errorMessage={
                  formik.touched.university && formik.errors.university
                    ? formik.errors.university
                    : ''
                }
                type="text"
                field={{
                  value: formik.values.university
                    ? formik.values.university
                    : undefined,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                }}
              />
              <div className="mt-2 space-y-3 ">
                <div>
                  <label htmlFor="myInput">
                    Student/Professor University ID Card
                  </label>
                </div>
                {formik.values.educationalDocuments &&
                formik.values.educationalDocuments.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {formik.values.educationalDocuments.map((doc, index) => (
                      <div key={index} className="w-fit">
                        <ShowFileComponent
                          file={{
                            extension: doc?.type || '',
                            name: doc?.name,
                            type: doc?.type,
                            url:
                              'url' in doc
                                ? doc?.url
                                : URL.createObjectURL(doc),
                          }}
                          onDelete={() => {
                            if (formik.values.educationalDocuments) {
                              formik.setFieldValue(
                                'educationalDocuments',
                                formik.values.educationalDocuments.filter(
                                  (d, i) => i !== index
                                )
                              );
                            }
                          }}
                          shouldFit={false}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label
                      htmlFor="dropzone-file"
                      className={`flex  flex-col items-center justify-center w-22 h-22 border-2 border-solid rounded-lg cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${formik.errors.educationalDocuments ? '!border-red-500' : ''}`}
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
                      </div>
                      <input
                        id="dropzone-file"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length) {
                            formik.setFieldValue(
                              'educationalDocuments',
                              Array.from(files)
                            );
                          }
                        }}
                        type="file"
                        style={{ opacity: '0' }}
                      />
                    </label>
                    {formik.errors.educationalDocuments ? (
                      <p className="text-red-500 text-xs">
                        {formik.errors.educationalDocuments.toString()}
                      </p>
                    ) : null}
                  </div>
                )}
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
