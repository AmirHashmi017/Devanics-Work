'use client';
// import Button from '@/app/component/customButton/button';
// import Image from 'next/image';
// import QuaternaryHeading from '@/app/component/headings/quaternary';
// import { ChangeEvent, useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import TertiaryHeading from '@/app/component/headings/tertiary';
import FormControl from '@/app/component/formControl';
import { Formik, Form } from 'formik';
// import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import CustomButton from '@/app/component/customButton/button';
// import { IClient } from '@/app/interfaces/companyInterfaces/companyClient.interface';
// import { PhoneNumberRegex } from '@/app/utils/regex.util';
// import { userService } from '@/app/services/user.service';
// import { toast } from 'react-toastify';
// import VerticleBar from '@/app/(pages)/settings/verticleBar';
// import Description from '@/app/component/description';
import { bg_style } from '@/globals/tailwindvariables';
// import { userRoles } from '@/app/enums/role.enums';
import WhiteButton from '@/app/component/customButton/white';
import { IUser } from '@/app/interfaces/companyEmployeeInterfaces/user.interface';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

// const defaultOptions = [
//   { value: userRoles.COMPANY, label: userRoles.COMPANY },
//   { value: userRoles.ACCOUNTS_MANAGER, label: userRoles.ACCOUNTS_MANAGER },
//   { value: userRoles.ESTIMATOR, label: userRoles.ESTIMATOR },
//   { value: userRoles.PROJECT_MANAGER, label: userRoles.PROJECT_MANAGER },
//   { value: userRoles.SALES_MANAGER, label: userRoles.SALES_MANAGER },
// ];

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submitHandler?: any;
  isLoading?: any;
}

const CreateUserModal = ({ setModalOpen, submitHandler, isLoading }: Props) => {
  console.log(isLoading);

  const newClientSchema: any = Yup.object({
    firstName: Yup.string().required('First name is required!'),
    lastName: Yup.string().required('Last name is required!'),
    email: Yup.string()
      .required('Email is required!')
      .email('Email should be valid'),
    roles: Yup.string().required('Role required'),
  });

  const initialValues: IUser = {
    firstName: '',
    lastName: '',
    email: '',
    roles: '',
    brandingColor: '',
  };

  const companyRolesState = useSelector(
    (state: RootState) => state.companyRoles
  );
  const roleOptions = companyRolesState.data.map((role) => {
    return {
      label: role.name,
      value: role._id,
    };
  });

  return (
    // <VerticleBar>
    <div className="w-full bg-white rounded-lg">
      {/* <div className="flex gap-4 items-center">
          <Image src={'/home.svg'} alt="home icon" width={20} height={20} />
          <Image
            src={'/chevron-right.svg'}
            alt="chevron-right icon"
            width={16}
            height={16}
          />
          <Description title="Setting" className="font-base text-slateGray" />
          <Image
            src={'/chevron-right.svg'}
            alt="chevron-right icon"
            width={16}
            height={16}
          />
          <Description title="Users" className="font-base text-slateGray" />
          <Image
            src={'/chevron-right.svg'}
            alt="chevron-right icon"
            width={16}
            height={16}
          />

          <Description
            title="Add New"
            className="font-semibold text-lavenderPurple cursor-pointer underline"
          />
        </div> */}
      <TertiaryHeading title="Add User" className="p-5 pb-0" />
      <Formik
        initialValues={initialValues}
        validationSchema={newClientSchema}
        onSubmit={submitHandler}
      >
        {({ handleSubmit, errors, values }) => {
          console.log(errors, 'error', values);

          return (
            <Form
              name="basic"
              onSubmit={handleSubmit}
              autoComplete="off"
              className={`${bg_style} p-5`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 ">
                <FormControl
                  control="input"
                  label="First Name"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                />
                <FormControl
                  control="input"
                  label="Last Name"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                />
                <FormControl
                  control="select"
                  label="Role"
                  name="roles"
                  options={roleOptions}
                  placeholder="Select User Role"
                />
                <FormControl
                  control="input"
                  label="email"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                />
              </div>
              <div className="self-end flex justify-end items-center gap-5 md:mt-5 my-3">
                <div className="flex items-center space-x-3">
                  <WhiteButton
                    text="Cancel"
                    className="mx-w-30"
                    onClick={() => setModalOpen(false)}
                  />
                  <CustomButton
                    isLoading={false}
                    className="mx-w-30"
                    type="submit"
                    text={'Add'}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
    // </VerticleBar>
  );
};

export default CreateUserModal;
