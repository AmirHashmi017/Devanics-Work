'use client';
// modules import
import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';

// module imports
import { AppDispatch } from '@/redux/store';
import { withAuth } from '@/app/hoc/withAuth';
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
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { minHeading, senaryHeading } from '@/globals/tailwindvariables';
import { estimateRequestService } from '@/app/services/estimates.service';
import { getCompanyRolesThunk } from '@/redux/company-roles/company-roles.thunk';
import { selectEstimateRequests } from '@/redux/estimate/estimateRequestSelector';
import { IUser } from '@/app/interfaces/estimateRequests/estimateAssignedUser.interface';
import { IEstimateRequest } from '@/app/interfaces/estimateRequests/estimateRequests.interface';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { ListCrmItems } from '@/app/(pages)/contracts/components/ListCrmItems';

const clientInfoSchema: any = Yup.object().shape({
  clientName: Yup.string().required('Client Name is required!'),
  companyName: Yup.string().required('Company Name is required!'),
  email: Yup.string()
    .required('Email is required!')
    .email('Email should be valid'),
  phone: Yup.string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(14, 'Phone number must be at most 12 characters')
    .required('Phone number is required'),
  projectName: Yup.string().required('Project Name is required!'),
  leadSource: Yup.string().required('Lead Source is required!'),
  projectValue: Yup.string().required('Project Value is required!'),
  projectInformation: Yup.string().required('Project Information is required!'),
  salePerson: Yup.string(),
  estimator: Yup.string(),
});

const initialValues: IEstimateRequest = {
  clientName: '',
  companyName: '',
  email: '',
  phone: '',
  projectName: '',
  leadSource: '',
  projectValue: '',
  projectInformation: '',
  salePerson: '',
  estimator: '',
};

const EditEstimateRequest = () => {
  const params = useParams();
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();

  const { id } = params;
  const estimateRequestsData = useSelector(selectEstimateRequests);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<IUserInterface[]>([]);
  const [estimateRequestData, setEstimateRequestData] = useState(null);
  const [uploadDocumentsError, setuploadDocumentsError] = useState('');
  const [drawingsDocuments, setDrawingsDocuments] = useState<any>([]);
  const [takeOffReports, setTakeOffReports] = useState<any>([]);
  const [otherDocuments, setOtherDocuments] = useState<any>([]);

  useEffect(() => {
    if (id) {
      const estimateRequest = estimateRequestsData?.find(
        (item: any) => item._id === id
      );
      setEstimateRequestData({
        ...estimateRequest,
        estimator: estimateRequest.estimator
          ? estimateRequest.estimator._id
          : '',
        salePerson: estimateRequest.salePerson
          ? estimateRequest.salePerson._id
          : '',
      });
      setTakeOffReports(estimateRequest);
      setDrawingsDocuments(estimateRequest.drawingsDocuments);
      setOtherDocuments(estimateRequest.otherDocuments);
      setTakeOffReports(estimateRequest.takeOffReports);
    }
  }, [id]);

  const fetchCompanyEmployeeHandler = useCallback(async () => {
    let result: any = await dispatch(fetchUsers({ limit: 9, page: 1 }));
    const mappedUsers = result.payload?.data?.employees.map((user: IUser) => ({
      value: `${user._id}`,
      label: `${user.firstName} ${user.lastName} --- ${user.roles[0].name}`,
    }));
    setUserData(mappedUsers);
  }, []);

  useEffect(() => {
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
      // toast.success('File Uploading...', { autoClose: 50 });

      const [drawingDocs, takeOffDocs, otherDocs] = await Promise.all([
        uploadDocumentToS3Handler(drawingsDocuments),
        uploadDocumentToS3Handler(takeOffReports),
        uploadDocumentToS3Handler(otherDocuments),
      ]);

      Promise.all([drawingDocs, takeOffDocs, takeOffDocs])
        .then(async () => {
          let updateEstimateRequestData = {
            clientName: values.clientName,
            companyName: values.companyName,
            email: values.email,
            phone: values.phone,
            projectName: values.projectName,
            leadSource: values.leadSource,
            projectValue: values.projectValue,
            projectInformation: values.projectInformation,
            salePerson: values.salePerson,
            estimator: values.estimator,
            otherDocuments: otherDocs,
            takeOffReports: takeOffDocs,
            drawingsDocuments: drawingDocs,
          };

          let result = await estimateRequestService.httpUpdateEstimateRequest(
            updateEstimateRequestData,
            id
          );
          if (result.statusCode == 200) {
            setIsLoading(false);
            router.push('/estimates/requests');
          } else {
            setIsLoading(false);
            toast.error(result.message);
          }
        })
        .catch(() => {
          toast.error('Some thing went wrong during document uploading');
        });
    }
  };

  const uploadDocumentToS3Handler = async (documents: any) => {
    let documentsData: Object[] = [];
    try {
      await Promise.all(
        Object.keys(documents).map(async (key: any) => {
          if (documents[key].url) {
            let obj = {
              name: documents[key].name,
              size: documents[key].size,
              ext: documents[key].type,
              url: documents[key].url,
            };

            documentsData.push(obj);
          } else {
            const url = await new AwsS3(
              documents[key],
              'documents/estimates/'
            ).getS3URL();
            let obj = {
              name: documents[key].name,
              size: documents[key].size,
              ext: documents[key].type,
              url: url,
            };
            documentsData.push(obj);
          }
        })
      );

      return documentsData;
    } catch (error) {
      toast.error('Error uploading documents');
      console.error('Error uploading documents:', error);
    }
  };
  const takeoffReportsUploadHandler = async (e: any) => {
    setuploadDocumentsError('');
    const documents = e.target.files;
    if (!documents[0]) {
      return;
    }

    // if (byteConverter(documents[0].size, 'MB').size > 10) {
    //   setuploadDocumentsError(
    //     'Cannot upload document more then 10 mb of size.'
    //   );
    //   return;
    // }
    for (let i = 0; i < documents.length; i++) {
      setTakeOffReports((prev: any) => [...prev, documents[i]]);
    }
  };

  const otherDocumentsUploadHandler = (e: any) => {
    setuploadDocumentsError('');
    const documents = e.target.files;
    if (!documents[0]) {
      return;
    }

    // if (byteConverter(documents[0].size, 'MB').size > 10) {
    //   setuploadDocumentsError(
    //     'Cannot upload document more then 10 mb of size.'
    //   );
    //   return;
    // }
    for (let i = 0; i < documents.length; i++) {
      setOtherDocuments((prev: any) => [...prev, documents[i]]);
    }
  };
  const drawingsDocumentsUplodadHandler = (e: any) => {
    setuploadDocumentsError('');
    const documents = e.target.files;
    if (!documents[0]) {
      return;
    }
    // if (byteConverter(documents[0].size, 'MB').size > 10) {
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

  return (
    <section className="my-5 px-16">
      <div className="flex justify-between flex-wrap items-center md:flex-nowrap">
        <TertiaryHeading title="Edit Estimate Request" />
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
        initialValues={
          estimateRequestData ? estimateRequestData : initialValues
        }
        validationSchema={clientInfoSchema}
        enableReinitialize
        onSubmit={submitHandler}
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
                    title="Project information"
                    className="text-graphiteGray font-semibold"
                  />
                  <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4 mt-4">
                    <FormControl
                      control="input"
                      label="Project Name"
                      type="text"
                      name="projectName"
                      placeholder="Enter Project Name"
                    />
                    <FormControl
                      control="input"
                      label="Lead Source Value"
                      type="text"
                      name="leadSource"
                      placeholder="Select source"
                    />
                    <FormControl
                      control="input"
                      label="Project Value"
                      type="text"
                      name="projectValue"
                      placeholder="Select source"
                    />
                    <FormControl
                      control="input"
                      label="Project Information"
                      type="text"
                      name="projectInformation"
                      placeholder="Enter Project Information"
                    />
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
                      placeholder="Enter sale person"
                      options={userData}
                    />
                    <FormControl
                      control="select"
                      label="Estimator"
                      name="estimator"
                      placeholder="Select project manager"
                      options={userData}
                    />
                  </div>
                </div>

                <div className=" border-2  border-silverGray  rounded-lg shadow-quinarGentleDepth mt-4 p-5 bg-white">
                  <h3 className="my-4">Upload</h3>
                  <div className="flex gap-3">
                    <div>
                      <p
                        className={`${senaryHeading} !text-[14px] text-midnightBlue font-popin mb-2`}
                      >
                        Upload Drawings
                      </p>
                      <>
                        {drawingsDocuments.length ? (
                          <div
                            className={`p-4 flex items-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg mb-3`}
                          >
                            {drawingsDocuments?.map(
                              (doc: {
                                name: string;
                                size: number;
                                url: string;
                              }) => (
                                <div
                                  key={doc.size}
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
                                      drawingDocumentDeleteHandler(doc.name)
                                    }
                                  />

                                  <p className="text-[#353535] text-[16px] font-[500] mt-2 truncate">
                                    {doc?.name}
                                  </p>
                                  <p className="text-[#989692] text-[12px] font-[400] my-2">
                                    {byteConverter(doc?.size, 'KB').size}{' '}
                                    {byteConverter(doc?.size, 'KB').unit}
                                  </p>
                                  <a
                                    href={doc.url}
                                    className="text-[#7138DF] text-[12px] font-[400] my-2"
                                    target="_blank"
                                  >
                                    Click to View
                                  </a>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div
                            className={`p-4 flex items-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg mb-3`}
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
                                <label
                                  htmlFor="drawingDocuments"
                                  className={twMerge(
                                    `${senaryHeading} !text-[14px] text-RoyalPurple font-semibold cursor-pointer`
                                  )}
                                >
                                  Click to Upload
                                </label>
                                <input
                                  type="file"
                                  name="drawingDocuments"
                                  id="drawingDocuments"
                                  className="hidden"
                                  accept="image/jpeg,image/png,application/pdf "
                                  onChange={drawingsDocumentsUplodadHandler}
                                />
                                <p className={`text-steelGray ${minHeading}`}>
                                  or drag and drop
                                </p>
                              </div>

                              <p className={`text-steelGray ${minHeading}`}>
                                SVG, PNG, JPG or PDF (max. 800x400px)
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    </div>
                    <div>
                      <p
                        className={`${senaryHeading} !text-[14px] text-midnightBlue font-popin mb-2`}
                      >
                        Takeoff Report
                      </p>
                      <>
                        {takeOffReports.length ? (
                          <div
                            className={`p-4 flex items-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg mb-3`}
                          >
                            {takeOffReports?.map(
                              (doc: {
                                name: string;
                                size: number;
                                url: string;
                              }) => (
                                <div
                                  key={doc.size}
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
                                  <a
                                    href={doc.url}
                                    className="text-[#7138DF] text-[12px] font-[400] my-2"
                                    target="_blank"
                                  >
                                    Click to View
                                  </a>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div
                            className={`p-4 flex items-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg `}
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
                                <label
                                  htmlFor="takeoffReports"
                                  className={twMerge(
                                    `${senaryHeading} text-RoyalPurple font-semibold cursor-pointer`
                                  )}
                                >
                                  Click to Upload
                                </label>
                                <input
                                  type="file"
                                  name="otherDocuments"
                                  id="takeoffReports"
                                  className="hidden"
                                  onChange={takeoffReportsUploadHandler}
                                  accept="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                />
                                <p className={`text-steelGray ${minHeading}`}>
                                  or drag and drop
                                </p>
                              </div>
                              <p className={`text-steelGray ${minHeading}`}>
                                SVG, PNG, JPG or GIF (max. 800x400px)
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    </div>
                    <div>
                      <p
                        className={`${senaryHeading} !text-[14px] text-midnightBlue font-popin mb-2`}
                      >
                        Other Documents
                      </p>
                      <>
                        {otherDocuments.length ? (
                          <div
                            className={`p-4 flex items-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg mb-3`}
                          >
                            {otherDocuments?.map(
                              (doc: {
                                name: string;
                                size: number;
                                url: string;
                              }) => (
                                <div
                                  key={doc.size}
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
                                  <a
                                    href={doc.url}
                                    className="text-[#7138DF] text-[12px] font-[400] my-2"
                                    target="_blank"
                                  >
                                    Click to View
                                  </a>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div
                            className={`p-4 flex items-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg `}
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
                                <label
                                  htmlFor="otherDocuments"
                                  className={twMerge(
                                    `${senaryHeading} text-RoyalPurple font-semibold cursor-pointer`
                                  )}
                                >
                                  Click to Upload
                                </label>
                                <input
                                  type="file"
                                  name="otherDocuments"
                                  id="otherDocuments"
                                  className="hidden"
                                  onChange={otherDocumentsUploadHandler}
                                  accept="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                />
                                <p className={`text-steelGray ${minHeading}`}>
                                  or drag and drop
                                </p>
                              </div>
                              <p className={`text-steelGray ${minHeading}`}>
                                SVG, PNG, JPG or GIF (max. 800x400px)
                              </p>
                            </div>
                          </div>
                        )}
                      </>
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
                      text="Update"
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
    </section>
  );
};

export default withAuth(EditEstimateRequest);
