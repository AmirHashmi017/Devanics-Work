import { StyleSheet, View } from '@react-pdf/renderer';
import { PdfHeading, PdfText } from './Heading';

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 48,
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

type Props = {
  scope: string;
};
export function PdfScopeOfWork({ scope }: Props) {
  return (
    <View style={styles.container}>
      <PdfHeading text="SCOPE OF WORK" style={styles.heading} />
      <PdfText text={scope} style={styles.text} />
    </View>
  );
}
