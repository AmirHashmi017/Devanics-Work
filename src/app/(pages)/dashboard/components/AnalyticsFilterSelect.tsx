import { Select, type SelectProps } from 'antd';

type Props = SelectProps;
export function CommonAnalyticsFilterSelect(props: Props) {
  return (
    <Select
      placeholder="Select period"
      options={[
        { label: 'Last Week', value: 'lastWeek' },
        { label: 'Last Month', value: 'lastMonth' },
        { label: 'Last Year', value: 'lastYear' },
      ]}
      value={undefined}
      {...props}
    />
  );
}

export function YearlyAnalyticsFilterSelect(props: Props) {
  return (
    <Select
      placeholder="Select year"
      options={[
        { label: 'Current Year', value: 'currentYear' },
        { label: 'Last Year', value: 'lastYear' },
      ]}
      value={undefined}
      {...props}
    />
  );
}
