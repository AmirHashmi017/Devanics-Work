'use client';
import React, { useState } from 'react';
import Button from '@/app/component/customButton/button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Checkbox, ConfigProvider, Form } from 'antd';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Link from 'next/link';

// module imports
import FormControl from '@/app/component/formControl';
import { btnStyle, quinaryHeading } from '@/globals/tailwindvariables';
import WelcomeWrapper from '@/app/component/welcomeLayout';
import { ISignUpInterface } from '@/app/interfaces/authInterfaces/signup.interface';
import PrimaryHeading from '@/app/component/headings/primary';
import Description from '@/app/component/description';
import { signup, loginWithGoogle } from '@/redux/authSlices/auth.thunk';
import { AppDispatch } from '@/redux/store';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { USER_ROLES_ENUM } from '@/app/constants/constant';
import UserRoleModal from '../userRolesModal';
import { ShouldHaveAtLeastCharacterRegex } from '@/app/utils/regex.util';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { authService } from '@/app/services/auth.service';
import { CheckOtherRoles, navigateUserWhileAuth } from '@/app/utils/auth.utils';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { setAuthToken, setUserAction } from '@/redux/authSlices/authSlice';

const { CONTRACTOR } = USER_ROLES_ENUM;

const initialValues: ISignUpInterface = {
  name: '',
  userRole: CONTRACTOR,
  email: '',
  password: '',
  confirmPassword: '',
};

const RegisterSchema: any = Yup.object({
  name: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'Name should have atleast 1 character',
    })
    .max(30, 'Name must have atleast 30 characters')
    .required('Name is required'),
  email: Yup.string()
    .required('Email is required!')
    .email('Email should be valid'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
    ),
  confirmPassword: Yup.string()
    .required('Confirm Password is required!')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  isTermsAccepted: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions'
  ),
});

const Register = () => {
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);
  const [userRoleModal, setUserRoleModal] = useState(false);
  const [userRegisterModal, setUserRegisterModal] = useState(false);
  const [userDetail, setUserDetail] = useState<any>([]);
  let userRoles = [
    {
      role: USER_ROLES_ENUM.OWNER,
      desc: 'Take control of your project with ease by optimizing estimates, bidding, contracts, and finances, ensuring efficient execution and maximizing ROI.',
      avatar: 'owner',
    },
    {
      role: USER_ROLES_ENUM.CONTRACTOR,
      desc: 'Boost efficiency by managing estimates, takeoffs, bids, contracts, and finances for quicker completion and higher profits.',
      avatar: 'contractor',
    },
    {
      role: USER_ROLES_ENUM.SUBCONTRACTOR,
      desc: 'Keep your projects on track by efficiently managing takeoffs, bids, contracts, and financials for superior execution and greater success.',
      avatar: 'sub-contractor',
    },
    {
      role: USER_ROLES_ENUM.PROFESSOR,
      desc: 'Prepare students for real-world projects with powerful tools for estimation, bidding, and contract management to enhance their professional skills.',
      avatar: 'professor',
    },
    {
      role: USER_ROLES_ENUM.STUDENT,
      desc: 'Get career-ready by mastering cost estimation, bidding, and contract management for a successful future in construction.',
      avatar: 'student',
    },
    {
      role: USER_ROLES_ENUM.VENDOR,
      desc: 'Enhance your supply chain by managing orders, contracts, and relationships for optimized efficiency and profitability.',
      avatar: 'vendor',
    },
    {
      role: USER_ROLES_ENUM.ARCHITECT,
      desc: 'Transform your designs into reality by managing estimates, takeoffs, bids, and contracts for seamless execution and successful project delivery.',
      avatar: 'architect',
    },
  ];

  // const [role, setRole] = useState(CONTRACTOR);
  // const handleRoleChange = (value: string) => {
  //   setRole(value);
  // };

  const submitHandler = async (values: ISignUpInterface) => {
    setUserRegisterModal(true);
    setUserDetail(values);
  };

  const userRegisterHandler = async (role: string) => {
    const payload = { ...userDetail, userRole: role };
    setIsLoading(true);
    setUserRegisterModal(false);
    let result: any = await dispatch(signup(payload));

    if (result.payload.status == 201) {
      setIsLoading(false);
      router.push(`/checkmail?email=${userDetail.email}`);
    } else {
      setIsLoading(false);
      toast.error(result.payload.message);
    }
  };

  const googleAuthenticationHandler: any = useGoogleLogin({
    onSuccess: async (respose: any) => {
      const googleAuthResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${respose.access_token}`,
          },
        }
      );
      try {
        let responseObj = {
          email: googleAuthResponse.data.email,
          name: googleAuthResponse.data.name,
          avatar: googleAuthResponse.data.picture,
          providerId: googleAuthResponse.data.sub,
        };

        const checkUserExist: any =
          await authService.httpSocialAuthUserVerification({
            email: googleAuthResponse.data.email,
          });
        if (checkUserExist.data) {
          localStorage.setItem('schestiToken', checkUserExist.token);
          dispatch(setUserAction(checkUserExist.data));
          dispatch(setAuthToken({ token: checkUserExist.token }));
          const user = checkUserExist.data.user as IUserInterface;
          if (
            CheckOtherRoles(user.userRole) &&
            (user?.userRole === USER_ROLES_ENUM.PROFESSOR ||
              user?.userRole === USER_ROLES_ENUM.STUDENT) &&
            user?.isActive === 'pending'
          ) {
            const responseLink = navigateUserWhileAuth(user);
            if (responseLink) {
              router.push(responseLink);
              return;
            } else {
              console.log('You are not allowed to login. ');
              toast.warning('You are not allowed to login. ');
            }
          } else {
            const responseLink = navigateUserWhileAuth(user);

            if (responseLink) {
              router.push(responseLink);
              return;
            } else {
              console.log('You are not allowed to login. ');
              toast.warning('You are not allowed to login. ');
            }
          }
        } else {
          setUserRoleModal(true);
          setUserDetail(responseObj);
        }
      } catch (error) {
        let responseObj = {
          email: googleAuthResponse.data.email,
          name: googleAuthResponse.data.name,
          avatar: googleAuthResponse.data.picture,
          providerId: googleAuthResponse.data.sub,
        };
        setUserRoleModal(true);
        setUserDetail(responseObj);
        console.log('Login Failed', error);
      }
    },
    onError: (error: any) => {
      console.log('Login Failed', error);
    },
  });

  const userRoleSelectionHandler = async (role: string) => {
    setIsLoading(true);
    setUserRoleModal(false);
    let result: any = await dispatch(
      loginWithGoogle({ ...userDetail, userRole: role })
    );
    setIsLoading(false);
    if (result.payload.statusCode == 200) {
      localStorage.setItem('schestiToken', result.payload.token);
      router.push(`/dashboard`);
    } else if (result.payload.statusCode == 400) {
      router.push(`/companydetails/${result.payload.data.user._id}`);
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
      <section className=" grid place-items-center h-full">
        <div className="w-full max-w-md">
          <PrimaryHeading
            className="text-center"
            title="
            Registration
            "
          />
          <Description
            className="my-2 text-center text-slateGray"
            title=" Sign up to your account"
          />
          {/* <div className="flex items-center bg-silverGray justify-between space-x-4 bg-gray-200 rounded-md p-2 mt-6 mb-3">
            <button
              className={`toggle-btn block p-2 text-center rounded-md cursor-pointer ${
                role === CONTRACTOR
                  ? 'bg-lavenderPurple text-white'
                  : 'bg-transparent'
              }`}
              onClick={() => handleRoleChange(CONTRACTOR)}
            >
              General-Contractor
            </button>
            <button
              className={`toggle-btn block p-2 text-center rounded-md cursor-pointer ${
                role === SUBCONTRACTOR
                  ? 'bg-lavenderPurple text-white'
                  : 'bg-transparent'
              }`}
              onClick={() => handleRoleChange(SUBCONTRACTOR)}
            >
              Sub-Contractor
            </button>
            <button
              className={`toggle-btn block p-2 text-center rounded-md cursor-pointer ${
                role === OWNER
                  ? 'bg-lavenderPurple text-white'
                  : 'bg-transparent'
              }`}
              onClick={() => handleRoleChange(OWNER)}
            >
              Owner
            </button>
          </div> */}

          <Formik
            initialValues={{ ...initialValues, isTermsAccepted: false }}
            validationSchema={RegisterSchema}
            onSubmit={submitHandler}
          >
            {(formik) => {
              return (
                <Form
                  name="basic"
                  onFinish={formik.handleSubmit}
                  autoComplete="off"
                >
                  <div className="flex flex-col gap-3">
                    <FormControl
                      control="input"
                      label="Name"
                      type="text"
                      name="name"
                      placeholder="Enter your Name"
                    />
                    <FormControl
                      control="input"
                      label="email"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                    />
                    <FormControl
                      control="password"
                      label="Password"
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    <FormControl
                      control="password"
                      label="Confirm password"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                    />
                    <ConfigProvider
                      theme={{
                        components: {
                          Checkbox: {
                            colorPrimary: '#FFC107',
                            colorPrimaryHover: '#FFC107',
                            colorBorder: '#FFC107',
                          },
                        },
                      }}
                    >
                      <Checkbox
                        name="isTermsAccepted"
                        checked={formik.values.isTermsAccepted}
                        onChange={formik.handleChange}
                        className="text-xs"
                      >
                        By clicking Register, you agree to our{' '}
                        <Link
                          href={'/terms'}
                          target="_blank"
                          className="text-blue-500 font-normal underline underline-offset-2 hover:text-blue-500 hover:underline"
                        >
                          Terms & Conditions
                        </Link>
                        . You may receive Email Notifications from us and can
                        opt out any time.
                      </Checkbox>
                    </ConfigProvider>
                    {formik.errors.isTermsAccepted &&
                    formik.touched.isTermsAccepted ? (
                      <p className="mt-1 text-red-500">
                        {formik.errors.isTermsAccepted}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    text="Register"
                    className="!p-[12px] mt-4"
                    type="submit"
                    isLoading={isLoading}
                  />
                  <div className="flex justify-between items-center gap-[17px] self-stretch my-6">
                    <div className="w-[100%] h-[1px] bg-lightSteelGray"></div>
                    <span className={quinaryHeading}>Or</span>
                    <div className="w-[100%] h-[1px] bg-lightSteelGray"></div>
                  </div>
                  <button
                    className={twMerge(
                      ` ${btnStyle} ${quinaryHeading} font-semibold flex items-center justify-center gap-3 bg-snowWhite border-2 shadow-scenarySubdued border-doveGray`
                    )}
                    type="button"
                    onClick={googleAuthenticationHandler}
                  >
                    <Image
                      src={'/googleicon.svg'}
                      alt="google icon"
                      width={24}
                      height={24}
                      className="mr-1"
                    />
                    Signin with Google
                  </button>

                  <div className=" flex gap-2  justify-center mt-4">
                    <Description
                      className="text-ebonyGray"
                      title=" Already have an account?"
                    />
                    <p
                      onClick={() => router.push('/login')}
                      className={twMerge(`${quinaryHeading} font-[700]
                   cursor-pointer hover:underline`)}
                    >
                      Sign In
                    </p>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </section>
      <UserRoleModal
        viewUserRoleModal={userRoleModal}
        setViewUserRoleModal={setUserRoleModal}
        userRoles={userRoles}
        userRoleSelectionHandler={userRoleSelectionHandler}
      />
      <UserRoleModal
        viewUserRoleModal={userRegisterModal}
        setViewUserRoleModal={setUserRegisterModal}
        userRoles={userRoles}
        userRoleSelectionHandler={userRegisterHandler}
      />
    </WelcomeWrapper>
  );
};

export default Register;
