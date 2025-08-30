import { IUpdateCompanyDetail } from '@/app/interfaces/companyInterfaces/updateCompany.interface';
import { IInvoice } from '@/app/interfaces/invoices.interface';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import moment from 'moment';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

type Props = {
  user: IUpdateCompanyDetail;
  invoice: IInvoice;
  qrCodeValue: string;
};

const SYSTEM_COLOR = '#007AB6';
const LightBalck = '#475467';
const DarkColor = '#181818';

const styles = StyleSheet.create({
  container: { marginTop: 60, paddingHorizontal: 30 },
  avatarContainer: {
    flexDirection: 'column',
    // alignItems: 'flex-end',
  },
  avatar: {
    width: 120,
    height: 100,
    borderRadius: '50%',
  },
  qrcode: {
    width: 89,
    height: 90,
    borderRadius: '20%',
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

  heading: { color: SYSTEM_COLOR, fontSize: 12, marginBottom: 5 },
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
    backgroundColor: SYSTEM_COLOR,
    marginVertical: 15,
  },
});

async function getQrCode(text: string) {
  return await QRCode.toDataURL(text);
}

export function PdfCompanyDetails({ invoice, qrCodeValue }: Props) {
  const user = invoice.associatedCompany as IUserInterface;
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    getQrCode(qrCodeValue).then((res) => {
      setQrCode(res);
    });
  }, [invoice]);

  return (
    <View style={styles.container}>
      <View
        style={[
          { flexDirection: 'row', justifyContent: 'space-between' },
          { marginTop: 0, paddingHorizontal: 0 },
        ]}
      >
        <View style={styles.avatarContainer}>
          <Image
            src={
              user.companyLogo
              // ||
              // 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
            }
            style={styles.avatar}
            source={user.companyLogo}
          />
          <View style={styles.companyDetailContainer}>
            <Text style={styles.companyDetail}>{user.name}</Text>
            <Text style={styles.companyDetail}>{user.email}</Text>
            <Text style={styles.companyDetail}>
              {user.phone ? user.phone : ''}
            </Text>
          </View>
        </View>
        <View>
          {qrCode ? <Image src={qrCode} style={styles.qrcode} /> : null}
        </View>
      </View>

      <View style={styles.contractorContainer}>
        <View
          style={{
            flexDirection: 'column',
          }}
        >
          <Text style={styles.heading}>Billed To Client/Contractor</Text>
          <Text style={styles.text}>{`${invoice.companyRep}`}</Text>
          <Text style={styles.text}>{invoice.subContractorCompanyName}</Text>
          <Text style={styles.text}>{invoice.subContractorAddress}</Text>
        </View>

        <View
          style={{
            flexDirection: 'column',
          }}
        >
          <View>
            <Text style={styles.heading}>Date of Issue</Text>
            <Text style={styles.text}>
              {moment(invoice.issueDate).format('YYYY-MM-DD')}
            </Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={styles.heading}>Due Date</Text>
            <Text style={styles.text}>
              {moment(invoice.dueDate).format('YYYY-MM-DD')}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
          }}
        >
          <View>
            <Text style={styles.heading}>Invoice Number</Text>
            <Text style={styles.text}>{invoice.invoiceNumber}</Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={styles.heading}>Project Name</Text>
            <Text style={styles.text}>{invoice.projectName}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
          }}
        >
          <View>
            <Text style={styles.heading}>
              Amount Due (
              {invoice.currency?.code || user.currency.code || 'USD'})
            </Text>
            <Text
              style={styles.largeText}
            >{`(${invoice.currency?.code})${invoice.totalPayable.toFixed(2)}`}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider}></View>
    </View>
  );
}
