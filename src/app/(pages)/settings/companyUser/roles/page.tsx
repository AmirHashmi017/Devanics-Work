'use client';

import CustomButton from '@/app/component/customButton/button';
import VerticleBar from '../../verticleBar';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { InputComponent } from '@/app/component/customInput/Input';
import { OtherRoutes, Plans } from '@/app/utils/plans.utils';
import { Checkbox, Skeleton, Tooltip } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import companyRoleService from '@/app/services/company-role.service';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { useSearchParams } from 'next/navigation';
import { ISettingCompanyRole } from '@/app/interfaces/settings/comapny-role-settings.interface';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useUser } from '@/app/hooks/useUser';
import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';

const CompanyRoleSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/[a-zA-Z]/, { message: 'Atleast 1 character is required' })
    .required('Role Name is required!'),
  permissions: Yup.array()
    .of(Yup.string())
    .min(1, 'Permissions field must have at least 1 items')
    .required('Permissions is required!'),
});

export default function NewCompanyRolePage() {
  const [companyRole, setCompanyRole] = useState<ISettingCompanyRole | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const userPlan = user?.subscription?.planId as IPricingPlan;

  const userPlanFeatures = userPlan ? userPlan.features.split(',') : [];
  const router = useRouterHook();
  const searchParams = useSearchParams();
  const roleId = searchParams.get('roleId');

  useEffect(() => {
    if (roleId) {
      getCompanyRoleById(roleId);
    }
  }, [roleId]);

  const formik = useFormik({
    initialValues: {
      name: '',
      permissions: [] as string[],
    },
    async onSubmit(values) {
      if (companyRole) {
        await updateRole(companyRole._id, values);
      } else {
        await createNewRole(values);
      }
    },
    validationSchema: CompanyRoleSchema,
    enableReinitialize: true,
  });

  async function createNewRole(values: {
    name: string;
    permissions: string[];
  }) {
    try {
      const response = await companyRoleService.httpCreateCompanyRole(values);
      if (response.data) {
        toast.success('Role created successfully');
        router.push(OtherRoutes.Settings['User Managements']);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  }

  async function updateRole(
    id: string,
    values: { name: string; permissions: string[] }
  ) {
    try {
      const response = await companyRoleService.httpUpdateCompanyRoleById(
        id,
        values
      );
      if (response.data) {
        toast.success('Role Updated successfully');
        router.push(OtherRoutes.Settings['User Managements']);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  }

  function handleRemovePermission(value: string) {
    formik.setFieldValue(
      'permissions',
      formik.values.permissions.filter((permission) => permission !== value)
    );
  }

  function handleAddPermission(value: string) {
    formik.setFieldValue('permissions', [...formik.values.permissions, value]);
  }

  async function getCompanyRoleById(roleId: string) {
    setIsLoading(true);
    try {
      const response = await companyRoleService.httpGetCompanyRoleById(roleId);
      if (response.data) {
        formik.setValues(response.data);
        setCompanyRole(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VerticleBar>
      <div className="w-full">
        <div className="flex w-full justify-between items-center">
          <div>
            <TertiaryHeading
              title={companyRole ? 'Edit Role' : 'Create New Role'}
              className="text-schestiPrimaryBlack text-2xl font-semibold"
            />
            <p className="text-schestiLightBlack font-normal text-[14px] leading-6 ">
              Manage your company roles
            </p>
          </div>

          {companyRole ? (
            <CustomButton
              text={'Update'}
              className="!w-fit"
              onClick={() => {
                formik.setFieldTouched('permissions', true, true);
                formik.handleSubmit();
              }}
            />
          ) : (
            <CustomButton
              text={'Create new role'}
              icon="/plus.svg"
              iconwidth={20}
              iconheight={20}
              className="!w-fit"
              onClick={() => {
                formik.setFieldTouched('permissions', true, true);
                formik.handleSubmit();
              }}
            />
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <Skeleton active />
            <Skeleton active />
          </div>
        ) : (
          <div className="bg-snowWhite rounded-2xl mt-4 shadow-instentWhite py-5 px-6">
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <InputComponent
                  label="Role Name"
                  name="name"
                  placeholder="Enter Role Name"
                  type="text"
                  field={{
                    onChange: formik.handleChange,
                    onBlur: formik.handleBlur,
                    value: formik.values.name,
                  }}
                  hasError={formik.touched.name && Boolean(formik.errors.name)}
                  errorMessage={
                    formik.touched.name && formik.errors.name
                      ? formik.errors.name
                      : ''
                  }
                />
              </div>
              {companyRole ? (
                <div className="col-span-5 pt-5">
                  <p className="text-schestiPrimaryBlack font-medium text-[14px] leading-6">
                    Created At:{' '}
                    <span className="text-schestiLightBlack">
                      {moment(companyRole.createdAt).format(
                        'DD MMM YYYY hh:mm A'
                      )}
                    </span>
                  </p>
                </div>
              ) : null}
            </div>

            <div
              className={`p-5 mt-6 border ${formik.touched.permissions && formik.errors.permissions?.length ? ' border-red-500' : 'border-schestiLightGray '} rounded-md mb-1`}
            >
              <p className="text-[14px] text-schestiLightBlack leading-5">
                Select permission/access for this role
              </p>

              <div className="grid mt-3 grid-cols-3 gap-3">
                {Object.keys(Plans).map((planKey) => {
                  const value = Plans[planKey as keyof typeof Plans];
                  const disableCheckbox = !userPlanFeatures.includes(value);
                  const isChecked = formik.values.permissions.includes(value);
                  return (
                    <Tooltip
                      className="w-fit"
                      key={value}
                      placement="bottom"
                      title={
                        disableCheckbox
                          ? 'This permission is not available in your plan'
                          : ''
                      }
                    >
                      <Checkbox
                        key={planKey}
                        checked={isChecked}
                        disabled={disableCheckbox}
                        className="text-schestiPrimaryBlack font-normal"
                        onChange={() => {
                          if (isChecked) {
                            handleRemovePermission(value);
                          } else {
                            handleAddPermission(value);
                          }
                        }}
                      >
                        {planKey}
                      </Checkbox>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
            {formik.touched.permissions && formik.errors.permissions?.length ? (
              <p className="text-red-500 text-[12px]">
                {formik.errors.permissions}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </VerticleBar>
  );
}
