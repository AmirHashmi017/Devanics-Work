import { StyleSheet, View } from '@react-pdf/renderer';

export const BG_COLOR = '#007AB6';
type Props = {
  brandingColor?: string;
};

const styles = StyleSheet.create({
  header: {
    height: 44,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});

export function Header({ brandingColor }: Props) {
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: brandingColor ? brandingColor : BG_COLOR,
        },
      ]}
    ></View>
  );
}
