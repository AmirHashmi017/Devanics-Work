import { StyleSheet, View } from '@react-pdf/renderer';

export const PDF_NAVBAR_BG = 'bg-[#007AB6]';
export const BG_COLOR = '#007AB6';

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: BG_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function PdfFooter() {
  return <View style={styles.footer} fixed></View>;
}
