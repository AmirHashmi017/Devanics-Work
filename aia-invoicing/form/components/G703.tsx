'use client';
import React from 'react';
import {
  // Button,
  ConfigProvider,
  DatePicker,
  Divider,
  Input,
  Modal,
  Select,
  Table,
} from 'antd';
import PrimaryHeading from '@/app/component/headings/primary';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { isStringColumn, rowTemplate } from '../utils';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import {
  G7State,
  IAIAInvoice,
} from '@/app/interfaces/client-invoice.interface';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { AIAInvoiceFormMode } from '../../types';
import moment from 'moment';
import { timesRomenFont } from '@/app/component/fonts';
import { CurrencyFormat } from '@/app/utils/format';
import type { ColumnsType } from 'antd/es/table';
import _ from 'lodash';
// import { disabledDate } from '@/app/utils/date.utils';

type Props = {
  phases: IAIAInvoice[];
  selectedPhase: IAIAInvoice | null;
  setSelectedPhase: (_value: string) => void;
  state: G7State;
  parentInvoice: IAIAInvoice;
  // eslint-disable-next-line no-unused-vars
  handleState<K extends keyof G7State>(key: K, value: G7State[K]): void;
  // eslint-disable-next-line no-unused-vars
  sumColumns(rows: Array<string[]>, column: number): number;
  updateCellValue(_row: number, _column: number, _value: number | string): void;
  children?: React.ReactNode;
  showAddAndDelete?: boolean;
  mode: AIAInvoiceFormMode;
};

export function G703Component({
  state,
  handleState,
  sumColumns,
  updateCellValue,
  children,
  phases,
  selectedPhase,
  mode,
  setSelectedPhase,
  parentInvoice,
  showAddAndDelete = true,
}: Props) {
  function getCellValue(row: string[], column: number) {
    return row[column];
  }

  function deleteRow(rowIndex: number) {
    const newData = [...state.data];
    newData.splice(rowIndex, 1);
    handleState('data', newData);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function addNewRow(index: number) {
    // check if there is a row at previous index
    const row = state.data[index - 1];
    // if there is no row then by default don't apply any validation
    if (!row) {
      console.log('There is no row at previous index');
      handleState('data', [...state.data, rowTemplate(state.data.length)]);
      return;
    }
    const previousRowDescription = row[1];
    const previousRowSchdeuledValue = row[2];
    const previousRowThisPeriodValue = row[4];
    if (
      !previousRowDescription ||
      !previousRowSchdeuledValue ||
      !previousRowThisPeriodValue
    ) {
      toast.error(
        'Please fill Description, Scheduled Value and This Period Value of previous row before adding new row'
      );
      return;
    }
    handleState('data', [...state.data, rowTemplate(state.data.length)]);
  }

  function addRowBefore(index: number) {
    handleState('data', [
      ...state.data.slice(0, index),
      rowTemplate(index),
      ...state.data.slice(index),
    ]);
  }

  function addRowAfter(index: number) {
    handleState('data', [
      ...state.data.slice(0, index + 1),
      rowTemplate(index + 1),
      ...state.data.slice(index + 1),
    ]);
  }

  return (
    <section>
      <div className="flex justify-between items-center flex-wrap">
        <div>
          <QuaternaryHeading title="AIA Document G703, - 1992" />
          <PrimaryHeading title="Continuation Sheet" className="font-normal" />
        </div>
        <div>
          {mode === 'phase' || mode === 'view' ? (
            <Select
              placeholder="Select Previous Phase"
              options={phases.map((phase, index) => ({
                label: `${index + 1}. Pay Application: ${moment(
                  phase.applicationDate
                ).format('DD MMM-YYYY')} - ${moment(phase.periodTo).format(
                  'DD MMM-YYYY'
                )}`,
                value: phase._id,
              }))}
              value={selectedPhase?._id}
              onChange={(value) => {
                setSelectedPhase(value);
              }}
              style={{ width: 400 }}
              size="large"
            />
          ) : null}
        </div>
      </div>
      <Divider className="!mt-6 !m-0" />

      <div className="flex justify-between flex-wrap">
        <div>
          <QuaternaryHeading
            title={`AIA Document G702, APPLICATION AND CERTIFICATION FOR PAYMENT, containing Contractor's signed certification is attached. In tabulations below, amounts are stated to the nearest dollar. Use Column I on Contracts where variable retainage for line items may apply.`}
            className="max-w-2xl"
          />
        </div>

        <div className="flex flex-col p-4 space-y-3 bg-white flex-1">
          <div className="grid grid-cols-6 space-x-3">
            <label className="text-right col-span-4 text-graphiteGray font-normal">
              APPLICATION NO:
            </label>
            <div className="col-span-2">
              <Input
                className={`px-2 py-1  border border-gray-300 ${mode === 'view' ? 'pointer-events-none' : ''}`}
                type="text"
                value={state.applicationNo}
                onChange={(e) => handleState('applicationNo', e.target.value)}
              />
              {showAddAndDelete ? (
                <p className="text-gray-400">Application No is required.</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-6 space-x-3">
            <label className="text-right col-span-4 text-graphiteGray font-normal">
              APPLICATION DATE:
            </label>
            <div className="col-span-2">
              <DatePicker
                id="application-date"
                className={`px-2 w-full rounded-none py-[7px] border border-gray-300 outline-none ${mode === 'view' ? 'pointer-events-none' : ''}`}
                value={
                  state.applicationDate
                    ? dayjs(state.applicationDate)
                    : undefined
                }
                onChange={(_d, dateString) =>
                  handleState('applicationDate', dateString as string)
                }
                //@ts-ignore
                //@ts-nocheck
                // disabledDate={disabledDate}
              />
              {showAddAndDelete ? (
                <p className="text-gray-400">Application Date is required.</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-6 space-x-3">
            <label className="text-right col-span-4 text-graphiteGray font-normal">
              PERIOD TO:
            </label>
            <div className="col-span-2">
              <DatePicker
                id="application-date"
                className={`px-4 w-full rounded-none py-[7px] border border-gray-300 outline-none ${mode === 'view' ? 'pointer-events-none' : ''}`}
                value={!state.periodTo ? undefined : dayjs(state.periodTo)}
                onChange={(_d, dateString) =>
                  handleState('periodTo', dateString as string)
                }
                //@ts-ignore
                //@ts-nocheck
                // disabledDate={disabledDate}
              />
              {showAddAndDelete ? (
                <p className="text-gray-400">Period To is required.</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-6 space-x-3">
            <label className="text-right col-span-4 text-graphiteGray font-normal">
              PROJECT NO:
            </label>
            <div className="col-span-2">
              <Input
                className={`px-2 py-1  border border-gray-300 ${mode === 'view' ? 'pointer-events-none' : ''}`}
                type="text"
                value={state.projectNo}
                onChange={(e) => handleState('projectNo', e.target.value)}
              />
              {showAddAndDelete ? (
                <p className="text-gray-400">Project No is required.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet */}
      <div className="px-4 space-y-2">
        <Table
          bordered
          rootClassName="custom-table-header"
          // className={`[&>input]:${timesRomenFont.}`}
          rowClassName={(row: string[], idx) =>
            idx !== state.data.length && isStringColumn(row[0])
              ? 'bg-schestiLightPrimary  custom-table-header'
              : 'custom-table-header'
          }
          style={timesRomenFont.style}
          dataSource={[
            ...state.data,
            [
              '',
              'Grand Total',

              `${CurrencyFormat(
                sumColumns(state.data, 2),
                parentInvoice.currency?.locale,
                parentInvoice.currency?.code
              )}`,

              `${CurrencyFormat(
                sumColumns(state.data, 3),
                parentInvoice.currency?.locale,
                parentInvoice.currency?.code
              )}`,

              `${CurrencyFormat(
                sumColumns(state.data, 4),
                parentInvoice.currency?.locale,
                parentInvoice.currency?.code
              )}`,

              `${CurrencyFormat(
                sumColumns(state.data, 5),
                parentInvoice.currency?.locale,
                parentInvoice.currency?.code
              )}`,

              `${CurrencyFormat(
                sumColumns(state.data, 6),
                parentInvoice.currency?.locale,
                parentInvoice.currency?.code
              )}`,

              `${(sumColumns(state.data, 7) / _.map(state.data, (row) => row[7]).filter(Boolean).length || 0).toFixed(2)} %`,

              `${CurrencyFormat(sumColumns(state.data, 8), parentInvoice.currency?.locale, parentInvoice.currency?.code)}`,

              `${CurrencyFormat(
                sumColumns(state.data, 9),
                parentInvoice.currency?.locale,
                parentInvoice.currency?.code
              )}`,
            ],
          ]}
          pagination={false}
          scroll={{ x: 900, y: 700 }}
          columns={[
            {
              title: '#',
              dataIndex: 0,
              align: 'center',
              width: 60,
              render(value, record, index) {
                // if (isStringColumn(value) && index < state.data.length) {
                //   return {
                //     props: {

                //     },
                //     children: value
                //   }
                // }
                // return index === state.data.length ? null : (
                //   <div className="px-3">{index + 1}</div>
                // );

                const sequence = state.data
                  .slice(0, index + 1) // Consider only rows up to the current index
                  .filter((item) => !isNaN(Number(item[0]))).length; // Filter out rows where the first column is not a number

                const isValueNaN = isNaN(value);
                return {
                  props: {
                    colSpan: isValueNaN ? 2 : 1, // Merge cells if value is NaN
                  },
                  children: isValueNaN ? (
                    <div className="flex items-center px-5 py-2 text-sm space-x-2">
                      {!showAddAndDelete &&
                      typeof value === 'string' &&
                      value.includes('Add') ? null : (
                        <SenaryHeading
                          title={value}
                          className="font-semibold text-schestiPrimaryBlack"
                        />
                      )}
                      {showAddAndDelete ? (
                        <span
                          onClick={() => {
                            console.log('Value', value);

                            if (
                              value &&
                              typeof value === 'string' &&
                              value.includes('Add')
                            ) {
                              addRowBefore(index);
                            } else {
                              addRowAfter(index);
                            }
                          }}
                          className="bg-white px-2 print:hidden py-0.5 rounded-full border cursor-pointer"
                        >
                          <PlusOutlined />
                        </span>
                      ) : null}
                    </div>
                  ) : index === state.data.length ? null : (
                    <div className="px-3">{sequence}</div>
                  ),
                };
              },
            },
            {
              title: <SenaryHeading title="Description of Work" />,
              dataIndex: 1,
              width: 250,
              render: (value, record: string[], index) => {
                if (isStringColumn(record[0]) && index < state.data.length) {
                  return {
                    props: {
                      colSpan: 0, // Merge cells if value is NaN
                    },
                  };
                }
                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                return (
                  <Input
                    value={getCellValue(record, 1)}
                    placeholder="Enter description of work"
                    onChange={(e) => {
                      updateCellValue(index, 1, e.target.value);
                    }}
                    className={
                      mode === 'view' ? 'pointer-events-none' : undefined
                    }
                  />
                );
              },
              align: 'center',
            },
            {
              title: (
                <SenaryHeading
                  className={timesRomenFont.className}
                  title="Scheduled value"
                />
              ),
              dataIndex: 2,
              width: 150,
              render: (value, record: string[], index) => {
                if (isStringColumn(record[0]) && index < state.data.length) {
                  return null;
                }
                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                return (
                  <Input
                    className={
                      mode === 'view' ? 'pointer-events-none' : undefined
                    }
                    value={getCellValue(record, 2)}
                    type="number"
                    prefix={parentInvoice.currency?.symbol || '$'}
                    onChange={(e) => {
                      updateCellValue(index, 2, Number(e.target.value));
                    }}
                  />
                );
              },
              align: 'center',
            },

            {
              title: (
                <SenaryHeading
                  className={timesRomenFont.className}
                  title="Work Completed"
                />
              ),
              children: [
                {
                  title: (
                    <SenaryHeading
                      className={timesRomenFont.className}
                      title="From previous application (D+E)"
                    />
                  ),
                  dataIndex: 3,
                  align: 'center',
                  render: (value, record: string[], index) => {
                    if (
                      isStringColumn(record[0]) &&
                      index < state.data.length
                    ) {
                      return null;
                    }
                    if (index === state.data.length) {
                      return <div className="px-3">{value}</div>;
                    }
                    let columnF = Number(getCellValue(record, 3));
                    return (
                      <Input
                        className={
                          mode === 'view' ? 'pointer-events-none' : undefined
                        }
                        value={columnF}
                        prefix={parentInvoice.currency?.symbol || '$'}
                        type="number"
                        disabled
                      />
                    );
                  },
                },

                {
                  title: (
                    <SenaryHeading
                      className={timesRomenFont.className}
                      title="This period"
                    />
                  ),
                  dataIndex: 4,
                  align: 'center',
                  render: (value, record: string[], index) => {
                    if (
                      isStringColumn(record[0]) &&
                      index < state.data.length
                    ) {
                      return null;
                    }
                    if (index === state.data.length) {
                      return <div className="px-3">{value}</div>;
                    }
                    // const scheduledValue = Number(getCellValue(record, 2));
                    // const thisPeriodValue = Number(getCellValue(record, 4));
                    // const isGreater = thisPeriodValue > scheduledValue;

                    return (
                      <Input
                        className={
                          mode === 'view' ? 'pointer-events-none' : undefined
                        }
                        value={value}
                        prefix={parentInvoice.currency?.symbol || '$'}
                        type="number"
                        onChange={(e) => {
                          // if (Number(e.target.value) > scheduledValue) {
                          //   updateCellValue(index, 4, 0);
                          //   toast.error(
                          //     'This period value cannot be greater than scheduled value'
                          //   );
                          //   return;
                          // }
                          updateCellValue(index, 4, Number(e.target.value));
                        }}
                        // status={isGreater ? 'error' : undefined}
                      />
                    );
                  },
                },
              ],
            },

            {
              title: (
                <SenaryHeading
                  className={timesRomenFont.className}
                  title="Materials presently stored (not in D or E)"
                />
              ),
              dataIndex: 5,
              render: (value, record, index) => {
                if (isStringColumn(record[0]) && index < state.data.length) {
                  return null;
                }

                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                return (
                  <Input
                    className={
                      mode === 'view' ? 'pointer-events-none' : undefined
                    }
                    value={value}
                    type="number"
                    prefix={parentInvoice.currency?.symbol || '$'}
                    onChange={(e) => {
                      updateCellValue(index, 5, Number(e.target.value));
                    }}
                  />
                );
              },
              align: 'center',
            },

            {
              title: (
                <SenaryHeading
                  className={timesRomenFont.className}
                  title="Work Completed"
                />
              ),
              align: 'center',
              children: [
                {
                  title: (
                    <SenaryHeading
                      className={timesRomenFont.className}
                      title="Total Completed And Stored To Date (D+E+F)"
                    />
                  ),
                  align: 'center',
                  dataIndex: 6,
                  render: (value, record: string[], index) => {
                    if (
                      isStringColumn(record[0]) &&
                      index < state.data.length
                    ) {
                      return null;
                    }
                    if (index === state.data.length) {
                      return <div className="px-3">{value}</div>;
                    }
                    let columnD = Number(getCellValue(record, 3));
                    let columnE = Number(getCellValue(record, 4));
                    let columnF = Number(getCellValue(record, 5));

                    return (
                      <Input
                        className={
                          mode === 'view' ? 'pointer-events-none' : undefined
                        }
                        value={`${(columnD + columnE + columnF).toFixed(2)}`}
                        type="number"
                        prefix={parentInvoice.currency?.symbol || '$'}
                      />
                    );
                  },
                },
                {
                  title: (
                    <SenaryHeading
                      className={timesRomenFont.className}
                      title="% (G ÷ C)"
                    />
                  ),
                  dataIndex: 7,
                  align: 'center',
                  render: (value, record: string[], index) => {
                    if (
                      isStringColumn(record[0]) &&
                      index < state.data.length
                    ) {
                      return null;
                    }
                    if (index === state.data.length) {
                      return <div className="px-3">{value}</div>;
                    }
                    return (
                      <Input
                        className={
                          mode === 'view' ? 'pointer-events-none' : undefined
                        }
                        type="number"
                        suffix="%"
                        value={`${Number(record[7]).toFixed(2)}`}
                      />
                    );
                  },
                },
              ],
            },

            {
              title: (
                <SenaryHeading
                  className={timesRomenFont.className}
                  title="Balance (C - G)"
                />
              ),
              align: 'center',
              dataIndex: 8,
              render: (value, record: string[], index) => {
                if (isStringColumn(record[0]) && index < state.data.length) {
                  return null;
                }
                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                return (
                  <Input
                    className={
                      mode === 'view' ? 'pointer-events-none' : undefined
                    }
                    prefix={parentInvoice.currency?.symbol || '$'}
                    value={Number(record[8]).toFixed(2)}
                    type="number"
                  />
                );
              },
            },

            {
              title: (
                <SenaryHeading
                  className={timesRomenFont.className}
                  title={`Retainage (If Variable Rate) ${state.p5aPercentage}%`}
                />
              ),
              align: 'center',
              dataIndex: 9,
              render: (value, record: string[], index) => {
                if (isStringColumn(record[0]) && index < state.data.length) {
                  return null;
                }
                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                return (
                  <Input
                    className={
                      mode === 'view' ? 'pointer-events-none' : undefined
                    }
                    type="number"
                    prefix={parentInvoice.currency?.symbol || '$'}
                    value={`${Number(record[9]).toFixed(2)}`}
                  />
                );
              },
            },
            ...(mode == 'view'
              ? []
              : ([
                  {
                    title: '',
                    className: 'border-none border-b',
                    align: 'center',
                    render: (value, record: string[], index) => {
                      if (
                        isStringColumn(record[0]) &&
                        index < state.data.length
                      ) {
                        return null;
                      }
                      if (index === state.data.length) {
                        return (
                          <ConfigProvider
                            theme={{
                              components: {
                                Button: {
                                  defaultBg: '#007AB6',
                                  textHoverBg: '#fff',
                                  colorPrimaryText: '#fff',
                                  colorText: '#fff',
                                },
                              },
                            }}
                          >
                            {/* <Button
                            onClick={() => {
                              addNewRow(index);
                            }}
                            icon={<PlusOutlined />}
                            shape="circle"
                            type="default"
                            className={`!ml-2 ${showAddAndDelete ? '' : 'hidden'}`}
                          /> */}
                          </ConfigProvider>
                        );
                      }
                      return (
                        <DeleteOutlined
                          className={`text-xl px-4 text-red-500 cursor-pointer ${
                            showAddAndDelete ? '' : 'hidden'
                          }`}
                          onClick={() => {
                            Modal.confirm({
                              title: 'Are you sure delete?',
                              icon: <ExclamationCircleFilled />,
                              okText: 'Yes',
                              okType: 'danger',
                              style: { backgroundColor: 'white' },
                              cancelText: 'No',
                              onOk() {
                                deleteRow(index);
                              },
                              onCancel() {},
                            });
                          }}
                        />
                      );
                    },
                  },
                ] as ColumnsType<string[]>)),
          ]}
        ></Table>
      </div>
      {/* END Spreadsheet */}

      <div className="flex justify-end space-x-4 mt-8">{children}</div>
    </section>
  );
}
