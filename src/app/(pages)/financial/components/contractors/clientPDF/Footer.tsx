import { View } from '@react-pdf/renderer';

export const PDF_NAVBAR_BG = 'bg-[#6f42c1]';
export const BG_COLOR = '#6f42c1';

export function PdfFooter({ brandingColor }: { brandingColor: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 12,
        backgroundColor: brandingColor ? brandingColor : BG_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      fixed
    ></View>
  );
}
