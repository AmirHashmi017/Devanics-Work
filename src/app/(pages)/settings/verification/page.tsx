'use client';
import { withAuth } from '@/app/hoc/withAuth';
import SettingSidebar from '../verticleBar';
import { ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useUser } from '@/app/hooks/useUser';
import AwsS3 from '@/app/utils/S3Intergration';
import { addVerificationDetails } from '@/redux/authSlices/auth.thunk';
import { toast } from 'react-toastify';
import PrimaryHeading from '@/app/component/headings/primary';
import { Alert, Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import CustomButton from '@/app/component/customButton/button';

function VerificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [license, setLicense] = useState<any>(null);
  const [preQualification, setPreQualification] = useState<any>(null);
  const [secretaryOfState, setSecretaryOfState] = useState<any>(null);
  const dispatch: any = useDispatch();
  const authUser = useUser();

  const submitHandler = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    const data: any = { userId: authUser?._id, ...authUser?.verificationsData };

    try {
      if (license && !license?.url) {
        const url = await new AwsS3(license, 'verification/license').getS3URL();
        data.license = {
          name: license.name,
          url,
          type: license.type,
          extension: license.name.split('.').pop(),
        };
      }
      if (secretaryOfState && !secretaryOfState?.url) {
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
      if (preQualification && !preQualification?.url) {
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
        });
    } catch (err) {
      console.error('Verifications data error: ', err);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
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
    }
  };
  const isAllowToSubmit = () => {
    return !license && !preQualification && !secretaryOfState;
  };

  useEffect(() => {
    if (authUser && authUser.verificationsData) {
      setLicense(authUser.verificationsData.license);
      setSecretaryOfState(authUser.verificationsData.secretaryOfState);
      setPreQualification(authUser.verificationsData.preQualification);
    }
  }, [authUser]);

  return (
    <SettingSidebar>
      <div className="w-full max-w-xl mx-auto">
        {authUser && authUser.verification ? (
          <Alert
            message="Verification"
            description="Your account is verified"
            type="success"
            showIcon
          />
        ) : null}
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
                            or drag and drop
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
                            or drag and drop
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
            <CustomButton
              isLoading={isLoading}
              onClick={submitHandler}
              text="Save"
              className={`w-full my-3 ${isAllowToSubmit() ? 'disabled' : ''}`}
              type="submit"
              disabled={isAllowToSubmit()}
            />
          </Form>
        </div>
      </div>
    </SettingSidebar>
  );
}

export default withAuth(VerificationPage);
