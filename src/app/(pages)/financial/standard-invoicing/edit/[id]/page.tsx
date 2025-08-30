'use client';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import Button from '@/app/component/customButton/white';
import ColoredButton from '@/app/component/customButton/button';
import TertiaryHeading from '@/app/component/headings/tertiary';
import FormControl from '@/app/component/formControl';
import Table, { type ColumnType } from 'antd/es/table';
import ModalComponent from '@/app/component/modal';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import { InputComponent } from '@/app/component/customInput/Input';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import QuinaryHeading from '@/app/component/headings/quinary';
import { ConfigProvider, Divider, Skeleton } from 'antd';
import { invoiceService } from '@/app/services/invoices.service';
import { toast } from 'react-toastify';
import { IInvoice } from '@/app/interfaces/invoices.interface';
import { Routes } from '@/app/utils/plans.utils';
import { withAuth } from '@/app/hoc/withAuth';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { ListCrmItems } from '@/app/(pages)/contracts/components/ListCrmItems';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

const SubcontractorSchema = Yup.object({
  companyRep: Yup.string().required('Company Rep is required!'),
  subContractorEmail: Yup.string()
    .required('Email is required!')
    .email('Email should be valid'),
  subContractorPhoneNumber: Yup.string().required('Phone number is required!'),
  subContractorCompanyName: Yup.string().required('Company name is required!'),
  subContractorAddress: Yup.string().required('Address is required!'),

  projectName: Yup.string().required('Project name is required!'),
  applicationNumber: Yup.string().required('Application number is required!'),
  invoiceSubject: Yup.string().required('Invoice subject is required!'),
  issueDate: Yup.string().required('Issue date is required!'),
  dueDate: Yup.string().required('Due date is required!'),

  invoiceItems: Yup.array().of(
    Yup.object()
      .shape({
        description: Yup.string().required('Description is required!'),
        quantity: Yup.number().required('Quantity is required!'),
        unitCost: Yup.number().required('Unit cost is required!'),
      })
      .required('Invoice detail is required')
  ),
  discount: Yup.number().required('Discount is required!'),
  taxes: Yup.number().required('Taxes is required!'),
  profitAndOverhead: Yup.number().required('Profit and overhead is required!'),
});
const initialValues = {
  applicationNumber: '',
  projectName: '',
  invoiceSubject: '',
  subContractorCompanyName: '',
  issueDate: '',
  dueDate: '',
  invoiceItems: [],
  profitAndOverhead: 0,
  totalPayable: 0,
  discount: 0,
  invoiceNumber: new Date().getTime().toString(),
  subContractorAddress: '',
  subContractorEmail: '',
  companyRep: '',
  subContractorPhoneNumber: '',
  taxes: 0,
};
type InvoiceDetail = {
  description: string;
  quantity: number;
  unitCost: number;
  total: number;
  id: string;
  totalPrice?: string;
  action?: string;
};
const EditSubcontractorInvoice = () => {
  const router = useRouterHook();
  const [details, setDetails] = useState<InvoiceDetail[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditDetail, setIsEditDetail] = useState(false);
  const [isFetchingInvoice, setIsFetchingInvoice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currency = useCurrencyFormatter();
  const params = useParams();
  const [invoiceData, setInvoiceData] = useState<IInvoice | null>(null);
  const { id } = params;
  const [detail, setDetail] = useState<InvoiceDetail>({
    id: '',
    description: '',
    quantity: 0,
    unitCost: 0,
    total: 0,
  });

  useEffect(() => {
    if (id) {
      setIsFetchingInvoice(true);
      invoiceService
        .httpGetSubcontractorInvoiceById(id as string)
        .then((res) => {
          setInvoiceData(res.data!.invoice);
          const items = res.data!.invoice.invoiceItems.map((i) => ({
            ...i,
            id: i._id,
          }));
          setDetails(items);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(err.response.data.message);
          router.back();
        });
    }
  }, [id]);

  const columns: ColumnType<InvoiceDetail>[] = [
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unitCost',
      render(value) {
        return `$${value}`;
      },
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      render(_value, record) {
        return `$${(record.quantity * record.unitCost).toFixed(2)}`;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (v, r, i) => (
        <div className="flex justify-center space-x-3">
          <Button
            text=""
            className="!w-auto"
            icon="/trash.svg"
            iconwidth={13}
            iconheight={13}
            onClick={() => removeDetail(i)}
          />
          <Button
            text=""
            className="!w-auto "
            icon="/edit.svg"
            iconwidth={13}
            iconheight={13}
            onClick={() => {
              setIsEditDetail(true);
              setDetail(r);
            }}
          />
        </div>
      ),
    },
  ];

  // write crud operations for details state
  // add detail
  function addDetail(invoice: InvoiceDetail) {
    if (!invoice.description || !invoice.quantity || !invoice.unitCost) {
      return;
    }
    setDetails([...details, invoice]);
  }
  // remove detail
  function removeDetail(index: number) {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  }
  // update detail
  function updateDetail(id: string, invoice: InvoiceDetail) {
    const newDetails = [...details];
    const index = newDetails.findIndex((detail) => detail.id === id);
    if (index !== -1) {
      newDetails[index] = invoice;
      setDetails(newDetails);
    }
    setIsEditDetail(false);
  }

  // calculate sub total
  function calculateSubTotal(items: InvoiceDetail[]) {
    return items.reduce((total, invoice) => {
      return total + invoice.quantity * invoice.unitCost;
    }, 0);
  }

  function calculateTotalPayable(
    subtotal: number,
    taxes: number,
    profitAndOverhead: number,
    discount: number
  ) {
    const result =
      subtotal + taxes - discount + subtotal * (profitAndOverhead / 100);
    return result;
  }
  const submitHandler = async (values: any) => {
    setIsLoading(true);
    const updatedDetails = details.map((detail) => {
      return {
        ...detail,
        total: detail.quantity * detail.unitCost,
      };
    });
    const data: IInvoice = {
      ...values,
      invoiceItems: updatedDetails,
      totalPayable: calculateTotalPayable(
        calculateSubTotal(details),
        Number(values.taxes),
        Number(values.profitAndOverhead),
        Number(values.discount)
      ),
    };
    if (id) {
      let result = await invoiceService.httpUpdateSubcontractorInvoice(
        data,
        id as string
      );
      if (result.statusCode == 200) {
        setIsLoading(false);
        router.push(Routes.Financial['Standard-Invoicing']);
      } else {
        setIsLoading(false);
        toast.error(result.message);
      }
    }
  };

  if (isFetchingInvoice && !invoiceData) {
    return <Skeleton active />;
  }

  return (
    <section className="mx-4 my-2 py-3">
      <Formik
        initialValues={invoiceData ? invoiceData : initialValues}
        enableReinitialize={true}
        validationSchema={SubcontractorSchema}
        onSubmit={submitHandler}
      >
        {({
          handleSubmit,
          setFieldValue,
          values,
          handleBlur,
          errors,
          setFieldTouched,
          touched,
        }) => {
          return (
            <Form name="basic" onSubmit={handleSubmit} autoComplete="off">
              {/* Modal */}
              <ModalComponent open={showModal} setOpen={setShowModal}>
                {/* <ExistingSubContractor
                  setModalOpen={setShowModal}
                  onSelectSubcontract={({
                    address,
                    email,
                    name,
                    phone,
                    companyRep,
                  }) => {
                    setFieldValue('subContractorAddress', address);
                    setFieldValue('subContractorCompanyName', name);
                    setFieldValue('subContractorEmail', email);
                    setFieldValue('subContractorPhoneNumber', phone);
                    setFieldValue('companyRep', companyRep);
                  }}
                /> */}
                <ListCrmItems
                  onClose={() => setShowModal(false)}
                  onItemClick={(item) => {
                    setFieldValue('subContractorAddress', item.address);
                    setFieldValue('subContractorCompanyName', item.companyName);
                    setFieldValue('subContractorEmail', item.email);
                    setFieldValue('subContractorPhoneNumber', item.phone);
                    setFieldValue('companyRep', item.name);
                    setShowModal(false);
                  }}
                  title="Select Item"
                />
              </ModalComponent>
              {/* END  Modal */}

              {/* Sub Contractors */}
              <div
                className="p-5 flex flex-col rounded-lg border
            border-silverGray shadow-secondaryShadow2 bg-white"
              >
                <div className="flex justify-between items-center mb-4">
                  <TertiaryHeading
                    title="Receipt"
                    className="text-graphiteGray"
                  />
                  <Button
                    text="Add Existing Receipt"
                    className="!w-auto "
                    icon="/plusblack.svg"
                    iconwidth={20}
                    iconheight={20}
                    onClick={() => setShowModal(true)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4">
                  <FormControl
                    control="input"
                    label="Company Rep"
                    type="text"
                    name="companyRep"
                    placeholder="Enter Company Rep"
                  />
                  <FormControl
                    control="input"
                    label="Company Name"
                    type="text"
                    name="subContractorCompanyName"
                    placeholder="Enter company name"
                  />

                  <PhoneNumberInputWithLable
                    label="Phone Number"
                    //@ts-ignore
                    onChange={(val: string) =>
                      setFieldValue('subContractorPhoneNumber', val)
                    }
                    //@ts-ignore
                    value={String(values.subContractorPhoneNumber)}
                    onBlur={() =>
                      setFieldTouched('subContractorPhoneNumber', true)
                    }
                    hasError={
                      touched.subContractorPhoneNumber &&
                      Boolean(errors.subContractorPhoneNumber)
                    }
                    errorMessage={
                      touched.subContractorPhoneNumber &&
                      errors.subContractorPhoneNumber
                        ? errors.subContractorPhoneNumber
                        : ''
                    }
                  />

                  <FormControl
                    control="input"
                    label="Email"
                    type="email"
                    name="subContractorEmail"
                    placeholder="Enter email address"
                  />

                  <FormControl
                    control="input"
                    label="Address"
                    type="text"
                    name="subContractorAddress"
                    placeholder="Enter address"
                  />
                </div>
              </div>
              {/* END Sub Contractors */}

              {/* Invoice Info */}
              <div className="mt-2">
                <div
                  className="p-5 flex flex-col rounded-lg border
                  border-silverGray shadow-secondaryShadow2 bg-white"
                >
                  <TertiaryHeading
                    title="Invoice info"
                    className="text-graphiteGray"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 mt-3">
                    <FormControl
                      control="input"
                      label="Project Name"
                      type="text"
                      name="projectName"
                      placeholder="Enter project name"
                    />

                    <FormControl
                      control="input"
                      label="Application Number"
                      type="text"
                      name="applicationNumber"
                      placeholder="Enter the application number"
                    />

                    <FormControl
                      control="input"
                      label="Invoice Subject"
                      type="text"
                      name="invoiceSubject"
                      placeholder="Enter invoice subject"
                    />
                    <DateInputComponent
                      label="Issue Date"
                      name="issueDate"
                      placeholder="Enter issue date"
                      fieldProps={{
                        onChange: (_date, dateString) => {
                          setFieldValue('issueDate', dateString);
                        },
                        onBlur: handleBlur,
                        value: dayjs(values.issueDate),
                        defaultValue: dayjs('2015-01-01', 'YYYY-MM-DD'),
                      }}
                      hasError={touched.issueDate && !!errors.issueDate}
                      errorMessage={errors.issueDate}
                    />
                    <DateInputComponent
                      label="Due Date"
                      name="dueDate"
                      placeholder="Enter due date"
                      fieldProps={{
                        onChange: (_date, dateString) => {
                          setFieldValue('dueDate', dateString);
                        },
                        onBlur: handleBlur,
                        value: dayjs(values.dueDate),
                        defaultValue: dayjs('2015-01-01', 'YYYY-MM-DD'),
                      }}
                      hasError={touched.dueDate && !!errors.dueDate}
                      errorMessage={errors.dueDate}
                    />
                  </div>
                </div>
              </div>
              {/* END Invoice Info */}

              {/* Invoice Details */}
              <div className="mt-2">
                <div
                  className="p-5 flex flex-col rounded-lg border
                  border-silverGray shadow-secondaryShadow2 bg-white"
                >
                  <TertiaryHeading
                    title="Invoice details"
                    className="text-graphiteGray"
                  />
                  <div className="mt-3">
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-4 mt-3">
                        <InputComponent
                          label="Description"
                          type="text"
                          name="invoiceDetailDescription"
                          placeholder="Enter description here"
                          field={{
                            value: detail.description,
                            onChange: (e) => {
                              setDetail({
                                ...detail,
                                description: e.target.value,
                              });
                            },
                          }}
                        />
                        <div className="flex space-x-3 items-end col-span-2">
                          <div className="flex-1">
                            <InputComponent
                              label="Quantity"
                              type="text"
                              name="quantity"
                              placeholder="Enter quantity here"
                              field={{
                                type: 'number',
                                value: detail.quantity,
                                onChange: (e) => {
                                  setDetail({
                                    ...detail,
                                    quantity: Number(e.target.value),
                                  });
                                },
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <InputComponent
                              label="Unit Cost"
                              name="unitCost"
                              type="number"
                              prefix={currency.currency.symbol}
                              placeholder="Enter unit cost here"
                              field={{
                                value: detail.unitCost,
                                onChange: (e) => {
                                  setDetail({
                                    ...detail,
                                    unitCost: Number(e.target.value),
                                  });
                                },
                              }}
                            />
                          </div>
                          <ColoredButton
                            text={isEditDetail ? 'Update' : 'Add'}
                            className="!w-auto "
                            onClick={() => {
                              if (isEditDetail) {
                                updateDetail(detail.id, detail);
                              } else {
                                addDetail({
                                  id: new Date().getTime().toString(),
                                  description: detail.description,
                                  quantity: detail.quantity,
                                  unitCost: detail.unitCost,
                                  total: detail.quantity * detail.unitCost,
                                });
                              }
                              setDetail({
                                id: '',
                                description: '',
                                quantity: 0,
                                unitCost: 0,
                                total: 0,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <ConfigProvider
                        theme={{
                          components: {
                            Table: {
                              headerColor: 'red',
                            },
                          },
                        }}
                      >
                        <Table
                          loading={false}
                          columns={columns}
                          dataSource={details}
                          bordered
                          pagination={{ position: ['bottomCenter'] }}
                        />
                      </ConfigProvider>
                    </div>
                  </div>
                </div>
              </div>
              {/* END Invoice Details */}

              {/* Discount & Tax */}
              <div className="mt-2">
                <div
                  className="p-5 flex flex-col rounded-lg border
                  border-silverGray shadow-secondaryShadow2 bg-white"
                >
                  <TertiaryHeading
                    title="Discount & Tax"
                    className="text-graphiteGray"
                  />
                  <div className="mt-3">
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-4 mt-3">
                        <FormControl
                          control="input"
                          label="Discount"
                          min={0}
                          type="number"
                          name="discount"
                          placeholder="Enter discount here"
                          // prefix="%"
                          step="0.001"
                        />

                        <FormControl
                          control="input"
                          label="Taxes"
                          // prefix="%"
                          min={0}
                          type="number"
                          name="taxes"
                          placeholder="Enter taxes here"
                          step="0.001"
                        />

                        <FormControl
                          control="input"
                          label="Profit and Overhead %"
                          min={0}
                          type="number"
                          // prefix="%"
                          step="0.001"
                          name="profitAndOverhead"
                          placeholder="Enter profit and overhead here"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Discount & Tax */}

              {/* Calculation */}
              <div className="mt-2">
                <div className="flex justify-between items-center flex-wrap">
                  <div className="flex items-center space-x-2">
                    <QuaternaryHeading title="Sub total:" />
                    <QuinaryHeading
                      title={`$${calculateSubTotal(details)}`}
                      className="font-bold"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <QuaternaryHeading title="Discount:" />
                    <QuinaryHeading
                      title={`${values['discount']}%`}
                      className="font-bold"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <QuaternaryHeading title="Taxes:" />
                    <QuinaryHeading
                      title={`${values['taxes']}%`}
                      className="font-bold"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <QuaternaryHeading title="Profit And Overhead:" />
                    <QuinaryHeading
                      title={`${values['profitAndOverhead']}%`}
                      className="font-bold"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <QuaternaryHeading title="Total:" />
                    <QuinaryHeading
                      title={`${currency.format(
                        calculateTotalPayable(
                          calculateSubTotal(details),
                          Number(values.taxes),
                          Number(values.profitAndOverhead),
                          Number(values.discount)
                        )
                      )}`}
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>
              {/* END Calculation */}

              <Divider />

              {/* SEND */}
              <div className="mt-2">
                <div className="flex justify-between">
                  <div></div>
                  <div className="flex space-x-3">
                    <Button text="Cancel" onClick={() => router.back()} />
                    <ColoredButton
                      isLoading={isLoading}
                      type="submit"
                      text="Send"
                    />
                  </div>
                </div>
              </div>
              {/* END SEND */}
            </Form>
          );
        }}
      </Formik>
    </section>
  );
};

export default withAuth(EditSubcontractorInvoice);
