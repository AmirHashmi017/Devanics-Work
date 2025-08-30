import { StyleSheet, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  heading: {
    fontSize: 12,
    marginBottom: 4,
    lineHeight: '1.25rem',
    fontWeight: 600,
    color: '#344054',
  },
  text: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: '1.25rem',
    color: '#475467',
  },
});

type Props = {
  text: string;
  style?: { [key: string]: any } | { [key: string]: any }[];
};
export const PdfHeading: React.FC<Props> = ({ text, style = {} }) => {
  let s = convertToArr(style);
  return <Text style={[styles.heading, ...s]}>{text}</Text>;
};

export const PdfText: React.FC<Props> = ({ text, style = {} }) => {
  return <Text style={[styles.text, ...convertToArr(style)]}>{text}</Text>;
};
function convertToArr(s: Props['style']) {
  return Array.isArray(s) ? s : [s];
}
