import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { PdfHeader } from './PdfHeader';
import { FinancialPeriod } from './FinancialPeriod';
import { FinancialAssets } from './Assets';
import {
  IFinancialStatementCalculatedValues,
  IFinancialStatementState,
} from '../types';
import { IFinancialAsset } from '@/app/interfaces/financial/financial-asset.interface';
import { FinancialLiabilities } from './Liabilities';
import { FinancialEquity } from './Equity';
import { PdfFooter } from './PdfFooter';
import { FinancialIncomeStatement } from './IncomeStatement';
// import { PdfData } from './type';

type Props = {
  logo?: string;
  brandingColor?: string;
  companyName: string;

  //   Financial Statement Period
  period: string;

  //   Values
  values: IFinancialStatementState;
  calculatedValues: IFinancialStatementCalculatedValues;

  assets: IFinancialAsset[];

  currency: {
    locale: string;
    code: string;
    symbol: string;
  };

  incomeStatementTitle: string;
};

const FinancialStatementPdf = (props: Props) => {
  return (
    <Document>
      <Page size={'A4'} style={{ margin: 2 }}>
        {/* Header */}
        <PdfHeader
          logo={props.logo}
          brandingColor={props.brandingColor}
          companyName={props.companyName}
        />
        {/* Financial Period */}
        <FinancialPeriod period={props.period} />

        {/* Assets */}
        <FinancialAssets
          values={props.values}
          calculatedValues={props.calculatedValues}
          currency={props.currency}
          assets={props.assets}
        />

        {/* Liabilites */}
        <FinancialLiabilities
          values={props.values}
          calculatedValues={props.calculatedValues}
          currency={props.currency}
        />

        {/* Equity */}
        <FinancialEquity
          calculatedValues={props.calculatedValues}
          currency={props.currency}
          values={props.values}
        />

        <PdfFooter brandingColor={props.brandingColor} />
      </Page>
      <Page size={'A4'} style={{ margin: 2 }}>
        <PdfHeader
          logo={props.logo}
          brandingColor={props.brandingColor}
          companyName={props.companyName}
        />
        <FinancialIncomeStatement
          title={props.incomeStatementTitle}
          calculatedValues={props.calculatedValues}
          currency={props.currency}
          values={props.values}
        />
        <PdfFooter brandingColor={props.brandingColor} />
      </Page>
    </Document>
  );
};

export default FinancialStatementPdf;
