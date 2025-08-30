'use client';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Country } from 'country-state-city';
import moment from 'moment';

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
    width: 150,
  },
});

type Props = {
  bids: IBidManagement[];
};
export default function BidListPdf({ bids }: Props) {
  return (
    <Document>
      <Page>
        <View style={{ paddingHorizontal: 30 }}>
          <View style={styles.container}>
            <Text style={styles.heading}>Project</Text>
            <Text style={styles.heading}>Estimated Start Date</Text>
            <Text style={styles.heading}>Location</Text>
            <Text style={styles.heading}>Stage</Text>
            <Text style={styles.heading}>Status</Text>
          </View>

          {bids.map((item) => (
            <View key={item._id} style={styles.itemsContainer}>
              <Text style={[styles.text, { flex: 1 }]}>{item.projectName}</Text>
              <Text style={[styles.text, { flex: 1 }]}>
                {moment(item.estimatedStartDate).format('ll')}
              </Text>
              <Text
                style={[styles.text, { flex: 1 }]}
              >{`${item.city} ${Country.getCountryByCode(item.country)?.name}`}</Text>
              <Text style={[styles.text, { flex: 1 }]}>{item.stage}</Text>
              <Text style={[styles.text, { flex: 1 }]}>{item.status}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
