import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { RowCell, TableRow, TableRowHeader } from './table';
import {
  IFinancialStatementCalculatedValues,
  IFinancialStatementState,
} from '../types';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  headingCell: {
    width: '40%',
  },
  descriptionCell: {
    width: '30%',
  },
  cell: {
    textAlign: 'center',
    width: '40%',
  },
  borderCell: {
    borderRight: 1,
    borderBottom: 1,
    borderColor: '#e6e6e6',
    padding: 3,
    textAlign: 'center',
  },
});

export function FinancialLiabilities({
  calculatedValues,
  currency,
  values,
}: {
  values: IFinancialStatementState;
  calculatedValues: IFinancialStatementCalculatedValues;
  currency: {
    locale: string;
    code: string;
    symbol: string;
  };
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Liabilites</Text>

      <TableRowHeader style={{ marginTop: 10 }}>
        <RowCell style={styles.headingCell} value="Current Liabilities" />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Amount"
        />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Total"
        />
      </TableRowHeader>

      {/* Trade Accounts Payable */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Trade Accounts Payable"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${calculatedValues.currentLiabilities.totalAccountsPayable.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* State Payroll Taxes Payable */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="State Payroll Taxes Payable"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.liabilities.statePayrollTaxesPayable.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Health Insurance Payable */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Health Insurance Payable"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.liabilities.healthInsurancePayable.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Credit Cards */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Credit Cards"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${calculatedValues.currentLiabilities.creditCards.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Total */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Total Current Liabilities"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.currentLiabilities.totalCurrentLiabilities().toFixed(2)}`}
        />
      </TableRow>

      {/* Long Term Liabilities */}
      <TableRowHeader style={{ marginTop: 10 }}>
        <RowCell style={styles.headingCell} value="Long Term Liabilities" />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Amount"
        />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Total"
        />
      </TableRowHeader>

      {/* Shareholder Payable */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Shareholder Payable"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.liabilities.shareHoldersPayable.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Total Long Term Liabilities */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Total Long Term Liabilities"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.liabilities.totalLongTermLiabilities.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Total */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Total Liabilities"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.liabilities.totalLiabilities().toFixed(2)}`}
        />
      </TableRow>
    </View>
  );
}
