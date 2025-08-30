import React from 'react';
import {
  Button,
  ConfigProvider,
  DatePicker,
  Divider,
  Input,
  // Modal,
  Select,
  Table,
} from 'antd';
import PrimaryHeading from '@/app/component/headings/primary';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { rowTemplate } from '../utils';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import Column from 'antd/es/table/Column';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import {
  // DeleteOutlined,
  // ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import {
  G7State,
  IAIAInvoice,
} from '@/app/interfaces/client-invoice.interface';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import moment from 'moment';
// import { disabledDate } from '@/app/utils/date.utils';

type Props = {
  phases: IAIAInvoice[];
  selectedPhase: IAIAInvoice | null;
  setSelectedPhase: (_value: string) => void;
  state: G7State;
  // eslint-disable-next-line no-unused-vars
  handleState<K extends keyof G7State>(key: K, value: G7State[K]): void;
  // eslint-disable-next-line no-unused-vars
  sumColumns(rows: Array<string[]>, column: number): number;
  updateCellValue(_row: number, _column: number, _value: number | string): void;
  children?: React.ReactNode;
  showAddAndDelete?: boolean;
};

export function G703Component({
  phases,
  selectedPhase,
  setSelectedPhase,
  state,
  handleState,
  sumColumns,
  updateCellValue,
  children,
  showAddAndDelete = true,
}: Props) {
  function getCellValue(row: string[], column: number) {
    return row[column];
  }

  // function deleteRow(rowIndex: number) {
  //   const newData = [...state.data];
  //   newData.splice(rowIndex, 1);
  //   handleState('data', newData);
  // }

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

  return (
    <section>
      <div className="flex justify-between items-center">
        <div>
          <QuaternaryHeading title="AIA Document G703, - 1992" />
          <PrimaryHeading title="Continuation Sheet" className="font-normal" />
        </div>
        <div>
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
        </div>
      </div>
      <Divider className="!mt-6 !m-0" />

      <div className="flex justify-between">
        <div>
          <QuaternaryHeading
            title={`AIA Document G702, APPLICATION AND CERTIFICATION FOR PAYMENT, containing
                                        Contractor's signed certification is attached.

                                        In tabulations below, amounts are stated to the nearest dollar.

                                        Use Column I on Contracts where variable retainage for line items may apply.`}
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
                className="px-2 py-1  border border-gray-300 "
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
                className="px-2 w-full rounded-none py-[7px] border border-gray-300 outline-none"
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
                className="px-4 w-full rounded-none py-[7px] border border-gray-300 outline-none"
                defaultValue={undefined}
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
                className="px-2 py-1  border border-gray-300 "
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
          dataSource={[
            ...state.data,
            [
              '',
              'Grand Total',
              `$ ${sumColumns(state.data, 2).toFixed(2)}`,
              `$ ${sumColumns(state.data, 3).toFixed(2)}`,
              `$ ${sumColumns(state.data, 4).toFixed(2)}`,
              `$ ${sumColumns(state.data, 5).toFixed(2)}`,
              `$ ${sumColumns(state.data, 6).toFixed(2)}`,
              `% ${sumColumns(state.data, 7).toFixed(2)}`,
              `$ ${sumColumns(state.data, 8).toFixed(2)}`,
              `$ ${sumColumns(state.data, 9).toFixed(2)}`,
            ],
          ]}
          pagination={false}
          scroll={{ x: 1300, y: 240 }}
        >
          <Column
            title={<SenaryHeading title="#" className="px-3 text-[12px]" />}
            dataIndex={0}
            render={(value, record: string[], index) => {
              return index === state.data.length ? null : (
                <div className="px-3">{index + 1}</div>
              );
            }}
            width={40}
          />
          <Column
            title={<SenaryHeading title="Description Of Work" />}
            dataIndex={1}
            align="center"
            width={250}
            render={(value, record: string[], index) => {
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
                />
              );
            }}
          />
          <Column
            title={<SenaryHeading title="Scheduled value" />}
            dataIndex={2}
            align="center"
            render={(value, record: string[], index) => {
              if (index === state.data.length) {
                return <div className="px-3 font-bold">{value}</div>;
              }
              return (
                <Input
                  value={getCellValue(record, 2)}
                  type="number"
                  prefix="$"
                  onChange={(e) => {
                    updateCellValue(index, 2, Number(e.target.value));
                  }}
                />
              );
            }}
          />
          <ColumnGroup title={<SenaryHeading title="Work Completed" />}>
            <Column
              title={<SenaryHeading title="From previous application (D+E)" />}
              dataIndex={3}
              align="center"
              render={(value, record: string[], index) => {
                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                let columnF = Number(getCellValue(record, 3));
                return (
                  <Input value={columnF} prefix="$" type="number" disabled />
                );
              }}
            />
            <Column
              title={<SenaryHeading title="This period" />}
              dataIndex={4}
              align="center"
              render={(value, record: string[], index) => {
                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                const scheduledValue = Number(getCellValue(record, 2));
                const thisPeriodValue = Number(getCellValue(record, 4));
                const isGreater = thisPeriodValue > scheduledValue;

                return (
                  <Input
                    value={value}
                    prefix="$"
                    type="number"
                    onChange={(e) => {
                      if (Number(e.target.value) > scheduledValue) {
                        updateCellValue(index, 4, 0);
                        toast.error(
                          'This period value cannot be greater than scheduled value'
                        );
                        return;
                      }
                      updateCellValue(index, 4, Number(e.target.value));
                    }}
                    status={isGreater ? 'error' : undefined}
                  />
                );
              }}
            />
          </ColumnGroup>
          <Column
            title={
              <SenaryHeading title="Materials presently stored (not in D or E)" />
            }
            dataIndex={5}
            align="center"
            render={(value, record, index) => {
              if (index === state.data.length) {
                return <div className="px-3">{value}</div>;
              }
              return (
                <Input
                  value={value}
                  type="number"
                  prefix="$"
                  onChange={(e) => {
                    updateCellValue(index, 5, Number(e.target.value));
                  }}
                />
              );
            }}
          />
          <ColumnGroup
            align="center"
            title={<SenaryHeading title="Work Completed" />}
          >
            <Column
              title={
                <SenaryHeading title="Total Completed And Stored To Date (D+E+F)" />
              }
              align="center"
              dataIndex={6}
              render={(value, record: string[], index) => {
                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                let columnD = Number(getCellValue(record, 3));
                let columnE = Number(getCellValue(record, 4));
                let columnF = Number(getCellValue(record, 5));

                return (
                  <Input
                    value={`${(columnD + columnE + columnF).toFixed(2)}`}
                    type="number"
                    prefix="$"
                  />
                );
              }}
            />
            <Column
              title={<SenaryHeading title="% (G ÷ C)" />}
              dataIndex={7}
              align="center"
              render={(value, record: string[], index) => {
                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                return (
                  <Input
                    type="number"
                    prefix="%"
                    value={`${Number(record[7]).toFixed(2)}`}
                  />
                );
              }}
            />
          </ColumnGroup>
          <Column
            title={<SenaryHeading title="Balance (C - G)" />}
            dataIndex={8}
            align="center"
            render={(value, record: string[], index) => {
              if (index === state.data.length) {
                return <div className="px-3">{value}</div>;
              }
              return (
                <Input
                  prefix="$"
                  value={Number(record[8]).toFixed(2)}
                  type="number"
                />
              );
            }}
          />
          <Column
            title={
              <SenaryHeading
                title={`Retainage (If Variable Rate) ${state.p5aPercentage}%`}
                className="px-2"
              />
            }
            dataIndex={9}
            align="center"
            render={(value, record: string[], index) => {
              if (index === state.data.length) {
                return <div className="px-3">{value}</div>;
              }
              return (
                <Input
                  type="number"
                  prefix="$"
                  value={`${Number(record[9]).toFixed(2)}`}
                />
              );
            }}
          />

          <Column
            title=""
            className="border-none border-b"
            align="center"
            render={(value, record: string[], index) => {
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
                    <Button
                      onClick={() => {
                        addNewRow(index);
                      }}
                      icon={<PlusOutlined />}
                      shape="circle"
                      type="default"
                      className={`!ml-2 ${showAddAndDelete ? '' : 'hidden'}`}
                    />
                  </ConfigProvider>
                );
              }
              return null;
              // return (
              //   <DeleteOutlined
              //     className={`text-xl px-4 text-red-500 cursor-pointer ${
              //       showAddAndDelete ? '' : 'hidden'
              //     }`}
              //     onClick={() => {
              //       Modal.confirm({
              //         title: 'Are you sure delete this task?',
              //         icon: <ExclamationCircleFilled />,
              //         okText: 'Yes',
              //         okType: 'danger',
              //         style: { backgroundColor: 'white' },
              //         cancelText: 'No',
              //         onOk() {
              //           deleteRow(index);
              //         },
              //         onCancel() {},
              //       });
              //     }}
              //   />
              // );
            }}
          />
        </Table>
      </div>
      {/* END Spreadsheet */}

      <div className="flex justify-end space-x-4 mt-8">{children}</div>
    </section>
  );
}
