import { Radio } from 'antd';
import { City, Country, State } from 'country-state-city';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import CustomButton from 'src/components/CustomButton/button';
import WhiteButton from 'src/components/CustomButton/white';
import { InputComponent } from 'src/components/CustomInput/Input';
import { SelectComponent } from 'src/components/customSelect/Select.component';
import PrimaryHeading from 'src/components/Headings/Primary';
import { PhoneNumberInputWithLable } from 'src/components/phoneNumberInput/PhoneNumberInputWithLable';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { IPricingPlan } from 'src/interfaces/pricing-plan.interface';
import { selectPricingPlans } from 'src/redux/pricingPlanSlice/pricingPlan.selector';
import { ShouldHaveAtLeastCharacterRegex } from 'src/utils/common';
import * as Yup from 'yup';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { userService } from 'src/services/user.service';
import { useNavigate } from 'react-router-dom';
import { Routes } from 'src/pages/Plans/utils';

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'Name cannot be empty',
    })
    .required('Name is required'),
  email: Yup.string().email().required('Email is required'),
  // check if it matches USER_ROLE_ENUM value
  role: Yup.string()
    .oneOf(Object.values(USER_ROLE_ENUM))
    .required('Role is required'),

  password: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'Password cannot be empty',
    })
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),

  phone: Yup.string()
    .test({
      test: (value) => {
        if (value) {
          return isValidPhoneNumber(value);
        }
        return true;
      },
      message: 'Invalid phone number',
    })
    .required('Phone is required'),
  university: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'Company name cannot be empty',
    })
    .required('Company name is required'),
  address: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'Address cannot be empty',
    })
    .required('Address is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),

  planId: Yup.string().required('Plan is required'),
});

type Props = {
  role: USER_ROLE_ENUM;
};

export function ProfessorStudentForm({ role }: Props) {
  const [planType, setPlanType] = useState('Individual');
  const plansData: { pricingPlans: IPricingPlan[] | null } =
    useSelector(selectPricingPlans);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      role: role,
      password: '',
      phone: '',
      university: '',
      address: '',
      country: '',
      state: '',
      city: '',
      planId: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await userService.httpInviteUser(values);
        if (response.data) {
          toast.success('User invited successfully');
          formik.resetForm();
          navigate(-1);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const countries = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));
  const states = State.getAllStates()
    .filter((state) => state.countryCode === formik.values.country)
    .map((state) => ({ label: state.name, value: state.isoCode }));
  const cities = City.getCitiesOfState(
    formik.values.country,
    formik.values.state
  ).map((city) => ({ label: city.name, value: city.name }));

  return (
    <div className="space-y-2 mt-3">
      <div className="space-y-2 py-3">
        <PrimaryHeading
          title="Personal Information"
          className="text-base font-medium"
        />

        <div className="grid grid-cols-2 gap-2">
          <InputComponent
            label="Name"
            name="name"
            type="text"
            placeholder="Enter Name"
            field={{
              value: formik.values.name ? formik.values.name : undefined,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            hasError={Boolean(formik.touched.name && formik.errors.name)}
            errorMessage={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ''
            }
          />

          <InputComponent
            label="Email"
            name="email"
            type="email"
            placeholder="Enter Email"
            field={{
              value: formik.values.email ? formik.values.email : undefined,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            hasError={Boolean(formik.touched.email && formik.errors.email)}
            errorMessage={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ''
            }
          />

          <InputComponent
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter Password"
            field={{
              value: formik.values.password
                ? formik.values.password
                : undefined,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
              suffix: showPassword ? (
                <EyeTwoTone onClick={() => setShowPassword(!showPassword)} />
              ) : (
                <EyeInvisibleOutlined
                  onClick={() => setShowPassword(!showPassword)}
                />
              ),
            }}
            hasError={Boolean(
              formik.touched.password && formik.errors.password
            )}
            errorMessage={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ''
            }
          />
          <SelectComponent
            label="Select Role"
            name="role"
            placeholder="Select Role"
            field={{
              value: formik.values.role,
              options: Object.values(USER_ROLE_ENUM).map((role) => {
                return {
                  label: <p className="capitalize">{role}</p>,
                  value: role,
                };
              }),
            }}
            hasError={Boolean(formik.touched.role && formik.errors.role)}
            errorMessage={
              formik.touched.role && formik.errors.role
                ? formik.errors.role
                : ''
            }
          />
        </div>
      </div>

      <div className="space-y-2 py-3">
        <PrimaryHeading
          title="University Information"
          className="text-base font-medium"
        />

        <div className="grid grid-cols-2 gap-2">
          <InputComponent
            label="University Name"
            name="university"
            type="text"
            placeholder="Enter University Name"
            field={{
              value: formik.values.university
                ? formik.values.university
                : undefined,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            hasError={Boolean(
              formik.touched.university && formik.errors.university
            )}
            errorMessage={
              formik.touched.university && formik.errors.university
                ? formik.errors.university
                : ''
            }
          />

          <PhoneNumberInputWithLable
            label="Phone Number"
            onChange={(value) => formik.setFieldValue('phone', value as string)}
            value={formik.values.phone as any}
            hasError={Boolean(formik.touched.phone && formik.errors.phone)}
            errorMessage={
              formik.touched.phone && formik.errors.phone
                ? formik.errors.phone
                : ''
            }
            onBlur={() => formik.setFieldTouched('phone', true)}
          />

          <div className="col-span-2">
            <InputComponent
              label="Address"
              name="address"
              type="text"
              placeholder="Enter Address"
              field={{
                value: formik.values.address
                  ? formik.values.address
                  : undefined,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
              hasError={Boolean(
                formik.touched.address && formik.errors.address
              )}
              errorMessage={
                formik.touched.address && formik.errors.address
                  ? formik.errors.address
                  : ''
              }
            />
          </div>

          <div className="col-span-2 flex space-x-2 items-center">
            <div className="flex-1">
              <SelectComponent
                label="Country"
                placeholder="Country"
                name="country"
                field={{
                  options: countries,
                  showSearch: true,
                  value: formik.values.country
                    ? formik.values.country
                    : undefined,
                  onChange: (value) => {
                    formik.setFieldValue('country', value);
                    formik.setFieldValue('state', '');
                    formik.setFieldValue('city', '');
                  },
                  onClear() {
                    formik.setFieldValue('country', '');
                    formik.setFieldValue('state', '');
                    formik.setFieldValue('city', '');
                  },
                  allowClear: true,
                  onBlur: formik.handleBlur,
                }}
                hasError={Boolean(
                  formik.touched.country && formik.errors.country
                )}
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
                  value: formik.values.state ? formik.values.state : undefined,
                  showSearch: true,
                  onChange(value) {
                    formik.setFieldValue('state', value);
                    formik.setFieldValue('city', '');
                  },
                  onClear() {
                    formik.setFieldValue('state', '');
                    formik.setFieldValue('city', '');
                  },
                  allowClear: true,
                  onBlur: formik.handleBlur,
                }}
                hasError={Boolean(formik.touched.state && formik.errors.state)}
                errorMessage={
                  formik.touched.state && formik.errors.state
                    ? formik.errors.state
                    : ''
                }
              />
            </div>
            <div className="flex-1">
              <SelectComponent
                label="City"
                name="city"
                placeholder="City"
                field={{
                  options: cities,
                  showSearch: true,
                  value: formik.values.city ? formik.values.city : undefined,
                  onChange: (value) => {
                    formik.setFieldValue('city', value);
                  },

                  allowClear: true,
                  onClear() {
                    formik.setFieldValue('city', '');
                  },
                  onBlur: formik.handleBlur,
                }}
                hasError={Boolean(formik.touched.city && formik.errors.city)}
                errorMessage={
                  formik.touched.city && formik.errors.city
                    ? formik.errors.city
                    : ''
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 py-3">
        <PrimaryHeading
          title="Assign Package"
          className="text-base font-medium"
        />

        <div className="grid grid-cols-2 items-center gap-2">
          <Radio.Group
            value={planType}
            onChange={(e) => {
              setPlanType(e.target.value);
            }}
          >
            <Radio value={'Individual'}>Individual</Radio>

            <Radio value={'Enterprise'}>Enterprise</Radio>
            <Radio value={'Educational'}>Educational</Radio>
          </Radio.Group>

          <div>
            <SelectComponent
              label=""
              placeholder="Select Plan"
              name="planId"
              field={{
                options:
                  plansData && plansData.pricingPlans
                    ? plansData.pricingPlans
                        .filter((plan) => plan.type === planType)
                        .filter((plan) => plan.isActive === true)
                        .map((plan) => {
                          return {
                            label: `${plan.planName} - ${plan.price}`,
                            value: plan._id,
                          };
                        })
                    : [],
                value: formik.values.planId ? formik.values.planId : undefined,
                onChange: (value) => {
                  formik.setFieldValue('planId', value);
                },
                allowClear: true,
                onBlur: formik.handleBlur,
                onClear() {
                  formik.setFieldValue('planId', '');
                },
              }}
              hasError={Boolean(formik.touched.planId && formik.errors.planId)}
              errorMessage={
                formik.touched.planId && formik.errors.planId
                  ? formik.errors.planId
                  : ''
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center space-x-2">
        <WhiteButton
          text="Cancel"
          className="!w-fit"
          onClick={() => navigate(-1)}
        />
        <CustomButton
          text="Send Invitation"
          className="!w-fit"
          onClick={() => formik.handleSubmit()}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
