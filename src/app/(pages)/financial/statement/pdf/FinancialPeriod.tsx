import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  title: {
    marginRight: 5,
    fontWeight: 'bold',
    fontSize: 14,
  },
  period: {
    fontSize: 10,
    color: '#404B5A',
  },
});

export function FinancialPeriod({ period }: { period: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Statement</Text>
      <Text style={styles.period}>{period}</Text>
    </View>
  );
}
