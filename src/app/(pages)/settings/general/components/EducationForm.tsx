import CustomButton from '@/app/component/customButton/button';
import { InputComponent } from '@/app/component/customInput/Input';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { useUser } from '@/app/hooks/useUser';
import { IUserInterface } from '@/app/interfaces/user.interface';
import AwsS3 from '@/app/utils/S3Intergration';
import { byteConverter } from '@/app/utils/byteConverter';
import {
  bg_style,
  minHeading,
  senaryHeading,
} from '@/globals/tailwindvariables';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import { SelectBrandingColor } from './SelectColor';
import { userService } from '@/app/services/user.service';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setUserAction } from '@/redux/authSlices/authSlice';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { City, Country, State } from 'country-state-city';
import { SelectComponent } from '@/app/component/customSelect/Select.component';

type OwnerGeneralSettingsFormType = Pick<
  IUserInterface,
  | 'university'
  | 'name'
  | 'website'
  | 'phone'
  | 'avatar'
  | 'companyLogo'
  | 'brandingColor'
  | 'country'
  | 'state'
  | 'city'
  | 'email'
>;

const ValidationSchema = Yup.object({
  university: Yup.string().required('University Name is required'),
  name: Yup.string().required('Name is required'),
  website: Yup.string().optional(),
  phone: Yup.string().test({
    test: (value) => {
      if (value) {
        return isValidPhoneNumber(value);
      }
      return true;
    },
    message: 'Invalid phone number',
  }),
  companyLogo: Yup.string(),
  avatar: Yup.string(),
  brandingColor: Yup.string(),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
});

export function EducationGeneralSettingsForm() {
  const user = useUser();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik<OwnerGeneralSettingsFormType>({
    initialValues: user
      ? {
          university: user.university,
          name: user.name,
          website: user.website,
          phone: user.phone,
          companyLogo: user.companyLogo || '',
          avatar: user.avatar || '',
          brandingColor: user.brandingColor,
          country: user.country,
          state: user.state,
          city: user.city,
          email: user.email,
        }
      : {
          avatar: '',
          university: '',
          name: '',
          website: '',
          phone: '',
          companyLogo: '',
          brandingColor: '',
          country: '',
          state: '',
          city: '',
          email: '',
        },
    async onSubmit(values) {
      setSubmitting(true);
      try {
        const response = await userService.httpUpdateCompanyDetail(values);
        if (response.data && user) {
          toast.success('Information updated successfully');
          dispatch(
            setUserAction({
              user: {
                ...user,
                ...values,
              },
            })
          );
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'An error occurred');
      } finally {
        setSubmitting(false);
      }
    },
    validationSchema: ValidationSchema,
    enableReinitialize: user ? true : false,
  });

  const avatarUploadHandler = async (e: any) => {
    return new Promise<string>((resolve, reject) => {
      if (byteConverter(e.target.files[0].size, 'MB').size > 5) {
        reject(new Error('Cannot upload image more then 5 mb of size'));
      }

      const file = e.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
      }

      if (file) {
        new AwsS3(file, 'documents/setting/')
          .getS3URL()
          .then((url) => {
            resolve(url);
          })
          .catch(reject);
      } else {
        reject(new Error('No file selected'));
      }
    });
  };

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
    <div className="w-full pb-6">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 ${bg_style} p-5`}
      >
        <InputComponent
          label="University Name"
          name="university"
          type="text"
          placeholder="University Name"
          field={{
            value: formik.values.university
              ? formik.values.university
              : undefined,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={
            formik.touched.university && Boolean(formik.errors.university)
          }
          errorMessage={
            formik.touched.university && formik.errors.university
              ? formik.errors.university
              : ''
          }
        />

        <InputComponent
          label="Name"
          name="name"
          type="text"
          placeholder="Name"
          field={{
            value: formik.values.name ? formik.values.name : undefined,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={formik.touched.name && Boolean(formik.errors.name)}
          errorMessage={
            formik.touched.name && formik.errors.name ? formik.errors.name : ''
          }
        />
        <InputComponent
          label="Email"
          name="email"
          type="text"
          placeholder="Email"
          field={{
            value: formik.values.email ? formik.values.email : undefined,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
            disabled: true,
          }}
          hasError={formik.touched.email && Boolean(formik.errors.email)}
          errorMessage={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : ''
          }
        />
        <InputComponent
          label="Website"
          name="website"
          type="text"
          placeholder="Website"
          field={{
            value: formik.values.website ? formik.values.website : undefined,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={formik.touched.website && Boolean(formik.errors.website)}
          errorMessage={
            formik.touched.website && formik.errors.website
              ? formik.errors.website
              : ''
          }
        />

        <PhoneNumberInputWithLable
          label="Phone"
          onChange={(val) => {
            formik.setFieldValue('phone', val);
          }}
          hasError={formik.touched.phone && Boolean(formik.errors.phone)}
          errorMessage={
            formik.touched.phone && formik.errors.phone
              ? formik.errors.phone
              : ''
          }
          // @ts-ignore
          value={formik.values.phone}
          onBlur={() => formik.setFieldTouched('phone', true)}
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
                value: formik.values.state ? formik.values.state : undefined,
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
              hasError={formik.touched.state && Boolean(formik.errors.state)}
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
            formik.touched.city && formik.errors.city ? formik.errors.city : ''
          }
          hasError={formik.touched.city && Boolean(formik.errors.city)}
        />
      </div>

      {/* Upload Image Div */}
      <div className={`${bg_style} grid grid-cols-1 p-5 mt-4 gap-2 `}>
        <div
          className={`px-6 py-4 flex flex-col items-center gap-3 ${
            formik.errors.companyLogo ? 'border-red-600' : ''
          }  ${bg_style}`}
        >
          {formik.values.companyLogo ? (
            <Image
              src={formik.values.companyLogo}
              width={100}
              height={100}
              alt="Avatar"
              className="object-contain"
            />
          ) : null}
          <input type="text" id="upload" className="hidden" />
          <div className="bg-lightGrayish rounded-[28px] border border-solid border-red flex justify-center items-center p-2.5">
            <Image
              src={'/uploadcloud.svg'}
              alt="upload icon"
              width={20}
              height={20}
            />
          </div>
          {uploadingLogo ? (
            <p>Uploading...</p>
          ) : (
            <div className="flex gap-2">
              <label
                htmlFor="uploadCompanyLogo"
                className={twMerge(
                  `${senaryHeading} text-schestiPrimary font-semibold cursor-pointer`
                )}
              >
                Upload Company Logo
              </label>
              <input
                type="file"
                name="uploadLogo"
                id="uploadCompanyLogo"
                accept=".png, .jpg, .jpeg"
                className="hidden"
                onChange={async (e) => {
                  setUploadingLogo(true);
                  avatarUploadHandler(e)
                    .then((res) => {
                      formik.setFieldValue('companyLogo', res);
                      setUploadingLogo(false);
                    })
                    .catch((err) => {
                      toast.error(err.message);
                      setUploadingLogo(false);
                    });
                }}
              />
              <p className={`text-steelGray ${minHeading}`}>or drag and drop</p>
            </div>
          )}

          <p className={`text-steelGray ${minHeading}`}>
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
        </div>

        <div className="mt-4">
          <div
            className={`px-6 py-4 col-span-12 flex flex-col items-center gap-3 ${
              formik.errors.avatar ? 'border-red-600' : ''
            }  ${bg_style}`}
          >
            {formik.values.avatar ? (
              <Image
                src={formik.values.avatar}
                width={100}
                height={100}
                alt="Avatar"
                className="object-contain"
              />
            ) : null}
            <input type="text" id="upload" className="hidden" />
            <div className="bg-lightGrayish rounded-[28px] border border-solid border-red flex justify-center items-center p-2.5">
              <Image
                src={'/uploadcloud.svg'}
                alt="upload icon"
                width={20}
                height={20}
              />
            </div>
            {uploadingAvatar ? (
              <p>Uploading...</p>
            ) : (
              <div className="flex gap-2">
                <label
                  htmlFor="uploadUserAvatar"
                  className={twMerge(
                    `${senaryHeading} text-schestiPrimary font-semibold cursor-pointer`
                  )}
                >
                  Upload User Photo
                </label>
                <input
                  type="file"
                  name="uploadLogo"
                  id="uploadUserAvatar"
                  accept=".png, .jpg, .jpeg"
                  className="hidden"
                  onChange={async (e) => {
                    setUploadingAvatar(true);
                    avatarUploadHandler(e)
                      .then((res) => {
                        formik.setFieldValue('avatar', res);
                        setUploadingAvatar(false);
                      })
                      .catch((err) => {
                        toast.error(err.message);
                        setUploadingAvatar(false);
                      });
                  }}
                />
                <p className={`text-steelGray ${minHeading}`}>
                  or drag and drop
                </p>
              </div>
            )}

            <p className={`text-steelGray ${minHeading}`}>
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </div>
        </div>

        <SelectBrandingColor
          active={formik.values.brandingColor}
          onPrimaryClick={() => {
            formik.setFieldValue('brandingColor', '');
          }}
          onSecondaryClick={(color) => {
            formik.setFieldValue('brandingColor', color);
          }}
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <div className="">
          <CustomButton
            text="Cancel"
            className={`!bg-snowWhite !text-[#344054] !py-3 !px-5 !w-28`}
          />
        </div>
        <div className="w-28">
          <CustomButton
            text="Update"
            onClick={formik.handleSubmit}
            className="!py-3 !px-5"
            isLoading={isSubmitting}
            loadingText="Updating..."
          />
        </div>
      </div>
    </div>
  );
}
