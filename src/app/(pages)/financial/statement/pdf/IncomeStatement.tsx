import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { RowCell, TableRow, TableRowHeader } from './table';
import {
  IFinancialStatementCalculatedValues,
  IFinancialStatementState,
} from '../types';
import costCodeDataWithId from '../../cost-code';

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

type Props = {
  title: string;
  values: IFinancialStatementState;
  calculatedValues: IFinancialStatementCalculatedValues;
  currency: {
    locale: string;
    code: string;
    symbol: string;
  };
};
export function FinancialIncomeStatement({
  title,
  calculatedValues,
  currency,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Current  profit or loss */}
      <View
        style={{
          padding: 7,
          backgroundColor: '#F2F4F7',
          marginTop: 6,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          <Text style={styles.summaryText}>Current Profit (Loss)</Text>
          <Text style={styles.summaryText}>
            {currency.symbol}{' '}
            {calculatedValues.netIncome.totalNetIncome().toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          <Text style={styles.summaryText}>Total Equity/Capital</Text>
          <Text style={[styles.summaryText, { marginRight: 0 }]}>
            {currency.symbol} {calculatedValues.equity.totalEquity().toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          <Text style={styles.summaryText}>Total Liabilities & Equity</Text>
          <Text style={[styles.summaryText, { marginRight: 0 }]}>
            {currency.symbol}{' '}
            {calculatedValues.equity.totalLiabilitiesAndEquity().toFixed(2)}
          </Text>
        </View>
      </View>

      <Text style={[styles.heading, { marginTop: 10 }]}>{title}</Text>

      <TableRowHeader style={{ marginTop: 10 }}>
        <RowCell style={styles.headingCell} value="Operating Income" />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Amount"
        />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Total"
        />
      </TableRowHeader>

      {/* Contract Income */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Contract Income"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${calculatedValues.operatingIncome.contractIncome().toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Total */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Total Operating Income"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.operatingIncome.totalOperatingIncome().toFixed(2)}`}
        />
      </TableRow>

      {/* Direct Expense */}

      <TableRowHeader style={{ marginTop: 10 }}>
        <RowCell style={styles.headingCell} value="Direct Expense" />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Amount"
        />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Total"
        />
      </TableRowHeader>

      {/* Material */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Material"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${calculatedValues.directExpense.materials.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Equipment Expense */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Equipment Expense"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${calculatedValues.directExpense.labourExpenses.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Subcontracted */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Subcontracted"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${calculatedValues.directExpense.subcontractedExpense.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Other Job Expense */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Other Job Expense"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${calculatedValues.directExpense.otherJobExpense.toFixed(2)}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Total Direct Expense */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Total Direct Expense"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.directExpense.totalDirectExpense().toFixed(2)}`}
        />
      </TableRow>

      {/* Total Direct and Equipment/Shop Expense */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Total Direct and Equipment/Shop Expense"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.directExpense.totalDirectExpense().toFixed(2)}`}
        />
      </TableRow>

      {/* Gross Profit */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Gross Profit"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.directExpense.grossProfit().toFixed(2)}`}
        />
      </TableRow>

      {/* Overhead expense table */}
      <TableRowHeader style={{ marginTop: 10 }}>
        <RowCell style={styles.headingCell} value="Overhead" />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Amount"
        />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Total"
        />
      </TableRowHeader>

      {/* Map over overheadlist */}
      {calculatedValues.overheadExpense.overheadList.map((expense) => {
        return (
          <TableRow style={{ marginTop: 1 }} key={expense._id}>
            <RowCell
              style={{ ...styles.cell, ...styles.borderCell }}
              value={
                costCodeDataWithId.find(
                  (costCode) => costCode.id === expense.costCode
                )?.description || ''
              }
            />
            <RowCell
              style={styles.borderCell}
              value={`${currency.symbol} ${expense.totalPrice.toFixed(2)}`}
            />
            <RowCell style={{}} value="" />
          </TableRow>
        );
      })}

      {/* Total Overhead Expense */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Total Overhead Expense"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.overheadExpense.totalOverheadExpense().toFixed(2)}`}
        />
      </TableRow>

      {/* Total Indirect Expense */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Total Indirect Expense"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.overheadExpense.totalIndirectExpense().toFixed(2)}`}
        />
      </TableRow>

      {/* Income from Operations */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Income from Operations"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.overheadExpense.incomeFromOperations().toFixed(2)}`}
        />
      </TableRow>

      {/* Net Income */}
      <View
        style={{
          padding: 7,
          backgroundColor: '#F2F4F7',
          marginTop: 6,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 5,
          }}
        >
          <Text style={styles.summaryText}>Net Income before Tax</Text>
          <Text style={styles.summaryText}>
            {currency.symbol}{' '}
            {calculatedValues.netIncome.netIncomeBeforeTax().toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 5,
          }}
        >
          <Text style={styles.summaryText}>Net Income</Text>
          <Text style={[styles.summaryText, { marginRight: 0 }]}>
            {currency.symbol}{' '}
            {calculatedValues.netIncome.netIncomeBeforeTax().toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
