import { Image, View } from '@react-pdf/renderer';

export const PDF_NAVBAR_BG = 'bg-[#6f42c1]';
export const BG_COLOR = '#6f42c1';

const PoweredByImage =
  'data:image/png;base64,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';

type Props = {
  brandingColor?: string;
};

export function PdfFooter({ brandingColor }: Props) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 12,
          justifyContent: 'center',
          alignItems: 'center',
        },
        { backgroundColor: brandingColor ? brandingColor : BG_COLOR },
      ]}
      fixed
    >
      <Image
        src={PoweredByImage}
        style={[
          {
            height: 20,
            width: 130,
            position: 'absolute',
            right: 32,
            bottom: 24,
          },
        ]}
      />
    </View>
  );
}
