import QuinaryHeading from '@/app/component/headings/quinary';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { G7State } from '@/app/interfaces/client-invoice.interface';
import {
  //  Checkbox,
  Divider,
} from 'antd';
import dayjs from 'dayjs';

type Props = {
  state: G7State;
  previousPhaseState: G7State | null;
  // eslint-disable-next-line no-unused-vars
  handleState<K extends keyof G7State>(k: K, v: G7State[K]): void;
  // eslint-disable-next-line no-unused-vars
  sumColumns(rows: string[][], column: number): number;
  updateRetainage(_value: number): void;
  children?: React.ReactNode;
  showValidation?: boolean;
};

export function G702Component({
  state,
  previousPhaseState,
  sumColumns,
  children,
}: Props) {
  const changeOrderSummaryAdditionSum =
    state.totalAdditionThisMonth + state.totalAdditionPreviousMonth;

  const changeOrderSummaryDeductionSum =
    state.totalDeductionThisMonth + state.totalDeductionPreviousMonth;

  const changeOrderNetChanges =
    changeOrderSummaryAdditionSum - changeOrderSummaryDeductionSum;

  const originalContractSum = sumColumns(state.data, 2);

  const p5b = Number(sumColumns(state.data, 5));

  const resultOf_P5b = p5b * (state.p5bPercentage / 100);

  const p5Total = Number(sumColumns(state.data, 9)) + resultOf_P5b;

  const p6Total = Number(sumColumns(state.data, 6)) - p5Total;

  const p7Total =
    Number(previousPhaseState ? sumColumns(previousPhaseState.data, 6) : 0) -
    p5Total;

  const p3Total = originalContractSum + changeOrderNetChanges;

  const p8Total = p6Total - p7Total; /** Point no 7 value will be placed here*/

  const p9Total =
    p3Total - p7Total /** Point no 7 value will be placed here*/ - p8Total;

  // calculate point no 7 values based on selected phase
  const previousP5b = previousPhaseState
    ? Number(sumColumns(previousPhaseState.data, 5))
    : 0;

  const previousResultOf_P5b = previousPhaseState
    ? previousP5b * (previousPhaseState.p5bPercentage / 100)
    : 0;

  const previousP5Total = previousPhaseState
    ? Number(sumColumns(previousPhaseState.data, 9)) + previousResultOf_P5b
    : 0;

  const previousP7Total =
    Number(previousPhaseState ? sumColumns(previousPhaseState.data, 6) : 0) -
    previousP5Total;

  return (
    <div>
      <div>
        <QuinaryHeading title="AIA DOCUMENT G702- 1992" />
      </div>

      <div>
        <TertiaryHeading title="APPLICATION AND CERTIFICATION FOR PAYMENT " />
        <Divider className="m-0 mt-3" />
        <div className="flex space-x-2 justify-between">
          <div className="flex space-x-2">
            <label className="text-right text-graphiteGray font-normal">
              To Owner:
            </label>
            <div className="px-2 h-10 w-52  py-2 border border-gray-300 outline-none">
              {state.toOwner}
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 space-x-1">
              <label className="text-right text-graphiteGray font-normal">
                PROJECT:
              </label>
              <div className="px-2 h-10 w-52  py-2 border border-gray-300 outline-none">
                {state.project}
              </div>
            </div>
            <div className="grid grid-cols-2 space-x-1">
              <label className="text-right text-graphiteGray font-normal">
                Address:
              </label>
              <div className="px-2 h-10 w-52  py-2 border border-gray-300 outline-none">
                {state.address}
              </div>
            </div>
            <div className="grid grid-cols-2 space-x-1">
              <label className="text-right text-graphiteGray font-normal">
                Via Engineer:
              </label>
              <div className="w-full">
                <div className="px-2 h-10 w-52  py-2 border border-gray-300 outline-none">
                  {state.viaEngineer}
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="grid grid-cols-2 space-x-1 ">
              <label className="text-right text-graphiteGray font-normal">
                APPLICATION NO:
              </label>
              <div className="px-2  py-2 border border-gray-300 outline-none">
                {state.applicationNo}
              </div>
            </div>
            <div className="grid grid-cols-2 space-x-1">
              <label className="text-right text-graphiteGray font-normal">
                APPLICATION DATE:
              </label>
              <div className="px-2  py-2 border border-gray-300 outline-none">
                {dayjs(state.applicationDate).format('DD/MM/YYYY')}
              </div>
            </div>
            <div className="grid grid-cols-2 space-x-1">
              <label className="text-right text-graphiteGray font-normal">
                PERIOD TO:
              </label>
              <div className="px-2  py-2 border border-gray-300 outline-none">
                {dayjs(state.periodTo).format('DD/MM/YYYY')}
              </div>
            </div>
            <div className="grid grid-cols-2 space-x-1">
              <label className="text-right text-graphiteGray font-normal">
                PROJECT NO:
              </label>
              <div className="px-2  py-2 border border-gray-300 outline-none">
                {state.projectNo}
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col space-y-2">
            <QuinaryHeading title="Distribution to" className="font-medium" />
            <Checkbox checked={state.distributionTo === 'architect'}>
              <QuinaryHeading title="ARCHITECT" />
            </Checkbox>
            <Checkbox checked={state.distributionTo === 'contractor'}>
              <QuinaryHeading title="CONTRACTOR" />
            </Checkbox>
          </div> */}
        </div>
      </div>

      <div>
        <div>
          <QuinaryHeading title="CONTRACT FOR:" />
          <Divider className="m-0 my-1" />
          <TertiaryHeading title="CONTRACTOR'S APPLICATION FOR PAYMENT" />
        </div>

        <div className="grid grid-cols-2">
          <div>
            <QuinaryHeading title="Application is made for payment, as shown below, in connection with the Contract. Continuation Sheet, AIA Document G703, is attached." />
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <QuinaryHeading
                  className="col-span-2"
                  title="1. ORIGINAL CONTRACT SUM  ................................"
                />
                <div className="px-2  py-1 border border-gray-300 outline-none">
                  $ {originalContractSum.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <QuinaryHeading
                  className="col-span-2"
                  title="2. Net change by Change Orders  ................................"
                />
                <div className="px-2  py-1 border border-gray-300 outline-none">
                  $ {changeOrderNetChanges.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <QuinaryHeading
                  className="col-span-2"
                  title="3. CONTRACT SUM TO DATE (Line 1 ± 2) $  ................................"
                />
                <div className="px-2  py-1 border border-gray-300 outline-none">
                  $ {p3Total.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <QuinaryHeading
                  className="col-span-2"
                  title="4. TOTAL COMPLETED & STORED TO DATE (Column G on G703)   .............."
                />
                <div className="px-2  py-1 border border-gray-300 outline-none">
                  $ {sumColumns(state.data, 6).toFixed(2)}
                </div>
              </div>

              <div>
                <QuinaryHeading title="5. RETAINAGE: " />
                <div className="pl-3">
                  <div className="grid grid-cols-3 ">
                    <div className="flex items-center col-span-2 space-x-2">
                      <QuinaryHeading title="a." />
                      <div className="px-2  py-1 border border-gray-300 outline-none">
                        % {state.p5aPercentage}
                      </div>
                      <QuinaryHeading title="of Completed Work $" />
                    </div>
                    <div className="px-2  py-1 border border-gray-300 outline-none">
                      $ {sumColumns(state.data, 9).toFixed(2)}
                    </div>
                  </div>
                  <QuinaryHeading
                    title="(Column D + E on G703)"
                    className="pl-4"
                  />
                </div>
                <div className="pl-3">
                  <div className="grid grid-cols-3 ">
                    <div className="flex items-center col-span-2 space-x-2">
                      <QuinaryHeading title="b." />
                      <div className="px-2  py-1 border border-gray-300 outline-none">
                        % {state.p5bPercentage}
                      </div>
                      <QuinaryHeading title="% of Stored Material " />
                    </div>
                    <div className="px-2  py-1 border border-gray-300 outline-none">
                      $ {resultOf_P5b.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <QuinaryHeading title="(Column F on G703)" />

                    <div className="grid grid-cols-3">
                      <QuinaryHeading
                        className="col-span-2 pl-4"
                        title="Total Retainage ( Lines 5a + 5b or Total in Colum I of G703"
                      />
                      <div className="px-2  py-1 border border-gray-300 outline-none">
                        $ {p5Total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <QuinaryHeading
                  className="col-span-2"
                  title="6. TOTAL EARNED LESS RETAINAGE Total in Column I of G703)"
                />

                <div className="px-2  py-1 border border-gray-300 outline-none">
                  $ {p6Total.toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 items-start">
                <QuinaryHeading
                  className="col-span-2"
                  title="7. LESS PREVIOUS CERTIFICATES FOR PAYMENT (Line 6 from prior Certificate)"
                />

                <div className="px-2  py-1 border border-gray-300 outline-none">
                  $ {previousP7Total.toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <QuinaryHeading
                  className="col-span-2"
                  title="8. CURRENT PAYMENT DUE"
                />

                <div className="px-2  py-1 border border-gray-300 outline-none">
                  $ {p8Total.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <QuinaryHeading
                  className="col-span-2"
                  title="9. BALANCE TO FINISH, INCLUDING RETAINAGE $ (Line 3 less Line 6)"
                />
                <div className="px-2  py-1 border border-gray-300 outline-none">
                  $ {p9Total.toFixed(2)}
                </div>
              </div>
            </div>

            <table className="w-full my-1 caption-bottom text-sm border border-gray-300 divide-x divide-gray-300">
              <thead className="[&amp;_tr]:border-b">
                <tr className="border-b">
                  <th className="h-12 px-4 align-middle text-left border-r border-gray-300 text-slateGray text-base font-normal leading-5">
                    CHANGE ORDER SUMMARY
                  </th>
                  <th className="h-12 px-4 align-middle text-left border-r border-gray-300 text-slateGray text-base font-normal leading-5">
                    ADDITIONS
                  </th>
                  <th className="h-12 px-4 align-middle text-left border-r border-gray-300 text-slateGray text-base font-normal leading-5">
                    DEDUCTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="[&amp;_tr:last-child]:border-0">
                <tr className="border-b">
                  <td className="px-2 text-gray-700 align-middle  border-r border-gray-300">
                    Total changes approved in previous months by Owner
                  </td>
                  <td className=" text-gray-700  border-r border-gray-300">
                    <div className="px-2  py-1">
                      $ {state.totalAdditionPreviousMonth}
                    </div>
                  </td>
                  <td className="  text-gray-700  ">
                    <div className="px-2  py-1 ">
                      $ {state.totalDeductionPreviousMonth}
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 align-middle text-gray-700 border-r border-gray-300">
                    Total approved this Month
                  </td>
                  <td className="   text-gray-700  border-r border-gray-300">
                    <div className="px-2  py-1 ">
                      $ {state.totalAdditionThisMonth}
                    </div>
                  </td>
                  <td className=" text-gray-700 ">
                    <div className="px-2  py-1  outline-none">
                      $ {state.totalDeductionThisMonth}
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 align-middle text-gray-700 border-r border-gray-300">
                    TOTALS
                  </td>
                  <td className="px-2 align-middle text-gray-700  border-r border-gray-300">
                    $ {changeOrderSummaryAdditionSum.toFixed(2)}
                  </td>
                  <td className="px-2 align-middle ">
                    $ {changeOrderSummaryDeductionSum.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 align-middle text-gray-700 border-r border-gray-300">
                    NET CHANGES by Change Order
                  </td>
                  <td
                    colSpan={2}
                    className="px-2 align-middle text-gray-700  border-r border-gray-300"
                  >
                    $ {changeOrderNetChanges}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-3">
            <div>
              <QuinaryHeading title="The undersigned Contractor certifies that to the best of the Contractor's knowledge, information and belief the Work covered by this Application for Payment has been completed in accordance with the Contract Documents, that all amounts have been paid by the Contractor for Work for which previous Certificates for Payment were issued and payments received from the Owner, and that current payment shown herein is now due." />
            </div>

            <div className="grid gap-2 grid-cols-2 justify-between my-3">
              <div className="grid grid-cols-12 items-center gap-1">
                <QuinaryHeading className="col-span-2" title="By:" />
                <input
                  className="px-2 col-span-6 py-1 border border-gray-300 outline-none"
                  type="text"
                  disabled
                />
              </div>

              <div className="grid grid-cols-12 items-center gap-1">
                <QuinaryHeading className="col-span-2" title="Date:" />
                <input
                  className="px-2 col-span-6 rounded-none py-[7px] border border-gray-300 outline-none"
                  disabled
                />
              </div>

              <div className="grid grid-cols-12 gap-1 items-center">
                <QuinaryHeading className="col-span-2" title="State of:" />
                <input
                  className="col-span-6 px-2 py-1 border border-gray-300 outline-none"
                  type="text"
                  disabled
                />
              </div>
              <div className="grid grid-cols-12 gap-1 items-center">
                <QuinaryHeading className="col-span-2" title="Country of:" />
                <input
                  className="px-2 col-span-6 py-1 border border-gray-300 outline-none"
                  type="text"
                  disabled
                />
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <QuinaryHeading title="Subscribed and sworn to before me this:" />
                <input
                  className="px-2 py-1 border border-gray-300 outline-none"
                  type="text"
                  disabled
                />
              </div>

              <div className="flex items-center space-x-2">
                <QuinaryHeading title="Notary Public:" />
                <input
                  className="px-2 py-1 border border-gray-300 outline-none"
                  type="text"
                  disabled
                />
              </div>

              <div className="flex items-center space-x-2">
                <QuinaryHeading title="My Commission expires:" />
                <input
                  className="px-2 py-1 border border-gray-300 outline-none"
                  type="text"
                  disabled
                />
              </div>
            </div>
            <Divider className="m-0 my-1" />

            <div>
              <TertiaryHeading title="ARCHITECT'S CERTIFICATE FOR PAYMENT" />
              <QuinaryHeading title="In accordance with the Contract Documents, based on on-site observations and the data comprising the application, the Architect certifies to the Owner that to the best of the Architect's knowledge, information and belief the Work has progressed as indicated, the quality of the Work is in accordance with the Contract Documents, and the Contractor is entitled to payment of the AMOUNT CERTIFIED." />

              <div className="py-2">
                <div className="flex items-center space-x-2">
                  <QuinaryHeading title="AMOUNT CERTIFIED:" />
                  <input
                    className="px-2 py-1 border border-gray-300 outline-none"
                    type="number"
                    disabled
                  />
                </div>
                <QuinaryHeading title="(Attach explanation if amount certified differs from the amount applied. Initial all figures on this Application and onthe Continuation Sheet that are changed to conform with the amount certified.)" />
              </div>

              <div className="space-y-2">
                <TertiaryHeading title="ARCHITECT:" className="text-sm" />
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <QuinaryHeading title="AMOUNT CERTIFIED:" />
                    <input
                      className="px-2 py-1 border border-gray-300 outline-none"
                      type="number"
                      disabled
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <QuinaryHeading title="AMOUNT CERTIFIED:" />
                    <input
                      className="px-2 py-1 border border-gray-300 outline-none"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
                <QuinaryHeading title="This Certificate is not negotiable. The AMOUNT CERTIFIED is payable only to the Contractor named herein. Issuance, payment and acceptance of payment are without prejudice to any rights of the Owner or Contractor under this Contract." />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">{children}</div>
    </div>
  );
}
