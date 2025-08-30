import React from 'react';
import { Divider, Select, Table } from 'antd';
import PrimaryHeading from '@/app/component/headings/primary';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import Column from 'antd/es/table/Column';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import {
  G7State,
  IAIAInvoice,
} from '@/app/interfaces/client-invoice.interface';
import dayjs from 'dayjs';
import moment from 'moment';

type Props = {
  phases: IAIAInvoice[];
  selectedPhase: IAIAInvoice | null;
  setSelectedPhase: (_value: string) => void;
  state: G7State;
  // eslint-disable-next-line no-unused-vars
  handleState<K extends keyof G7State>(key: K, value: G7State[K]): void;
  // eslint-disable-next-line no-unused-vars
  sumColumns(rows: Array<string[]>, column: number): number;
  children?: React.ReactNode;
};

export function G703Component({
  phases,
  selectedPhase,
  setSelectedPhase,
  state,
  sumColumns,
  children,
}: Props) {
  function getCellValue(row: string[], column: number) {
    return row[column];
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
              <div className="px-2 py-1  border border-gray-300 ">
                {state.applicationNo}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 space-x-3">
            <label className="text-right col-span-4 text-graphiteGray font-normal">
              APPLICATION DATE:
            </label>
            <div className="col-span-2">
              <div
                id="application-date"
                className="px-2 w-full rounded-none py-[7px] border border-gray-300 outline-none"
              >
                {state.applicationDate
                  ? dayjs(state.applicationDate).format('DD MMM-YYYY')
                  : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 space-x-3">
            <label className="text-right col-span-4 text-graphiteGray font-normal">
              PERIOD TO:
            </label>

            <div className="col-span-2">
              <div className="px-2 w-full rounded-none py-[7px] border border-gray-300 outline-none">
                {state.periodTo
                  ? dayjs(state.periodTo).format('DD MMM-YYYY')
                  : ''}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 space-x-3">
            <label className="text-right col-span-4 text-graphiteGray font-normal">
              PROJECT NO:
            </label>

            <div className="col-span-2">
              <div className="px-2 py-1  border border-gray-300 ">
                {state.projectNo}
              </div>
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
            width={250}
            align="center"
            render={(value, record: string[], index) => {
              if (index === state.data.length) {
                return <div className="px-3">{value}</div>;
              }
              return <div className="px-3">{getCellValue(record, 1)}</div>;
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
              return <div className="px-3">$ {getCellValue(record, 2)}</div>;
            }}
          />
          <ColumnGroup
            align="center"
            title={<SenaryHeading title="Work Completed" />}
          >
            <Column
              title={<SenaryHeading title="From previous application (D+E)" />}
              dataIndex={3}
              align="center"
              render={(value, record: string[], index) => {
                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                let columnF = Number(getCellValue(record, 3));
                return <div className="px-3">$ {columnF}</div>;
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
                return <div className="px-3">$ {value ? value : 0}</div>;
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
              return <div className="px-3">$ {value}</div>;
            }}
          />
          <ColumnGroup title={<SenaryHeading title="Work Completed" />}>
            <Column
              title={
                <SenaryHeading title="Total Completed And Stored To Date (D+E+F)" />
              }
              dataIndex={6}
              align="center"
              render={(value, record: string[], index) => {
                if (index === state.data.length) {
                  return <div className="px-3">{value}</div>;
                }
                let columnD = Number(getCellValue(record, 3));
                let columnE = Number(getCellValue(record, 4));
                let columnF = Number(getCellValue(record, 5));

                return (
                  <div className="px-3">
                    $ {(columnD + columnE + columnF).toFixed(2)}
                  </div>
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
                  <div className="px-3">$ {Number(record[7]).toFixed(2)}</div>
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
                <div className="px-3">$ {Number(record[8]).toFixed(2)}</div>
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
                <div className="px-3">{Number(record[9]).toFixed(2)}%</div>
              );
            }}
          />
        </Table>
      </div>
      {/* END Spreadsheet */}

      <div className="flex justify-end space-x-4 mt-8">{children}</div>
    </section>
  );
}
