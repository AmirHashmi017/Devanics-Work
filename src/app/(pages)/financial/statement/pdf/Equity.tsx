import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { RowCell, TableRow, TableRowHeader } from './table';
import {
  IFinancialStatementCalculatedValues,
  IFinancialStatementState,
} from '../types';

const styles = StyleSheet.create({
  container: {
    marginTop: 3,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 24,
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
export function FinancialEquity({
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
      <Text style={styles.heading}>Equity</Text>
      <TableRowHeader style={{ marginTop: 4 }}>
        <RowCell style={styles.headingCell} value="Equity/Capital" />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Amount"
        />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Total"
        />
      </TableRowHeader>

      {/* Capital Stock */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Capital Stock"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.equity.capitalStock.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Other Paid In Capital */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Other Paid In Capital"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.equity.otherPaidInCapital.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Retained Earnings */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Retained Earnings"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.equity.retainedEarnings.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Subtotal Equity/Capital */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Subtotal Equity/Capital"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.equity.subTotalEquity().toFixed(2)}`}
        />
      </TableRow>
    </View>
  );
}
