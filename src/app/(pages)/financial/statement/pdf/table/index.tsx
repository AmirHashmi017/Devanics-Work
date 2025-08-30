import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';

const rowStyles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    border: 1,
    borderColor: '#e6e6e6',
    padding: 4,
  },
  simpleRow: {
    border: 0,
    padding: 0,
  },
  rowHeader: {
    backgroundColor: '#F2F4F7',
  },
  cell: {
    width: '33%',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 11,
  },
});

type RowProps = {
  style: Style;
  children: React.ReactNode;
};

export function TableRowHeader({ children, style }: RowProps) {
  return (
    <View style={[rowStyles.row, rowStyles.rowHeader, style]}>{children}</View>
  );
}

export function TableRow({ children, style }: RowProps) {
  return (
    <View style={[rowStyles.row, rowStyles.simpleRow, style]}>{children}</View>
  );
}

type CellProps = {
  value: string;
  style: Style;
};

export const RowCell = ({ value, style }: CellProps) => {
  return <Text style={[rowStyles.cell, style]}>{value}</Text>;
};
