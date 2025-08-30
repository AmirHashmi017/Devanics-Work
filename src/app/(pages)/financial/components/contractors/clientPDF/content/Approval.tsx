import { View } from '@react-pdf/renderer';
import { PdfHeading, PdfText } from './Heading';

export function PdfApproval() {
  return (
    <View>
      <Signature title="Client Approval" />
      <Signature title="Company (company name should be automatic) Approval" />
    </View>
  );
}

const Signature = ({ title }: { title: string }) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'column',
      marginTop: 60,
      paddingLeft: 20,
    }}
  >
    <PdfHeading text={title} />
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
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
  <View
    style={[
      {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
      },
      style,
    ]}
  >
    <View
      style={{
        width: 120, // Adjust the width as needed
        borderBottom: '1 dotted black',
        marginBottom: 5,
      }}
    />
    <PdfText text={text} />
  </View>
);
