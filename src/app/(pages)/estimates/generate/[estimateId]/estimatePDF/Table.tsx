// import { IInvoice } from '@/app/interfaces/invoices.interface';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

const PurpleColor = '#7138DF';
const LightBalck = '#475467';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: `1px solid #EAECF0`,
    paddingBottom: 7,
  },
  divider: {
    borderBottom: `1px solid #EAECF0`,
    paddingVertical: 7,
  },
  heading: { color: PurpleColor, fontSize: 12, marginBottom: 5, flex: 1 },
  text: { color: LightBalck, fontSize: 12, letterSpacing: 0.9, marginTop: 1 },
  totalContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 50,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
  },
});

type Props = {
  estimateDetail: any;
  pdfData: any;
};
export function ItemsTable({ estimateDetail, pdfData }: Props) {
  const currency = useCurrencyFormatter();
  return (
    <View style={{ paddingHorizontal: 30 }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Description</Text>
        <Text style={styles.heading}>Quantity</Text>
        <Text style={styles.heading}>Total Amount</Text>
      </View>

      {pdfData.map((item: any) => (
        <View key={item._id} style={styles.itemsContainer}>
          <Text style={[styles.text, { flex: 1 }]}>{item.description}</Text>
          <Text style={[styles.text, { flex: 1 }]}>{item.quantity}</Text>
          <Text style={[styles.text, { flex: 1 }]}>
            {currency.format(item.total)}
          </Text>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <View style={styles.subtotalContainer}>
          <Text style={styles.text}>Subtotal</Text>
          <Text style={styles.text}>
            {currency.format(estimateDetail?.totalCost)}
          </Text>
        </View>

        <View style={[styles.subtotalContainer, { marginTop: 5 }]}>
          <Text style={styles.text}>Material Tax</Text>
          <Text style={styles.text}>
            {currency.format(estimateDetail?.totalBidDetail?.materialTax)}
          </Text>
        </View>

        <View style={[styles.subtotalContainer, { marginTop: 5 }]}>
          <Text style={styles.text}>Bond Fee</Text>
          <Text style={styles.text}>
            {currency.format(estimateDetail?.totalBidDetail?.bondFee)}
          </Text>
        </View>

        <View style={[styles.subtotalContainer, { marginTop: 5 }]}>
          <Text style={styles.text}>Profit And Overhead</Text>
          <Text style={styles.text}>
            {currency.format(estimateDetail?.totalBidDetail?.overheadAndProfit)}
          </Text>
        </View>

        <View style={[styles.subtotalContainer, { marginTop: 5 }]}>
          <Text style={styles.text}>Total Cost</Text>
          <Text style={styles.text}>
            {currency.format(
              estimateDetail?.totalCost +
                estimateDetail?.totalBidDetail?.materialTax +
                estimateDetail?.totalBidDetail?.bondFee +
                estimateDetail?.totalBidDetail?.overheadAndProfit
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}
