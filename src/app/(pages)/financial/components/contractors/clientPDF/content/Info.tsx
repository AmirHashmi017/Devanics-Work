import { View } from '@react-pdf/renderer';
import { PdfHeading, PdfText } from './Heading';

export function InfoContainer({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View
      style={[
        { margin: '0.75rem' },
        {
          width: '30%', // Adjust the width based on your layout
          marginBottom: 16,
        },
      ]}
    >
      <PdfHeading text={title} />
      <PdfText text={description} />
    </View>
  );
}
