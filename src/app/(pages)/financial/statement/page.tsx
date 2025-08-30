'use client';

// import CustomButton from '@/app/component/customButton/button';
import PrimaryHeading from '@/app/component/headings/primary';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { withAuth } from '@/app/hoc/withAuth';
import { CurrentAssetTable } from './components/assets/CurrentAssetTable';
import { LongTermAssetTable } from './components/assets/LongTermAssets';
import { AccumulatedDepreciationTable } from './components/assets/AccumulatedDepreciation';
import { AssetTotal } from './components/assets/AssetTotal';
import { CurrentLiabilitiesTable } from './components/liabilities/CurrentLiabilities';
import { LongTermLiabilitiesTable } from './components/liabilities/LongTermLiabilities';
import { EquityTable } from './components/equity/EquityTable';
import { OperatingIncomeTable } from './components/income-statement/OperatingIncomeTable';
import { DirectExpenseTable } from './components/income-statement/DirectExpenseTable';
import { OverheadExpenseTable } from './components/income-statement/OverheadExpense';
import { DatePicker, Skeleton } from 'antd';
import {
  IFinancialStatementCalculatedValues,
  IFinancialStatementState,
} from './types';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import financialStatement from '@/app/services/financial/financial-statement';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { IInvoice } from '@/app/interfaces/invoices.interface';
import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';
import { IFinancialExpense } from '@/app/interfaces/financial/financial-expense.interface';
import { IFinancialAsset } from '@/app/interfaces/financial/financial-asset.interface';
import { getCashonBankFromAssets } from './utils';
import _ from 'lodash';
// import { handleDownloadPdfFromRefAsync } from '@/app/utils/downloadFile';
// import { ClientInvoiceFooter } from '../aia-invoicing/components/ClientInvoiceFooter';
// import { ClientInvoiceHeader } from '../aia-invoicing/components/ClientInvoiceHeader';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
// import dynamic from 'next/dynamic';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useUser } from '@/app/hooks/useUser';

// import FinancialStatementPdf from './pdf';
import moment from 'moment';
import dynamic from 'next/dynamic';
import CustomButton from '@/app/component/customButton/button';
const FinancialStatementPdf = dynamic(
  () => import('./pdf/index').then((m) => m.default),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

function FinancialStatementPage() {
  const [dates, setDates] = useState({
    start: dayjs().startOf('month').toDate(),
    end: dayjs().toDate(),
  });

  const authUser = useUser();

  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const currency = useCurrencyFormatter();
  const [data, setData] = useState<{
    standardInvoices: IInvoice[];
    aiainvoices: IAIAInvoice[];
    expenses: IFinancialExpense[];
    assets: IFinancialAsset[];
  }>({
    aiainvoices: [],
    standardInvoices: [],
    expenses: [],
    assets: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFinancialStatement();
  }, [dates]);

  async function getFinancialStatement() {
    setLoading(true);
    try {
      const response = await financialStatement.httpGetAllFinancialStatements(
        dates.start,
        dates.end
      );
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik<IFinancialStatementState>({
    initialValues: {
      assets: {
        cashClearing: 50.0,
        startUpInventory: 0.0,

        accumulatedDepreciationVehicle: 0.0,
        totalAccumulatedDepreciationBuilding: 0.0,
      },
      liabilities: {
        healthInsurancePayable: 0.0,
        shareHoldersPayable: 0.0,
        totalLongTermLiabilities: 0.0,
        statePayrollTaxesPayable: 0.0,
      },

      equity: {
        capitalStock: 0.0,
        otherPaidInCapital: 0.0,
        retainedEarnings: 0.0,
      },
    },
    onSubmit() {},
  });

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  function getCalculatedValues() {
    // const aiaInvoicesReceiveables = data.aiainvoices.filter(invoice => invoice.isParent).map((invoice) => {
    //   // get receivable amount
    //   const receiveables = invoice.amountPaid;
    //   return receiveables;
    // });

    const groupedApplications = _.groupBy(data.aiainvoices, (app) =>
      app.isParent ? app._id : app.parent
    );

    const lastPhases = _.map(groupedApplications, (group) => {
      return _.maxBy(group, 'createdAt'); // Select the last phase by createdAt
    });

    const totalRemainingAmount = _.sumBy(lastPhases, (app) =>
      app ? app.totalAmount - app.amountPaid : 0
    );

    const values: IFinancialStatementCalculatedValues = {
      assets: {
        cashOnBank: getCashonBankFromAssets(data.assets).reduce(
          (acc, curr) => acc + curr.totalPrice,
          0
        ),
        totalStandardInvoices: data.standardInvoices.reduce(
          (acc, curr) => acc + curr.amount,
          0
        ),
        contractReceivable: totalRemainingAmount,
        totalCurrentAssets: function () {
          return (
            this.cashOnBank +
            this.totalStandardInvoices +
            this.contractReceivable +
            formik.values.assets.cashClearing +
            formik.values.assets.startUpInventory
          );
        },
      },
      longTermAssets: {
        totalLongTermAssets: data.assets.reduce(
          (acc, curr) => acc + curr.totalPrice,
          0
        ),
      },
      accumalatedDepreciation: {
        totalAccumulatedDepreciation: () => {
          return (
            formik.values.assets.totalAccumulatedDepreciationBuilding +
            formik.values.assets.accumulatedDepreciationVehicle
          );
        },
        netLongTermAssets: () => {
          return (
            values.longTermAssets.totalLongTermAssets -
            values.accumalatedDepreciation.totalAccumulatedDepreciation()
          );
        },
        totalAssets: () => {
          return (
            values.assets.totalCurrentAssets() +
            values.accumalatedDepreciation.netLongTermAssets()
          );
        },
      },
      currentLiabilities: {
        totalAccountsPayable: data.expenses
          .filter((expense) => expense.expenseType === 'SubContract')
          .reduce((acc, curr) => acc + curr.totalPrice, 0),
        creditCards: data.expenses
          .filter((expense) => expense.paymentMethod === 'Credit Card')
          .reduce((acc, curr) => acc + curr.totalPrice, 0),
        totalCurrentLiabilities() {
          return (
            this.totalAccountsPayable +
            formik.values.liabilities.statePayrollTaxesPayable +
            formik.values.liabilities.healthInsurancePayable +
            this.creditCards
          );
        },
      },
      liabilities: {
        totalLiabilities() {
          return (
            formik.values.liabilities.shareHoldersPayable +
            formik.values.liabilities.totalLongTermLiabilities
          );
        },
      },
      equity: {
        subTotalEquity() {
          return (
            formik.values.equity.capitalStock +
            formik.values.equity.otherPaidInCapital +
            formik.values.equity.retainedEarnings
          );
        },
        totalEquity: () => {
          return (
            values.accumalatedDepreciation.totalAssets() -
            values.liabilities.totalLiabilities()
          );
        },
        totalLiabilitiesAndEquity: () => {
          return (
            values.liabilities.totalLiabilities() +
            values.equity.subTotalEquity()
          );
        },
      },

      directExpense: {
        materials: data.expenses
          .filter((expense) => expense.expenseType === 'Material')
          .reduce((acc, curr) => acc + curr.totalPrice, 0),
        labourExpenses: data.expenses
          .filter((expense) => expense.expenseType === 'Labour')
          .reduce((acc, curr) => acc + curr.totalPrice, 0),
        otherJobExpense: data.expenses
          .filter((expense) => expense.expenseType === 'General Condition')
          .reduce((acc, curr) => acc + curr.totalPrice, 0),
        subcontractedExpense: data.expenses
          .filter((expense) => expense.expenseType === 'SubContract')
          .reduce((acc, curr) => acc + curr.totalPrice, 0),
        totalDirectExpense() {
          return (
            this.materials +
            this.labourExpenses +
            this.otherJobExpense +
            this.subcontractedExpense
          );
        },
        grossProfit: () => {
          return (
            values.operatingIncome.totalOperatingIncome() -
            values.directExpense.totalDirectExpense()
          );
        },
      },
      operatingIncome: {
        contractIncome: () => {
          return (
            values.assets.contractReceivable +
            values.assets.totalStandardInvoices
          );
        },
        totalOperatingIncome() {
          return this.contractIncome();
        },
      },
      overheadExpense: {
        overheadList: data.expenses.filter(
          (expense) => expense.expenseType === 'Overhead'
        ),
        incomeFromOperations: () => {
          return (
            values.directExpense.grossProfit() +
            values.overheadExpense.totalIndirectExpense()
          );
        },
        totalIndirectExpense() {
          return this.totalOverheadExpense();
        },
        totalOverheadExpense() {
          return this.overheadList.reduce(
            (acc, curr) => acc + curr.totalPrice,
            0
          );
        },
      },
      netIncome: {
        netIncomeBeforeTax: () => {
          return values.overheadExpense.totalOverheadExpense();
        },
        totalNetIncome() {
          return this.netIncomeBeforeTax();
        },
      },
    };
    return () => {
      return values as IFinancialStatementCalculatedValues;
    };
  }

  const calculatedValues = getCalculatedValues();

  function formatDate(date: Date) {
    return dayjs(date).format('MM/DD/YYYY');
  }

  const INCOME_STATEMENT_TITLE = `Income Statement ${moment(dates.start).format(
    'MMM YYYY'
  )} - ${moment(dates.end).format('MMM YYYY')}
    `;

  return (
    <section className="mt-6  space-y-4 mb-[39px] mx-4 rounded-xl bg-white p-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <PrimaryHeading title="Financial Statement" className="text-[20px]" />

          <DatePicker.RangePicker
            className="border-none"
            value={[dayjs(dates.start), dayjs(dates.end)]}
            onChange={(value) => {
              if (value && value[0] && value[1]) {
                setDates({
                  start: value[0].toDate(),
                  end: value[1].toDate(),
                });
              }
            }}
          />
        </div>

        <PDFDownloadLink
          document={
            <FinancialStatementPdf
              companyName={
                authUser?.companyName || authUser?.organizationName || ''
              }
              brandingColor={authUser?.brandingColor}
              logo={authUser?.companyLogo}
              period={`From ${formatDate(dates.start)} to ${formatDate(
                dates.end
              )}`}
              calculatedValues={calculatedValues()}
              values={formik.values}
              assets={data.assets}
              currency={currency.currency}
              incomeStatementTitle={INCOME_STATEMENT_TITLE}
            />
          }
          fileName={`Financial Statement-${formatDate(dates.start)}-${formatDate(dates.end)}`}
        >
          {/* @ts-ignore */}
          {({ loading }) => (
            <CustomButton
              text="Print Statement"
              className="!w-fit"
              isLoading={loading}
              loadingText="Downloading..."
              // disabled={isDownloadingPdf}
            />
          )}
        </PDFDownloadLink>
      </div>

      {/* Assets */}
      <div ref={ref} className="space-y-3">
        {/* {isDownloadingPdf ? <ClientInvoiceHeader /> : null} */}

        <div className="p-4 border space-y-2 rounded-md">
          <TertiaryHeading title="Assets" />
          <CurrentAssetTable
            formik={formik}
            calculatedValues={calculatedValues()}
          />
          <LongTermAssetTable
            calulatedValues={calculatedValues()}
            assets={data.assets}
          />
          <AccumulatedDepreciationTable formik={formik} />
          <AssetTotal calculatedValues={calculatedValues()} />
        </div>

        {/* LiabILITIES */}

        <div className="p-4 border space-y-2 rounded-md">
          <TertiaryHeading title="Liabilities" />

          <CurrentLiabilitiesTable
            formik={formik}
            calculatedValues={calculatedValues()}
          />
          <LongTermLiabilitiesTable
            calculatedValues={calculatedValues()}
            formik={formik}
          />
        </div>

        <div className="p-4 border space-y-2 rounded-md">
          <TertiaryHeading title="Equity" />

          <EquityTable calculatedValues={calculatedValues()} formik={formik} />
        </div>

        {/* Current  profit or loss */}

        <div className="p-4 rounded-sm bg-schestiLightGray ">
          <div className="flex space-y-3 flex-col justify-center  ml-20">
            <div className="grid grid-cols-5">
              <TertiaryHeading
                title="Current Profit (Loss)"
                className=" font-medium text-base"
              />
              <TertiaryHeading
                title={currency.format(
                  calculatedValues().netIncome.totalNetIncome()
                )}
                className=" text-base"
              />
            </div>

            <div className="grid grid-cols-5">
              <TertiaryHeading
                title="Total Equity/Capital"
                className=" font-medium text-base"
              />
              <TertiaryHeading
                title={currency.format(calculatedValues().equity.totalEquity())}
                className=" text-base"
              />
            </div>

            <div className="grid grid-cols-5">
              <TertiaryHeading
                title="Total Liabilities & Equity"
                className=" font-medium text-base"
              />
              <TertiaryHeading
                title={currency.format(
                  calculatedValues().equity.totalLiabilitiesAndEquity()
                )}
                className=" text-base"
              />
            </div>
          </div>
        </div>

        {/* Income Statement */}
        <div className="p-4 border space-y-2 rounded-md">
          <TertiaryHeading title={INCOME_STATEMENT_TITLE} />
          <OperatingIncomeTable calculatedValues={calculatedValues()} />
          <DirectExpenseTable calculatedValues={calculatedValues()} />

          <OverheadExpenseTable calculatedValues={calculatedValues()} />
        </div>

        {/*  NET  Income  */}
        <div className="p-4 rounded-sm bg-schestiLightGray ">
          <div className="flex space-y-3 flex-col justify-center  ml-20">
            <div className="grid grid-cols-5">
              <TertiaryHeading
                title="Net Income  before Tax"
                className=" font-medium text-base"
              />
              <TertiaryHeading
                title={currency.format(
                  calculatedValues().netIncome.netIncomeBeforeTax()
                )}
                className=" text-base"
              />
            </div>

            <div className="grid grid-cols-5">
              <TertiaryHeading
                title="Net Income"
                className=" font-medium text-base"
              />
              <TertiaryHeading
                title={currency.format(
                  calculatedValues().netIncome.netIncomeBeforeTax()
                )}
                className=" text-base"
              />
            </div>
          </div>
        </div>
        {/* {isDownloadingPdf ? <ClientInvoiceFooter /> : null} */}
      </div>
    </section>
  );
}

export default withAuth(FinancialStatementPage);
