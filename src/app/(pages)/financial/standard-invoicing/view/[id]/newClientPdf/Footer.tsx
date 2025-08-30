import { Image, View } from '@react-pdf/renderer';

export const PDF_NAVBAR_BG = 'bg-[#6f42c1]';
export const BG_COLOR = '#007AB6';

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
