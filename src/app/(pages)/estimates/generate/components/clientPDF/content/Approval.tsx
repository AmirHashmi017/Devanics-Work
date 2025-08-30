import { StyleSheet, View } from '@react-pdf/renderer';
import { PdfHeading, PdfText } from './Heading';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 60,
    paddingLeft: 20,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  signatureContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  childContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20,
  },
  signatureLine: {
    width: 120, // Adjust the width as needed
    borderBottom: '1 dotted black',
    marginBottom: 5,
  },
});

export function PdfApproval({ companyName }: { companyName: string }) {
  return (
    <View>
      <Signature title="Client Approval" />
      <Signature title={`${companyName} Approval`} />
    </View>
  );
}

const Signature = ({ title }: { title: string }) => (
  <View style={styles.container}>
    <PdfHeading text={title} />
    <View style={styles.signatureContainer}>
      <Child text="Signature" />
      <Child text="Date" style={{ marginLeft: 4 }} />
    </View>
  </View>
);

const Child = ({
  text,
  style = {},
}: {
  text: string;
  style?: { [key: string]: any };
}) => (
  <View style={[styles.childContainer, style]}>
    <View style={styles.signatureLine} />
    <PdfText text={text} />
  </View>
);
