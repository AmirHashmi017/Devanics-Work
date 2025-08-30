import { Segmented } from 'antd';
import { AIATabsType } from '../../types';

type Props = {
  tab: AIATabsType;
  setTab: React.Dispatch<React.SetStateAction<AIATabsType>>;
};

export function AIATabs({ setTab, tab }: Props) {
  return (
    <Segmented
      value={tab}
      options={[
        { label: 'Current Invoices', value: 'current' },
        { label: 'History', value: 'history' },
      ]}
      size="large"
      onChange={(value) => setTab(value as AIATabsType)}
    />
  );
}
