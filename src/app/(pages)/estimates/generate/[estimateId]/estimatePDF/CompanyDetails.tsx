import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { IUpdateCompanyDetail } from '@/app/interfaces/companyInterfaces/updateCompany.interface';
// import { IInvoice } from '@/app/interfaces/invoices.interface';
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
// import moment from 'moment';

type Props = {
  user: IUpdateCompanyDetail;
  estimateDetail: any;
};

const PurpleColor = '#7138DF';
const LightBalck = '#475467';
const DarkColor = '#181818';

const styles = StyleSheet.create({
  container: { marginTop: 60, paddingHorizontal: 30 },
  avatarContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: '50%',
  },
  companyDetailContainer: {
    paddingRight: 16,
    paddingTop: 12,
  },
  companyDetail: {
    color: LightBalck,
    fontSize: 12,
    lineHeight: 2,
  },

  contractorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  heading: { color: PurpleColor, fontSize: 12, marginBottom: 5 },
  text: {
    color: LightBalck,
    fontSize: 12,
  },
  largeText: {
    color: DarkColor,
    fontSize: 18,
  },

  divider: {
    height: 5,
    backgroundColor: PurpleColor,
    marginVertical: 15,
  },
});

export function PdfCompanyDetails({ estimateDetail, user }: Props) {
  const currency = useCurrencyFormatter();
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          src={
            user.companyLogo ||
            user.avatar ||
            'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
          }
          style={styles.avatar}
        />

        <View style={styles.companyDetailContainer}>
          <Text style={styles.companyDetail}>{user.name}</Text>
          <Text style={styles.companyDetail}>{user.email}</Text>
          <Text style={styles.companyDetail}>
            {user.phone ? user.phone : ''}
          </Text>
        </View>
      </View>

      <View style={styles.contractorContainer}>
        <View
          style={{
            flexDirection: 'column',
          }}
        >
          <Text style={styles.heading}>Billed To Client</Text>
          <Text style={styles.text}>
            {`${estimateDetail?.estimateRequestIdDetail?.clientName}`}
          </Text>
          <Text style={styles.text}>
            {estimateDetail?.estimateRequestIdDetail?.companyName}
          </Text>
        </View>

        {/* <View
          style={{
            flexDirection: 'column',
          }}
        >
          <View>
            <Text style={styles.heading}>Date of Issue</Text>
            <Text style={styles.text}>
              {moment(invoice?.issueDate).format('YYYY-MM-DD')}
            </Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={styles.heading}>Due Date</Text>
            <Text style={styles.text}>
              {moment(invoice?.dueDate).format('YYYY-MM-DD')}
            </Text>
          </View>
        </View> */}

        <View
          style={{
            flexDirection: 'column',
          }}
        >
          <View>
            <Text style={styles.heading}>Invoice Number</Text>
            <Text style={styles.text}>
              {Math.floor(Math.random() * 100) + 10756870}
            </Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={styles.heading}>Project Name</Text>
            <Text style={styles.text}>
              {estimateDetail?.estimateRequestIdDetail?.projectName}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
          }}
        >
          <View>
            <Text style={styles.heading}>Amount Due (USD)</Text>
            <Text
              style={styles.largeText}
            >{`${currency.format(estimateDetail?.totalCost)}`}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider}></View>
    </View>
  );
}
