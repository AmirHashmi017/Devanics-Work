import { InputComponent } from 'src/components/CustomInput/Input';
import PrimaryHeading from 'src/components/Headings/Primary';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { FaUsersGear } from 'react-icons/fa6';
import { PiStudentFill } from 'react-icons/pi';
import { GrUserWorker } from 'react-icons/gr';
import { TbUserStar } from 'react-icons/tb';
import { TbUsersGroup } from 'react-icons/tb';
import { GiTeacher } from 'react-icons/gi';
import { RiMapPinUserLine } from 'react-icons/ri';
import { GiPencilRuler } from 'react-icons/gi';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import { TextAreaComponent } from 'src/components/textarea';
import CustomButton from 'src/components/CustomButton/button';
import WhiteButton from 'src/components/CustomButton/white';
import { FormikProps } from 'formik';
import { EmailNotificationData } from 'src/services/email-notifiication.service';
import { useNavigate } from 'react-router-dom';
import { Routes } from 'src/pages/Plans/utils';
import _ from 'lodash';
import { EmailType } from './EmailType';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { RiLayoutBottomFill } from 'react-icons/ri';
import { IoPersonAdd } from 'react-icons/io5';

import EmailInput from './EmailInput';
import { useState } from 'react';
import { EditorComponent } from 'src/components/editor';
type Props = {
  formTitle: string;
  isLoading: boolean;
  formik: FormikProps<EmailNotificationData>;
};

const Users_Data = [
  { label: 'All Users', value: 'All', Icon: FaUsersGear },
  { label: 'Student', value: USER_ROLE_ENUM.STUDENT, Icon: PiStudentFill },
  { label: 'Professor', value: USER_ROLE_ENUM.PROFESSOR, Icon: GiTeacher },
  { label: 'Contractor', value: USER_ROLE_ENUM.CONTRACTOR, Icon: GrUserWorker },
  {
    label: 'SubContractor',
    value: USER_ROLE_ENUM.SUBCONTRACTOR,
    Icon: TbUserStar,
  },
  { label: 'Owner', value: USER_ROLE_ENUM.OWNER, Icon: TbUsersGroup },
  { label: 'Vendor', value: USER_ROLE_ENUM.VENDOR, Icon: RiMapPinUserLine },
  { label: 'Architect', value: USER_ROLE_ENUM.ARCHITECT, Icon: GiPencilRuler },
  { label: 'Invitation', value: 'Invitation', Icon: IoPersonAdd },
] as const;

const RolesWithoutAll = Users_Data.filter((user) => user.value !== 'All');

export function EmailNotificationForm({ formTitle, formik, isLoading }: Props) {
  const navigate = useNavigate();
  const [showCC, setShowCC] = useState(false);

  function handleClickRole(role: string) {
    if (role === 'All') {
      if (formik.values.roles.length === RolesWithoutAll.length) {
        formik.setFieldValue('roles', []);
      } else {
        formik.setFieldValue(
          'roles',
          RolesWithoutAll.map((user) => user.value)
        );
      }
    } else {
      if (formik.values.roles.includes(role as USER_ROLE_ENUM)) {
        formik.setFieldValue(
          'roles',
          formik.values.roles.filter((user) => user !== role)
        );
      } else {
        formik.setFieldValue('roles', [...formik.values.roles, role]);
      }
    }
  }

  function isAllSelectedAll() {
    return formik.values.roles.length === RolesWithoutAll.length;
  }

  return (
    <div className="p-8">
      <PrimaryHeading title={formTitle} className="text-[20px]" />

      <div className="my-6 space-y-5">
        <div className="">
          <TertiaryHeading title="Email Type" />
          <div className="grid grid-cols-2 gap-4">
            <EmailType
              Icon={AiOutlineMenuUnfold}
              title="Custom Email"
              isActive={formik.values.type === 'custom'}
              onClick={() => {
                formik.setFieldValue('type', 'custom');
              }}
            />
            <EmailType
              Icon={RiLayoutBottomFill}
              title="Marketing Email"
              isActive={formik.values.type === 'marketing'}
              onClick={() => {
                formik.setFieldValue('type', 'marketing');
              }}
            />
          </div>
        </div>

        <InputComponent
          label="Subject"
          name="title"
          type="text"
          placeholder="Subject"
          labelStyle="text-lg font-semibold"
          hasError={formik.touched.title && Boolean(formik.errors.title)}
          errorMessage={
            formik.touched.title && formik.errors.title
              ? formik.errors.title
              : undefined
          }
          field={{
            value: formik.values.title ? formik.values.title : undefined,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
        />

        <div className="gap-2">
          <TertiaryHeading title="Select Users" />

          <div
            className={`grid gap-3 mt-3 grid-cols-3 ${
              formik.touched.roles && Boolean(formik.errors.roles?.length)
                ? 'border-red-500'
                : ''
            }`}
          >
            {Users_Data.map((item) => {
              return (
                <div
                  className={`border text-center items-center px-8 py-4 flex flex-col text-xs justify-center w-[180px] gap-3 rounded-md cursor-pointer shadow-md  ${
                    isAllSelectedAll()
                      ? 'border-schestiPrimary bg-schestiLightPrimary'
                      : formik.values.roles.includes(
                            item.value as USER_ROLE_ENUM
                          )
                        ? 'border-schestiPrimary bg-schestiLightPrimary'
                        : 'border-[#E2E8F0] bg-white'
                  }`}
                  onClick={() => handleClickRole(item.value)}
                  key={item.value}
                >
                  <item.Icon className="text-2xl" />
                  <SenaryHeading title={item.label} />
                </div>
              );
            })}
          </div>

          <div className="pt-3">
            {formik.touched.roles && Boolean(formik.errors.roles?.length) ? (
              <p className="text-red-500 text-xs">{formik.errors.roles}</p>
            ) : (
              formik.touched.roles &&
              formik.errors.roles && (
                <p className="text-red-500 text-xs">{formik.errors.roles}</p>
              )
            )}
          </div>
        </div>

        {formik.values.roles.includes('Invitation') ? (
          <div className="space-y-2">
            <EmailInput
              title="To:"
              values={formik.values.invitees}
              key={'to'}
              onAdd={(email) => {
                formik.setFieldValue('invitees', [
                  ...formik.values.invitees,
                  email,
                ]);
              }}
              onRemove={(index) => {
                formik.setFieldValue(
                  'invitees',
                  formik.values.invitees.filter((_, i) => i !== index)
                );
              }}
              onAddMultiple={(emails) => {
                formik.setFieldValue('invitees', [
                  ...formik.values.invitees,
                  ...emails,
                ]);
              }}
            />

            {formik.values.cc.length ? (
              <EmailInput
                title="CC:"
                values={formik.values.cc}
                key={'cc'}
                onAdd={(email) => {
                  formik.setFieldValue('cc', [...formik.values.cc, email]);
                }}
                onRemove={(index) => {
                  formik.setFieldValue(
                    'cc',
                    formik.values.cc.filter((_, i) => i !== index)
                  );
                }}
                onAddMultiple={(emails) => {
                  formik.setFieldValue('cc', [...formik.values.cc, ...emails]);
                }}
              />
            ) : !showCC ? (
              <CustomButton
                text="Add CC"
                className="!w-fit !bg-schestiLightPrimary  !text-schestiPrimary"
                onClick={() => setShowCC(true)}
              />
            ) : (
              <EmailInput
                title="CC:"
                values={formik.values.cc}
                key={'cc'}
                onAdd={(email) => {
                  formik.setFieldValue('cc', [...formik.values.cc, email]);
                }}
                onRemove={(index) => {
                  formik.setFieldValue(
                    'cc',
                    formik.values.cc.filter((_, i) => i !== index)
                  );
                }}
                onAddMultiple={(emails) => {
                  formik.setFieldValue('cc', [...formik.values.cc, ...emails]);
                }}
              />
            )}
          </div>
        ) : null}

        <EditorComponent
          value={formik.values.message}
          onChange={(val) => {
            formik.setFieldValue('message', val);
          }}
        />

        <div className="flex justify-end items-center space-x-3">
          <WhiteButton
            text="Cancel"
            onClick={() => {
              navigate(Routes.Email_Notification.List);
            }}
            className="!w-fit"
          />

          <CustomButton
            text="Send Notification"
            className="!w-fit"
            icon="/assets/icons/plus.svg"
            iconheight={20}
            iconwidth={20}
            isLoading={isLoading}
            onClick={() => formik.handleSubmit()}
          />
        </div>
      </div>
    </div>
  );
}
