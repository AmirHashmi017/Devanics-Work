// import { IconType } from 'react-icons/lib';
import type { SelectProps } from 'antd';
import { SummaryCard } from '../construction/SummaryCard';

type Props = {
  Icon: any;
  color: string;
  title: string;

  value: number;

  analytics?: {
    type: 'profit' | 'loss';
    value: number;
  };
  description?: string;
  selectProps?: SelectProps;
  loading?: boolean;
};

export function SocialAnalyticsCard({
  Icon,
  analytics,
  color,
  title,
  value,
  description = title,
  selectProps,
  loading = false,
}: Props) {
  return (
    <SummaryCard
      Icon={Icon}
      analytics={analytics}
      color={color}
      title={title}
      value={value}
      description={description}
      loading={loading}
      selectProps={{ ...selectProps }}
    />
  );
}
