import { View } from '@react-pdf/renderer';
import { PdfHeading, PdfText } from './Heading';

type Props = {
  scope: string;
};
export function PdfScopeOfWork({ scope }: Props) {
  return (
    <View
      style={{
        marginTop: 16,
        marginBottom: 48,
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <PdfHeading
        text="SCOPE OF WORK"
        style={{
          textAlign: 'center',
        }}
      />
      <PdfText
        text={scope}
        style={{
          textAlign: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
    </View>
  );
}
