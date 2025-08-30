'use client';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form } from 'antd';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
// module imports
import { AppDispatch } from '@/redux/store';
import FormControl from '@/app/component/formControl';
import Button from '@/app/component/customButton/button';
import WelcomeWrapper from '@/app/component/welcomeLayout';
import Description from '@/app/component/description';
import PrimaryHeading from '@/app/component/headings/primary';
import { IForgotPasswordInterface } from '@/app/interfaces/authInterfaces/forgotPassword.interface';
import { forgotPasswordHandler } from '@/redux/authSlices/auth.thunk';
import { toast } from 'react-toastify';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const initialValues: IForgotPasswordInterface = {
  email: '',
};

const ForgotPasswordSchema: any = Yup.object({
  email: Yup.string().required('Email is required!').email('Invalid email!'),
});

const ForgetPassword = () => {
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (values: IForgotPasswordInterface) => {
    setIsLoading(true);
    let result: any = await dispatch(forgotPasswordHandler(values));

    if (result.payload.statusCode == 200) {
      setIsLoading(false);
      router.push(`/sendcode?email=${values.email}`);
    } else {
      setIsLoading(false);
      toast.error(result.payload.message);
    }
  };
  return (
    <WelcomeWrapper>
      <Image
        className="cursor-pointer"
        src={'/logo.svg'}
        alt="logo website"
        width={100}
        height={30}
        onClick={() => router.push('/')}
      />
      <div className="h-full grid place-items-center">
        <div className="w-full max-w-md ">
          <PrimaryHeading title="Forget Password" className="text-center" />
          <Description
            className="text-center mt-2 mb-10 font-normal leading-[24px] text-slateGray"
            title="Enter the email address associated with your account and we'll send
            you a link to reset your password"
          />
          <Formik
            initialValues={initialValues}
            validationSchema={ForgotPasswordSchema}
            onSubmit={submitHandler}
          >
            {(formik: any) => {
              return (
                <Form
                  name="basic"
                  onFinish={formik.handleSubmit}
                  autoComplete="off"
                  validateMessages={ForgotPasswordSchema}
                >
                  <div className="mt-10">
                    <FormControl
                      control="input"
                      label="Email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <Button
                    isLoading={isLoading}
                    text="Reset Password"
                    className="!p-[12px] mt-10"
                    type="submit"
                  />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </WelcomeWrapper>
  );
};

export default ForgetPassword;
