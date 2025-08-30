import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { RowCell, TableRow, TableRowHeader } from './table';
import {
  IFinancialStatementCalculatedValues,
  IFinancialStatementState,
} from '../types';
import { IFinancialAsset } from '@/app/interfaces/financial/financial-asset.interface';
import _ from 'lodash';

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
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

export function FinancialAssets({
  calculatedValues,
  values,
  currency,
  assets,
}: {
  values: IFinancialStatementState;
  calculatedValues: IFinancialStatementCalculatedValues;
  currency: {
    locale: string;
    code: string;
    symbol: string;
  };
  assets: IFinancialAsset[];
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Assets</Text>

      <TableRowHeader style={{ marginTop: 10 }}>
        <RowCell style={styles.headingCell} value="Current Assets" />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Amount"
        />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Total"
        />
      </TableRowHeader>

      {/* Cash on Bank */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Cash on Bank"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${calculatedValues.assets.cashOnBank}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Cash Clearing */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Cash Clearing"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.assets.cashClearing}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Contract Receivables */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Contract Receivables"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${calculatedValues.assets.contractReceivable}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Other Receivables */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Other Receivables"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${calculatedValues.assets.totalStandardInvoices}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Startup Inventory */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Startup Inventory"
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.assets.startUpInventory}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Total */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Total Current Assets"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.assets.totalCurrentAssets().toFixed(2)}`}
        />
      </TableRow>

      {/* Long Term Assets */}
      <TableRowHeader style={{ marginTop: 10 }}>
        <RowCell style={styles.headingCell} value="Long Term Assets" />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Amount"
        />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Total"
        />
      </TableRowHeader>

      {/* Show Long Term Assets */}
      {_(assets)
        .groupBy('assetType')
        .map((items, assetType) => ({
          assetType,
          totalPrice: _.sumBy(items, 'totalPrice'), // Sum 'totalPrice' for each assetType
        }))
        .value()
        .map((asset, idx) => {
          return (
            <TableRow style={{ marginTop: 1 }} key={idx}>
              <RowCell
                style={{ ...styles.cell, ...styles.borderCell }}
                value={asset.assetType}
              />
              <RowCell
                style={styles.borderCell}
                value={`${currency.symbol} ${asset.totalPrice}`}
              />
              <RowCell style={{}} value="" />
            </TableRow>
          );
        })}

      {/* Total Long Term Assets */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value="Total Long Term Assets"
        />
        <RowCell style={styles.borderCell} value="" />
        <RowCell
          style={{ textAlign: 'center' }}
          value={`${currency.symbol} ${calculatedValues.longTermAssets.totalLongTermAssets.toFixed(2)}`}
        />
      </TableRow>

      {/* Accumulated Depreciation */}
      <TableRowHeader style={{ marginTop: 10 }}>
        <RowCell style={styles.headingCell} value="Accumulated Depreciation" />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Amount"
        />
        <RowCell
          style={{ ...styles.descriptionCell, textAlign: 'center' }}
          value="Total"
        />
      </TableRowHeader>

      {/* Accum Dep'n Vehicles */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value={"Accum Dep'n Vehicles"}
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.assets.accumulatedDepreciationVehicle}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Accum Dep'n Vehicles */}
      <TableRow style={{ marginTop: 1 }}>
        <RowCell
          style={{ ...styles.cell, ...styles.borderCell }}
          value={"Accum Dep'n Building"}
        />
        <RowCell
          style={styles.borderCell}
          value={`${currency.symbol} ${values.assets.totalAccumulatedDepreciationBuilding}`}
        />
        <RowCell style={{}} value="" />
      </TableRow>

      {/* Net Long Term Assets */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingRight: 10,
          marginTop: 10,
        }}
      >
        <Text style={[styles.summaryText, { marginRight: 10 }]}>
          Net Long Term Assets
        </Text>
        <Text style={styles.summaryText}>
          {currency.symbol}{' '}
          {calculatedValues.accumalatedDepreciation
            .netLongTermAssets()
            .toFixed(2)}
        </Text>
      </View>

      {/* Total Assets */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingRight: 10,
          marginTop: 6,
        }}
      >
        <Text style={[styles.summaryText, { marginRight: 10 }]}>
          Total Assets
        </Text>
        <Text style={styles.summaryText}>
          {currency.symbol}{' '}
          {calculatedValues.accumalatedDepreciation.totalAssets().toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
