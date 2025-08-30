import { IFinancialExpense } from '@/app/interfaces/financial/financial-expense.interface';

export type IFinancialStatementState = {
  assets: {
    cashClearing: number;
    startUpInventory: number;

    // Accumulated Depreciation
    accumulatedDepreciationVehicle: number;
    totalAccumulatedDepreciationBuilding: number;
  };

  liabilities: {
    healthInsurancePayable: number;
    shareHoldersPayable: number;
    totalLongTermLiabilities: number;
    statePayrollTaxesPayable: number;
  };

  equity: {
    capitalStock: number;
    otherPaidInCapital: number;
    retainedEarnings: number;
  };
};

export type IFinancialStatementCalculatedValues = {
  assets: {
    cashOnBank: number;
    totalStandardInvoices: number;
    contractReceivable: number;
    totalCurrentAssets: () => number;
  };
  longTermAssets: {
    totalLongTermAssets: number;
  };
  accumalatedDepreciation: {
    netLongTermAssets: () => number;
    totalAssets: () => number;
    totalAccumulatedDepreciation: () => number;
  };
  currentLiabilities: {
    totalAccountsPayable: number;
    creditCards: number;
    totalCurrentLiabilities: () => number;
  };
  liabilities: {
    totalLiabilities: () => number;
  };
  equity: {
    subTotalEquity: () => number;
    totalEquity: () => number;
    totalLiabilitiesAndEquity: () => number;
  };
  directExpense: {
    materials: number;
    labourExpenses: number;
    subcontractedExpense: number;
    otherJobExpense: number;
    totalDirectExpense: () => number;
    grossProfit: () => number;
  };
  operatingIncome: {
    contractIncome: () => number;
    totalOperatingIncome: () => number;
  };
  overheadExpense: {
    overheadList: IFinancialExpense[];

    totalOverheadExpense: () => number;
    totalIndirectExpense: () => number;
    incomeFromOperations: () => number;
  };
  netIncome: {
    netIncomeBeforeTax: () => number;
    totalNetIncome: () => number;
  };
};
