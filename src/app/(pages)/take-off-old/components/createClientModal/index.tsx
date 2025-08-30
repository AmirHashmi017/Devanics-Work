'use client';
import Image from 'next/image';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { useState } from 'react';
import * as Yup from 'yup';
import TertiaryHeading from '@/app/component/headings/tertiary';
import FormControl from '@/app/component/formControl';
import { Formik, Form } from 'formik';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import CustomButton from '@/app/component/customButton/button';
import { IClient } from '@/app/interfaces/companyInterfaces/companyClient.interface';
import { PhoneNumberRegex } from '@/app/utils/regex.util';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import crmService from '@/app/services/crm/crm.service';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedClient: any;
  selectecClient?: any;
}

const newClientSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(15, 'First name must be less than 15 characters')
    .required('First name is required!'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(15, 'Last name must be less than 15 characters')
    .required('Last name is required!'),
  email: Yup.string()
    .required('Email is required!')
    .email('Email should be valid'),
  phone: Yup.string()
    .matches(PhoneNumberRegex, 'Phone number must contain numbers')
    .min(7, 'Phone number must be at least 7 characters')
    .max(14, 'Phone number must be at most 12 characters')
    .required('Phone number is required'),
  companyName: Yup.string().required('Company Name is required!'),
  address: Yup.string().required('Address is required!'),
  secondAddress: Yup.string(),
});
const initialValues: IClient = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  address: '',
  secondAddress: '',
};

const ScaleModal = ({ setModalOpen, setSelectedClient }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [clients, setclients] = useState<any>([]);
  // const [getLoading, setgetLoading] = useState<boolean>(false)
  // const [isOpen, setIsOpen] = useState<boolean>(false)

  // const submitHandler = async (values: IClient) => {
  //   setIsLoading(true);
  //   userService
  //     .httpAddNewClient({ ...values, phone: `${values.phone}` })
  //     .then((response: any) => {
  //       console.log(response, ' ===> response response create client');
  //       if (response.statusCode == 201) {
  //         setIsLoading(false);
  //         // router.push(Routes.CRM.Clients);
  //         setSelectedClient(response?.data?.client);
  //         setModalOpen(false);
  //       }
  //     })
  //     .catch(({ response }: any) => {
  //       setIsLoading(false);
  //       toast.error(response.data.message);
  //     });
  // };
  const submitHandler = async (values: IClient) => {
    setIsLoading(true);

    try {
      const response = await crmService.httpCreate({
        ...values,
        module: 'clients',
      });
      if (response.data) {
        toast.success('Client created successfully');
        setSelectedClient(response?.data);
        setModalOpen(false);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'Unable to create client');
    } finally {
      setIsLoading(false);
    }
  };

  // const getClients = () => {
  //   // setgetLoading(true)
  //   userService
  //     .httpGetAllCompanyClients()
  //     .then((res) => {
  //       console.log(res?.data?.clients, ' get clients');
  //       setclients(res?.data?.clients);
  //       // setgetLoading(false)
  //     })
  //     .catch((err: any) => {
  //       console.log(err, ' err while getting clients');
  //       // setgetLoading(false)
  //     });
  // };
  // useEffect(() => {
  //   getClients();
  // }, []);
  const state = useSelector((state: RootState) => state.crm);

  return (
    <div className="py-2.5 px-6 bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
      <section className="w-full">
        <div className="flex justify-between items-center border-b-Gainsboro ">
          <div>
            <QuaternaryHeading
              title="Add Client"
              className="text-graphiteGray font-bold"
            />
            {/* <QuinaryHeading
              title="Select any existing client from here."
              className="text-coolGray"
            /> */}
          </div>
          <Image
            src={'/crossblack.svg'}
            alt="close icon"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() => setModalOpen(false)}
          />
        </div>
        <div className="p-5 flex flex-col rounded-lg border border-silverGray shadow-secondaryShadow2 bg-white">
          <TertiaryHeading
            className="text-graphiteGray mb-4 "
            title="Select Client"
          />
          <div className="relative inline-block text-left">
            {/* <div>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                onClick={() => setIsOpen(!isOpen)} // Add state to manage dropdown visibility
              >
                {selectecClient?.firstName ?? selectecClient?.email ?? 'Select Client'}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M10.293 13.707a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L10 11.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {isOpen && (
              <div
                className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                style={{ zIndex: 9999 }} // Ensure dropdown appears on top
              >
                <div className="py-1">
                  {
                    clients && Array.isArray(clients) && clients?.length > 0 && clients?.map((it: any, ind: number) => {
                      return <a onClick={()=>{setSelectedClient(it);setModalOpen(false)}} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="options-menu-item-0">{it?.firstName ?? it?.email}</a>
                    })
                  }
                  {getLoading && <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="options-menu-item-1">Loading...</a>}
                  {!getLoading && !(clients?.length > 0) && <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="options-menu-item-1">No Record Found</a>}
                </div>
              </div>
            )} */}
            <Formik onSubmit={() => {}} initialValues={{ client: '' }}>
              <FormControl
                control="select"
                label="Select Client"
                type="text"
                name="client"
                placeholder="Select Client"
                handleChange={(val: any) => {
                  console.log(JSON.parse(val));
                  setSelectedClient(JSON.parse(val));
                  setModalOpen(false);
                }}
                options={
                  // clients?.length > 0
                  Array.isArray(state.data) && state.data?.length > 0
                    ? state.data?.map((i: any) => ({
                        ...i,
                        label: i?.firstName ?? i?.email,
                        value: JSON.stringify(i),
                      }))
                    : []
                }
              />
            </Formik>
          </div>
        </div>
        <div className="p-5 flex flex-col rounded-lg border border-silverGray shadow-secondaryShadow2 bg-white">
          <TertiaryHeading
            className="text-graphiteGray mb-4 "
            title="Add New Client"
          />
          <Formik
            initialValues={initialValues}
            validationSchema={newClientSchema}
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
                <Form name="basic" onSubmit={handleSubmit} autoComplete="off">
                  <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 gap-4">
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
                    <PhoneNumberInputWithLable
                      label="Phone Number"
                      onChange={(val) => setFieldValue('phone', val)}
                      value={values.phone as any}
                      onBlur={() => setFieldTouched('phone', true)}
                      hasError={touched.phone && Boolean(errors.phone)}
                      errorMessage={
                        touched.phone && errors.phone ? errors.phone : ''
                      }
                    />
                    <FormControl
                      control="input"
                      label="Email"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                    />
                    <div className="md:col-span-full">
                      <FormControl
                        control="input"
                        label="Company Name"
                        type="text"
                        name="companyName"
                        placeholder="Enter Company Name"
                      />
                    </div>
                    <FormControl
                      control="input"
                      label="Address"
                      type="text"
                      name="address"
                      placeholder="Address"
                    />
                    <FormControl
                      control="input"
                      label="Address 2"
                      type="text"
                      name="secondAddress"
                      placeholder="Address 2"
                    />
                  </div>
                  <div className="self-end flex justify-end items-center gap-5 md:mt-4 my-3">
                    <div>
                      <CustomButton
                        className=" !border-celestialGray !shadow-scenarySubdued2 !text-graphiteGray !bg-snowWhite"
                        text="Cancel"
                        onClick={() => {
                          setModalOpen(false);
                        }} //router.back()
                      />
                    </div>
                    <div>
                      <CustomButton
                        isLoading={isLoading}
                        type="submit"
                        text="Save"
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </section>
      {/* <div className="flex justify-end gap-4 mt-5 mb-2">
        <div>
          <Button
            text="Cancel"
            className="!bg-snowWhite !text-abyssalBlack !py-1.5 "
            onClick={() => setModalOpen(false)}
          />
        </div>
        <div>
          <Button
            text="Calibrate"
            onClick={handleCalibrate}
            className="!py-1.5"
          />
        </div>
      </div> */}
    </div>
  );
};

export default ScaleModal;
