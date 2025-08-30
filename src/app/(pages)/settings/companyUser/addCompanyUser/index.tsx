'use client';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

// module imports

import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { bg_style } from '@/globals/tailwindvariables';
import FormControl from '@/app/component/formControl';
import { userService } from '@/app/services/user.service';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type Props = {
  onCancel: () => void;
  onSuccess: (_user: IUserInterface) => void;
  user: IUserInterface | null;
};

const AddNewUser = ({ user, onSuccess, onCancel }: Props) => {
  const [isLoading, setisLoading] = useState(false);
  const companyRolesState = useSelector(
    (state: RootState) => state.companyRoles
  );

  const newClientSchema: any = Yup.object({
    firstName: Yup.string().required('First name is required!'),
    lastName: Yup.string().required('Last name is required!'),
    email: Yup.string()
      .required('Email is required!')
      .email('Email should be valid'),
    roles: Yup.string().required('Role required'),
  });

  const initialValues: Partial<IUserInterface> = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    roles:
      (user &&
        user.roles &&
        (typeof user.roles[0] === 'string'
          ? user.roles[0]
          : user.roles[0]._id)) ||
      ('' as any),
  };

  const roleOptions = companyRolesState.data.map((role) => {
    return {
      label: role.name,
      value: role._id,
    };
  });

  const submitHandler = async (
    values: Partial<IUserInterface>,
    { resetForm }: any
  ) => {
    setisLoading(true);
    if (user) {
      userService
        .httpUpdateEmployee({ ...values, roles: [values.roles] }, user._id)
        .then((response) => {
          setisLoading(false);
          if (response.statusCode == 201) {
            onSuccess(response.data.user);
            resetForm();
            onCancel();
          } else {
            toast.error(response.message);
          }
        })
        .catch((error: any) => {
          setisLoading(false);
          toast.error(error.response.data.message);
        });
    } else {
      userService
        .httpAddNewEmployee({ ...values, roles: [values.roles] })
        .then((response) => {
          setisLoading(false);
          if (response.statusCode == 201) {
            onSuccess(response.data.user);
            resetForm();
            onCancel();
          } else {
            toast.error(response.message);
          }
        })
        .catch((error: any) => {
          setisLoading(false);
          toast.error(error.response.data.message);
        });
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={newClientSchema}
      onSubmit={submitHandler}
      enableReinitialize
    >
      {({ handleSubmit }) => {
        return (
          <Form
            name="basic"
            onSubmit={handleSubmit}
            autoComplete="off"
            className={`${bg_style} p-5`}
          >
            <p
              className={
                'text-schestiPrimaryBlack text-[18px] font-medium mb-3'
              }
            >
              Add User
            </p>
            <div className="grid grid-cols-1 gap-4 ">
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
                  onClick={onCancel}
                />
                <CustomButton
                  isLoading={isLoading}
                  className="mx-w-30"
                  type="submit"
                  text={user ? 'Update' : 'Invite'}
                />
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddNewUser;
