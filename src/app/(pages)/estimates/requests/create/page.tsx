'use client';
import React, { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import { useDispatch } from 'react-redux';
import { withAuth } from '@/app/hoc/withAuth';
import { Upload, type UploadProps } from 'antd';
import { useSearchParams } from 'next/navigation';
// module imports

import { AppDispatch } from '@/redux/store';
import AwsS3 from '@/app/utils/S3Intergration';
import ModalComponent from '@/app/component/modal';
import FormControl from '@/app/component/formControl';
import { fetchUsers } from '@/redux/userSlice/user.thunk';
import { byteConverter } from '@/app/utils/byteConverter';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import CustomButton from '@/app/component/customButton/button';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { IUserInterface } from '@/app/interfaces/user.interface';
import CustomWhiteButton from '@/app/component/customButton/white';
import { fetchCompanyClients } from '@/redux/company/company.thunk';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { minHeading, senaryHeading } from '@/globals/tailwindvariables';
import { estimateRequestService } from '@/app/services/estimates.service';
import AddNewUser from '@/app/(pages)/settings/companyUser/addCompanyUser';
import { ListCrmItems } from '@/app/(pages)/contracts/components/ListCrmItems';
import { getCompanyRolesThunk } from '@/redux/company-roles/company-roles.thunk';
import { IClient } from '@/app/interfaces/companyInterfaces/companyClient.interface';
import { IUser } from '@/app/interfaces/estimateRequests/estimateAssignedUser.interface';
import { IEstimateRequest } from '@/app/interfaces/estimateRequests/estimateRequests.interface';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';

const clientInfoSchema: any = Yup.object({
  clientName: Yup.string().required('Client is required!'),
  companyName: Yup.string().required('Company name is required!'),
  email: Yup.string()
    .required('Email is required!')
    .email('Email should be valid'),
  phone: Yup.string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(14, 'Phone number must be at most 12 characters')
    .required('Phone number is required'),
  projectName: Yup.string().required('Project name is required!'),
  leadSource: Yup.string().required('Lead source is required!'),
  projectValue: Yup.number().required('Project value is required!'),
  projectInformation: Yup.string().required('Project info is required!'),
  salePerson: Yup.string(),
  estimator: Yup.string(),
  // architectureDocuments: Yup.array(
  //   Yup.object({
  //     name: Yup.string().required(),
  //     size: Yup.string().required(),
  //     ext: Yup.string().required(),
  //     url: Yup.string().required(),
  //   })
  // ).min(1, 'architectureDocuments required'),
  // otherDocuments: Yup.array(
  //   Yup.object({
  //     name: Yup.string().required(),
  //     size: Yup.string().required(),
  //     ext: Yup.string().required(),
  //     url: Yup.string().required(),
  //   })
  // ).min(1, 'otherDocuments required'),
});

const CreateEstimateRequest = () => {
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const paramsClientId = searchParams.get('clientId');

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<IUserInterface[]>([]);
  const [uploadDocumentsError, setuploadDocumentsError] = useState('');
  const [drawingsDocuments, setDrawingsDocuments] = useState<any>([]);
  const [takeOffReports, setTakeOffReports] = useState<any>([]);
  const [otherDocuments, setOtherDocuments] = useState<any>([]);
  const [createUserModal, setCreateUserModal] = useState(false);
  const [selectedClientDetail, setSelectedClientDetail] = useState<IClient>();

  const initialValues: IEstimateRequest = {
    clientName: selectedClientDetail ? selectedClientDetail.firstName : '',
    companyName: selectedClientDetail ? selectedClientDetail.lastName : '',
    email: selectedClientDetail ? selectedClientDetail.email : '',
    phone: selectedClientDetail ? selectedClientDetail.phone : '',
    projectName: '',
    leadSource: '',
    projectValue: '',
    projectInformation: '',
    salePerson: '',
    estimator: '',
  };

  const fetchClients = useCallback(async () => {
    let { payload }: any = await dispatch(
      fetchCompanyClients({ page: 1, limit: 10 })
    );
    if (paramsClientId) {
      const extractClientDetail = payload?.data?.clients;
      let selectClient = extractClientDetail.find(
        (client: IClient) => client._id === paramsClientId
      );
      setSelectedClientDetail(selectClient);
    }
  }, []);

  const fetchCompanyEmployeeHandler = useCallback(async () => {
    let result: any = await dispatch(fetchUsers({ limit: 9, page: 1 }));
    const mappedUsers = result.payload?.data?.employees.map((user: IUser) => ({
      value: `${user._id}`,
      label: `${user.firstName} ${user.lastName} - ${user?.roles[0]?.name}`,
    }));
    setUserData(mappedUsers);
  }, []);

  useEffect(() => {
    fetchClients();
    dispatch(getCompanyRolesThunk({}));
    fetchCompanyEmployeeHandler();
  }, []);

  const submitHandler = async (values: IEstimateRequest) => {
    if (drawingsDocuments.length == 0) {
      setuploadDocumentsError('Drawings Document Required');
    }
    // else if (takeOffReports.length == 0) {
    //   setuploadDocumentsError('Takeoff Reports Required');
    // } else if (otherDocuments.length == 0) {
    //   setuploadDocumentsError('Other Documents Required');
    // }
    else {
      setIsLoading(true);
      toast.success('File Uploading...', { autoClose: 50 });

      const drawingDocs = await uploadDocumentToS3Handler(drawingsDocuments);
      const takeOffDocs = await uploadDocumentToS3Handler(takeOffReports);
      const otherDocs = await uploadDocumentToS3Handler(otherDocuments);
      Promise.all([drawingDocs, takeOffDocs, otherDocs])
        .then(() => {
          estimateRequestService
            .httpAddNewEstimateRequest({
              ...values,
              phone: values.phone,
              otherDocuments: otherDocs,
              takeOffReports: takeOffDocs,
              drawingsDocuments: drawingDocs,
              leadSource: `${values.leadSource}`,
              projectValue: `${values.projectValue}`,
            })
            .then((resp: any) => {
              setIsLoading(false);
              if (resp.statusCode == 201) {
                setIsLoading(false);
                router.push('/estimates/requests');
              }
            })
            .catch((error: any) => {
              setIsLoading(false);
              const err = error as AxiosError<{ message: string }>;
              toast.error(err.response?.data?.message || err.message);
            });
        })
        .catch(() => {
          toast.error('Some thing went wrong during document uploading');
        });
    }
  };

  const uploadDocumentToS3Handler = async (
    documents: {
      name: string;
      size: number;
      type: string;
      originFileObj: File;
    }[]
  ) => {
    let documentsData: Object[] = [];
    try {
      documentsData = await Promise.all(
        documents.map(async (doc) => {
          const url = await new AwsS3(
            doc.originFileObj,
            'documents/estimates/'
          ).getS3URL();
          let obj = {
            name: doc.name,
            size: doc.size,
            ext: doc.type,
            url: url,
          };
          return obj;
        })
      );
      return documentsData;
    } catch (error) {
      toast.error('Error uploading documents');
      console.error('Error uploading documents:', error);
    }
  };
  const takeoffReportsUploadHandler: UploadProps['onChange'] = async ({
    fileList,
  }) => {
    setuploadDocumentsError('');
    const documents = fileList;
    if (!documents[0]) {
      return;
    }

    // if (documents[0].size && byteConverter(documents[0].size, 'MB').size > 10) {
    //   setuploadDocumentsError(
    //     'Cannot upload document more then 10 mb of size.'
    //   );
    //   return;
    // }
    for (let i = 0; i < documents.length; i++) {
      setTakeOffReports((prev: any) => [...prev, documents[i]]);
    }
  };

  const otherDocumentsUploadHandler: UploadProps['onChange'] = ({
    fileList,
  }) => {
    setuploadDocumentsError('');
    const documents = fileList;
    if (!documents[0]) {
      return;
    }

    // if (documents[0].size && byteConverter(documents[0].size, 'MB').size > 10) {
    //   setuploadDocumentsError(
    //     'Cannot upload document more then 10 mb of size.'
    //   );
    //   return;
    // }
    for (let i = 0; i < documents.length; i++) {
      setOtherDocuments((prev: any) => [...prev, documents[i]]);
    }
  };
  const drawingsDocumentsUplodadHandler: UploadProps['onChange'] = ({
    fileList,
  }) => {
    setuploadDocumentsError('');
    const documents = fileList;
    if (!documents[0]) {
      return;
    }
    // if (documents[0].size && byteConverter(documents[0].size, 'MB').size > 10) {
    //   setuploadDocumentsError(
    //     'Cannot upload document more then 10 mb of size.'
    //   );
    //   return;
    // }
    for (let i = 0; i < documents.length; i++) {
      if (
        documents[i].type === 'application/pdf' ||
        documents[i].type === 'image/png' ||
        documents[i].type === 'image/jpeg'
      ) {
        setDrawingsDocuments((prev: any) => [...prev, documents[i]]);
      } else {
        setuploadDocumentsError('Document should be image or pdf');
      }
    }
  };

  const drawingDocumentDeleteHandler = (documentName: string) => {
    setDrawingsDocuments(
      drawingsDocuments.filter((doc: any) => doc.name !== documentName)
    );
  };
  const takeoffDocumentDeleteHandler = (documentName: string) => {
    setTakeOffReports(
      takeOffReports.filter((doc: any) => doc.name !== documentName)
    );
  };
  const otherDocumentDeleteHandler = (documentName: string) => {
    setOtherDocuments(
      otherDocuments.filter((doc: any) => doc.name !== documentName)
    );
  };

  const addSalePersonAction = () => {
    return (
      <CustomWhiteButton
        text="Add Sale Person"
        className="!w-auto !py-1 !px-2 !text-[12px]"
        icon="/plusblack.svg"
        iconwidth={10}
        iconheight={10}
        onClick={() => setCreateUserModal(true)}
      />
    );
  };
  const addEstimatorAction = () => {
    return (
      <CustomWhiteButton
        text="Add Estimator"
        className="!w-auto !py-1 !px-2 !text-[12px]"
        icon="/plusblack.svg"
        iconwidth={10}
        iconheight={10}
        onClick={() => setCreateUserModal(true)}
      />
    );
  };
  return (
    <section className="my-5 px-16 ">
      <div className="flex justify-between flex-wrap items-center md:flex-nowrap">
        <TertiaryHeading title="Create Estimate Request" />
        <CustomWhiteButton
          text="Add Existing Receipt"
          className="!w-auto "
          icon="/plusblack.svg"
          iconwidth={20}
          iconheight={20}
          onClick={() => setShowModal(true)}
        />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={clientInfoSchema}
        onSubmit={submitHandler}
        enableReinitialize={true}
      >
        {({
          handleSubmit,
          setFieldValue,
          values,
          setFieldTouched,
          touched,
          errors,
        }) => {
          return (
            <>
              <ModalComponent
                open={showModal}
                setOpen={setShowModal}
                destroyOnClose
              >
                <ListCrmItems
                  onClose={() => setShowModal(false)}
                  onItemClick={(item) => {
                    setFieldValue('clientName', item.name);
                    setFieldValue('companyName', item.companyName);
                    setFieldValue('email', item.email);
                    setFieldValue('phone', item.phone);
                    setShowModal(false);
                  }}
                  title="Select Item"
                />
              </ModalComponent>
              <Form onSubmit={handleSubmit}>
                <div className="p-5 mt-4 border border-silverGray rounded-lg shadow-quinarGentleDepth bg-white">
                  <QuaternaryHeading
                    title="Receipt Information"
                    className="font-semibold"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-1 gap-4 mt-4">
                    <FormControl
                      control="input"
                      label="Name"
                      type="text"
                      name="clientName"
                      placeholder="Enter Name"
                    />
                    <FormControl
                      control="input"
                      label="Company Name"
                      type="text"
                      name="companyName"
                      placeholder="Enter Company Name"
                    />
                    <FormControl
                      control="input"
                      label="email"
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                    />
                    <PhoneNumberInputWithLable
                      label="Phone Number"
                      //@ts-ignore
                      onChange={(val: string) => setFieldValue('phone', val)}
                      //@ts-ignore
                      value={values.phone}
                      onBlur={() => setFieldTouched('phone', true)}
                      hasError={touched.phone && Boolean(errors.phone)}
                      errorMessage={
                        touched.phone && errors.phone ? errors.phone : ''
                      }
                    />
                  </div>
                </div>
                <div className="p-5 my-4 border border-silverGray rounded-lg shadow-quinarGentleDepth bg-white">
                  <QuaternaryHeading
                    title="Project Details"
                    className="text-graphiteGray font-semibold"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="...">
                      <FormControl
                        control="input"
                        label="Project Name"
                        type="text"
                        name="projectName"
                        placeholder="Enter Project Name"
                      />
                    </div>
                    <div className="...">
                      <FormControl
                        control="input"
                        label="Lead Source Value"
                        type="text"
                        name="leadSource"
                        placeholder="Lead Source"
                      />
                    </div>
                    <div className="...">
                      <FormControl
                        control="input"
                        label="Project Value"
                        type="number"
                        name="projectValue"
                        placeholder="Project Value"
                      />
                    </div>
                    <div className="col-span-3 ...">
                      <FormControl
                        control="textarea"
                        label="Project Information"
                        type="text"
                        name="projectInformation"
                        placeholder="Enter Project Information"
                      />
                    </div>
                  </div>
                </div>

                {/* assignment */}
                <div className="p-5 border-2 border-silverGray rounded-lg shadow-quinarGentleDepth bg-white">
                  <QuaternaryHeading
                    title="Assignments"
                    className="text-graphiteGray font-semibold"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 grid-rows-1 gap-5 w-full mt-4">
                    <FormControl
                      control="select"
                      label="Sale Person"
                      name="salePerson"
                      placeholder="Select Sale person"
                      options={userData}
                      labelButton={true}
                      labelAction={addSalePersonAction}
                    />
                    <FormControl
                      control="select"
                      label="Estimator"
                      name="estimator"
                      placeholder="Select project manager"
                      options={userData}
                      labelButton={true}
                      labelAction={addEstimatorAction}
                    />
                  </div>
                </div>

                <div className=" border-2  border-silverGray  rounded-lg shadow-quinarGentleDepth my-4 p-5 bg-white">
                  <h3 className="my-4">Upload</h3>
                  <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 pb-8">
                    <div className="max-h-[180px]">
                      <p
                        className={`${senaryHeading} !text-[14px] text-midnightBlue font-popin mb-2`}
                      >
                        Upload Drawings
                      </p>
                      <div className="h-full">
                        {drawingsDocuments.length ? (
                          <div
                            className={`p-4 flex h-full items-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg mb-3`}
                          >
                            {drawingsDocuments?.map(
                              (doc: {
                                name: string;
                                size: number;
                                lastModified: number;
                              }) => (
                                <div
                                  key={doc.lastModified}
                                  className={`px-6 py-4 relative max-w-80 `}
                                >
                                  <Image
                                    src={'/documentIcon.svg'}
                                    alt="documentIcon icon"
                                    width={20}
                                    height={20}
                                  />
                                  <Image
                                    src={'/closeicon.svg'}
                                    alt="documentIcon icon"
                                    width={20}
                                    height={20}
                                    className="absolute top-0 right-4 cursor-pointer"
                                    onClick={() =>
                                      drawingDocumentDeleteHandler(doc.name)
                                    }
                                  />

                                  <p className="text-[#353535] text-[16px] truncate font-[500] mt-2 ">
                                    {`${doc?.name.substring(0, 20)}....`}
                                  </p>
                                  <p className="text-[#989692] text-[12px] font-[400] my-2">
                                    {byteConverter(doc?.size, 'KB').size}{' '}
                                    {byteConverter(doc?.size, 'KB').unit}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div
                            className={`p-4 flex h-full items-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg mb-3`}
                          >
                            <Upload
                              onChange={drawingsDocumentsUplodadHandler}
                              accept="image/jpeg,image/png,application/pdf "
                              name="drawingDocuments"
                              id="drawingDocuments"
                            >
                              <div
                                className={`px-6 py-4 flex flex-col items-center gap-3 `}
                              >
                                <div className="bg-lightGrayish rounded-[28px] border border-solid border-paleblueGray flex justify-center items-center p-2.5">
                                  <Image
                                    src={'/uploadcloud.svg'}
                                    alt="upload icon"
                                    width={20}
                                    height={20}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <p
                                    className={twMerge(
                                      `${senaryHeading} !text-[14px] text-schestiPrimary  font-semibold cursor-pointer`
                                    )}
                                  >
                                    Click to Upload
                                  </p>
                                  <p className={`text-steelGray ${minHeading}`}>
                                    or drag and drop
                                  </p>
                                </div>

                                <p
                                  className={`text-steelGray text-center ${minHeading}`}
                                >
                                  PDF, CSV, SVG, PNG, JPG or GIF (max.
                                  800x400px){' '}
                                </p>
                              </div>
                            </Upload>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="max-h-[180px]">
                      <p
                        className={`${senaryHeading} !text-[14px] text-midnightBlue font-popin mb-2`}
                      >
                        Takeoff Report
                      </p>
                      <div className="h-full">
                        {takeOffReports.length ? (
                          <div
                            className={`p-4 flex h-full items-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg mb-3`}
                          >
                            {takeOffReports?.map(
                              (doc: {
                                name: string;
                                size: number;
                                lastModified: number;
                              }) => (
                                <div
                                  key={doc.lastModified}
                                  className={`px-4 py-4 relative max-w-32 `}
                                >
                                  <Image
                                    src={'/documentIcon.svg'}
                                    alt="documentIcon icon"
                                    width={20}
                                    height={20}
                                  />
                                  <Image
                                    src={'/closeicon.svg'}
                                    alt="documentIcon icon"
                                    width={20}
                                    height={20}
                                    className="absolute top-0 right-0 cursor-pointer"
                                    onClick={() =>
                                      takeoffDocumentDeleteHandler(doc.name)
                                    }
                                  />

                                  <p className="text-[#353535] text-[16px] font-[500] mt-2 truncate">
                                    {doc?.name}
                                  </p>
                                  <p className="text-[#989692] text-[12px] font-[400] my-2">
                                    {byteConverter(doc?.size, 'KB').size}{' '}
                                    {byteConverter(doc?.size, 'KB').unit}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div
                            className={`p-4 flex items-center h-full flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg `}
                          >
                            <Upload
                              beforeUpload={() => false}
                              id="takeoffReports"
                              onChange={takeoffReportsUploadHandler}
                              accept=".png,.jpg,.jpeg,.svg,application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            >
                              <div
                                className={`px-6 py-4 flex flex-col items-center gap-3 `}
                              >
                                <div className="bg-lightGrayish rounded-[28px] border border-solid border-paleblueGray flex justify-center items-center p-2.5">
                                  <Image
                                    src={'/uploadcloud.svg'}
                                    alt="upload icon"
                                    width={20}
                                    height={20}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <p
                                    className={twMerge(
                                      `${senaryHeading} !text-[14px] text-schestiPrimary  font-semibold cursor-pointer`
                                    )}
                                  >
                                    Click to Upload
                                  </p>
                                  <p className={`text-steelGray ${minHeading}`}>
                                    or drag and drop
                                  </p>
                                </div>
                                <p
                                  className={`text-steelGray ${minHeading} text-center`}
                                >
                                  PDF, CSV, SVG, PNG, JPG or GIF (max.
                                  800x400px)
                                </p>
                              </div>
                            </Upload>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="max-h-[180px]">
                      <p
                        className={`${senaryHeading} !text-[14px] text-midnightBlue font-popin mb-2`}
                      >
                        Other Documents
                      </p>
                      <div className="h-full">
                        {otherDocuments.length ? (
                          <div
                            className={`p-4 flex items-center h-full flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg mb-3`}
                          >
                            {otherDocuments?.map(
                              (doc: {
                                name: string;
                                size: number;
                                lastModified: number;
                              }) => (
                                <div
                                  key={doc.lastModified}
                                  className={`px-4 py-4 relative max-w-32 `}
                                >
                                  <Image
                                    src={'/documentIcon.svg'}
                                    alt="documentIcon icon"
                                    width={20}
                                    height={20}
                                  />
                                  <Image
                                    src={'/closeicon.svg'}
                                    alt="documentIcon icon"
                                    width={20}
                                    height={20}
                                    className="absolute top-0 right-0 cursor-pointer"
                                    onClick={() =>
                                      otherDocumentDeleteHandler(doc.name)
                                    }
                                  />

                                  <p className="text-[#353535] text-[16px] font-[500] mt-2 truncate">
                                    {doc?.name}
                                  </p>
                                  <p className="text-[#989692] text-[12px] font-[400] my-2">
                                    {byteConverter(doc?.size, 'KB').size}{' '}
                                    {byteConverter(doc?.size, 'KB').unit}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div
                            className={`p-4 flex items-center flex-col h-full gap-2 border-2 border-silverGray pb-4 rounded-lg `}
                          >
                            <Upload
                              id="otherDocuments"
                              onChange={otherDocumentsUploadHandler}
                              accept=".png,.jpg,.jpeg,.svg,application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            >
                              <div
                                className={`px-6 py-4 flex flex-col items-center gap-3 `}
                              >
                                <div className="bg-lightGrayish rounded-[28px] border border-solid border-paleblueGray flex justify-center items-center p-2.5">
                                  <Image
                                    src={'/uploadcloud.svg'}
                                    alt="upload icon"
                                    width={20}
                                    height={20}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <p
                                    className={twMerge(
                                      `${senaryHeading} !text-[14px] text-schestiPrimary  font-semibold cursor-pointer`
                                    )}
                                  >
                                    Click to Upload
                                  </p>
                                  <p className={`text-steelGray ${minHeading}`}>
                                    or drag and drop
                                  </p>
                                </div>
                                <p
                                  className={`text-steelGray ${minHeading} text-center`}
                                >
                                  PDF, CSV, SVG, PNG, JPG or GIF (max.
                                  800x400px)
                                </p>
                              </div>
                            </Upload>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="max-h-[180px]">
                      <p
                        className={`${senaryHeading} !text-[14px] text-midnightBlue font-popin mb-2 `}
                      >
                        If don’t have takeoff report
                      </p>
                      <div
                        className={`p-4 flex items-center h-full justify-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg cursor-pointer`}
                        onClick={() => {
                          router.push('/take-off/upload');
                        }}
                      >
                        <div
                          className={`px-6 py-4 flex flex-col items-center gap-3 `}
                        >
                          <div className="flex gap-2">
                            <label
                              htmlFor="needTakemeasureToTakeoff"
                              className={twMerge(
                                `${senaryHeading} text-[#475467] font-semibold cursor-pointer`
                              )}
                            >
                              Need to take measurements
                            </label>
                          </div>
                          <p className={`text-steelGray ${minHeading}`}>
                            You can take measurements during Estimate
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {uploadDocumentsError && (
                    <p className="text-red-500 text-[14px]">
                      {uploadDocumentsError}
                    </p>
                  )}
                </div>
                {/* buttons */}
                <div className="flex justify-end items-center gap-2 md:mt-12 mt-6 p-4 shadow-secondaryTwist">
                  <div className="w-[116px]">
                    <CustomButton
                      className="!border-celestialGray shadow-scenarySubdued2 !text-graphiteGray !bg-snowWhite !px-5 !py-3 w-full"
                      text="Cancel"
                      onClick={() => router.push('/estimates/requests')}
                    />
                  </div>
                  <div className="w-[116px]">
                    <CustomButton
                      text="Create"
                      type="submit"
                      isLoading={isLoading}
                      className="!px-5 !py-3 w-full"
                    />
                  </div>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
      <ModalComponent
        open={createUserModal}
        setOpen={setCreateUserModal}
        title="Add User"
      >
        <AddNewUser
          onCancel={() => {
            setCreateUserModal(false);
          }}
          onSuccess={() => {
            setCreateUserModal(false);
            fetchCompanyEmployeeHandler();
          }}
          user={null}
        />
      </ModalComponent>
    </section>
  );
};

export default withAuth(CreateEstimateRequest);
