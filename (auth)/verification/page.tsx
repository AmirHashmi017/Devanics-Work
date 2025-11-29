/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { ChangeEvent, useState } from 'react';
import { Form } from 'antd';
import { twMerge } from 'tailwind-merge';

// module imports
import Progessbar from '@/app/component/progressBar';
import PrimaryHeading from '@/app/component/headings/primary';
import Button from '@/app/component/customButton/button';
import { tertiaryHeading } from '@/globals/tailwindvariables';

import AuthNavbar from '@/app/(pages)/(auth)/authNavbar';
import { Flex, Progress } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addVerificationDetails } from '@/redux/authSlices/auth.thunk';
import AwsS3 from '@/app/utils/S3Intergration';
import { RootState } from '@/redux/store';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import Image from 'next/image';
import { usePricing } from '../usePricing';

const RegisterVerification = () => {
  const router = useRouterHook();
  const dispatch: any = useDispatch();
  const pricingHook = usePricing();
  const auth = useSelector((state: RootState) => state.auth);
  const { user: userData } = auth;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkip, setIsLoadingSkip] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadInterval, setUploadInterval] = useState<any>(null);
  const [license, setLicense] = useState<any>(null);
  const [preQualification, setPreQualification] = useState<any>(null);
  const [secretaryOfState, setSecretaryOfState] = useState<any>(null);

  const submitHandler = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    const data: any = { userId: userData?.user?._id };

    try {
      if (license) {
        const url = await new AwsS3(license, 'verification/license').getS3URL();
        data.license = {
          name: license.name,
          url,
          type: license.type,
          extension: license.name.split('.').pop(),
        };
      }
      if (secretaryOfState) {
        const url = await new AwsS3(
          secretaryOfState,
          'verification/secretaryOfState'
        ).getS3URL();
        data.secretaryOfState = {
          name: secretaryOfState.name,
          url,
          type: secretaryOfState.type,
          extension: secretaryOfState.name.split('.').pop(),
        };
      }
      if (preQualification) {
        const url = await new AwsS3(
          preQualification,
          'verification/preQualification'
        ).getS3URL();
        data.preQualification = {
          name: preQualification.name,
          url,
          type: preQualification.type,
          extension: preQualification.name.split('.').pop(),
        };
      }

      dispatch(addVerificationDetails(data))
        .unwrap()
        .then(() => {
          setIsLoading(false);
          if (pricingHook.getValueFromStorage()) {
            router.push('/payment');
          } else {
            router.push('/plans');
          }
        });
    } catch (err) {
      console.error('Verifications data error: ', err);
    }
  };

  const handleSkipClick = () => {
    setIsLoadingSkip(true);
    if (pricingHook.getValueFromStorage()) {
      router.push('/payment');
    } else {
      router.push('/plans');
    }
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    keyName: string
  ) => {
    const file = event.target.files?.[0];
    // const keyName = event.target.name;
    if (file) {
      // setFileName(file.name);
      if (keyName == 'license') {
        setLicense(file);
      } else if (keyName == 'secretaryOfState') {
        setSecretaryOfState(file);
      } else if (keyName == 'preQualification') {
        setPreQualification(file);
      }

      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 1000);
      setUploadInterval(interval);
    }
  };

  // const handleCancelUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   setFileName('');
  //   setUploadProgress(0);
  //   if (uploadInterval) {
  //     clearInterval(uploadInterval);
  //     setUploadInterval(null);
  //   }
  // };

  const isAllowToSubmit = () => {
    return !license && !preQualification && !secretaryOfState;
  };

  return (
    <>
      <AuthNavbar />
      <div className="h-[calc(100vh-100px)] mt-4 grid place-items-center">
        <div className="w-full max-w-xl">
          <h2
            className={twMerge(
              `${tertiaryHeading} border-b-2 border-[#E7E7E7]`
            )}
          >
            Verification
          </h2>
          <div className="mt-6 bg-white shadow-tertiaryMystery p-10 rounded-lg">
            <PrimaryHeading title="Verification" className="text-center mb-4" />
            <p className="px-2 text-center text-[#344054] font-normal leading-6">
              Upload all the documents to get schesti verification badge. That
              will help to get more project
            </p>
            <Form name="basic" className="mt-4" autoComplete="off">
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="myInput"
                  className="border-b-2 text-schestiLightBlack border-[#E7E7E7] pb-2"
                >
                  Secretary of State
                </label>
                <div className="flex items-center">
                  <label
                    htmlFor="secretaryOfState-file"
                    className="flex flex-col items-start justify-start w-full border border-[#EAECF0] border-solid rounded-lg cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center justify-start p-2 w-full">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={'/uploadcloud.svg'}
                          alt="upload"
                          width={20}
                          height={20}
                        />
                        <div>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-schestiPrimary">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                          </p>
                          {secretaryOfState && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {secretaryOfState?.name}
                            </p>
                          )}
                        </div>
                      </div>
                      {secretaryOfState && (
                        <div className="ml-auto">
                          <DeleteOutlined
                            className="text-red-500 text-2xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setSecretaryOfState(null);
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <input
                      id="secretaryOfState-file"
                      name="secretaryOfState"
                      type="file"
                      className="!hidden"
                      onChange={(e) => handleFileChange(e, 'secretaryOfState')}
                    />
                  </label>
                </div>
                <label
                  htmlFor="myInput"
                  className="border-b-2 text-schestiLightBlack border-[#E7E7E7] pb-2"
                >
                  License if needed
                </label>
                <div className="flex items-center">
                  <label
                    htmlFor="license-file"
                    className="flex flex-col items-start justify-start w-full border border-[#EAECF0] border-solid rounded-lg cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center justify-start p-2 w-full">
                      <div className="flex items-center space-x-2 flex-1">
                        <Image
                          src={'/uploadcloud.svg'}
                          alt="upload"
                          width={20}
                          height={20}
                        />
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold text-schestiPrimary">
                                Click to upload
                              </span>{' '}
                              or drag and drop {fileName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (max. 800x400px)
                            </p>
                            {license && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {license?.name}
                              </p>
                            )}
                          </div>
                        </div>
                        {license && (
                          <div className="ml-auto">
                            <DeleteOutlined
                              className="text-red-500 text-2xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setLicense(null);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      id="license-file"
                      type="file"
                      name="license"
                      className="!hidden"
                      onChange={(e) => handleFileChange(e, 'license')}
                    />
                  </label>
                </div>

                <label
                  htmlFor="myInput"
                  className="border-b-2 text-schestiLightBlack border-[#E7E7E7] pb-2"
                >
                  Prequalification
                </label>
                <div className="flex items-center">
                  <label
                    htmlFor="preQualification-file"
                    className="flex flex-col items-start justify-start w-full border border-[#EAECF0] border-solid rounded-lg cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center justify-start p-2 w-full">
                      <div className="flex flex-1 space-x-2 items-center">
                        <Image
                          src={'/uploadcloud.svg'}
                          alt="upload"
                          width={20}
                          height={20}
                        />
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold text-schestiPrimary">
                                Click to upload
                              </span>{' '}
                              or drag and drop {fileName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (max. 800x400px)
                            </p>
                            {preQualification && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {preQualification?.name}
                              </p>
                            )}
                          </div>
                        </div>
                        {preQualification && (
                          <div className="ml-auto">
                            <DeleteOutlined
                              className="text-red-500 text-2xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setPreQualification(null);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      id="preQualification-file"
                      type="file"
                      name="preQualification"
                      className="!hidden"
                      onChange={(e) => handleFileChange(e, 'preQualification')}
                    />
                  </label>
                </div>
              </div>
              <Button
                isLoading={isLoading}
                onClick={submitHandler}
                text="Next"
                className={`w-full my-3 ${isAllowToSubmit() ? 'disabled' : ''}`}
                type="submit"
              />
              <div className="skipBtn-icon">
                <span
                  className={`${isLoading ? 'disabled' : ''}`}
                  onClick={handleSkipClick}
                >
                  Skip
                </span>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterVerification;
