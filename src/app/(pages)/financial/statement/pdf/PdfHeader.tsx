/* eslint-disable jsx-a11y/alt-text */
import {
  Image,
  // StyleSheet, Text,
  View,
} from '@react-pdf/renderer';

const HEADER_BG = '#E6F2F8';
type Props = {
  logo?: string;
  brandingColor?: string;
  companyName: string;
};

// const styles = StyleSheet.create({
//   companyName: {
//     textAlign: 'center',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

export function PdfHeader({ brandingColor, logo }: Props) {
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: brandingColor ? brandingColor : HEADER_BG,
        height: '50px',
        paddingLeft: 30,
      }}
      fixed
    >
      <Image
        src={logo}
        style={{
          width: 200,
          height: 60,
          paddingVertical: 5,
          objectFit: 'center',
        }}
        source={logo}
      />
    </View>
  );
}
