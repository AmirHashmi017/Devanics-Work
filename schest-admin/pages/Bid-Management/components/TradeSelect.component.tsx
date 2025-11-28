import { SelectComponent } from 'src/components/customSelect/Select.component';
import { useTrades } from 'src/hooks/useTrades';

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
};
export function TradeSelectComponent({ onChange, value }: Props) {
  const { tradeCategoryFilters, trades } = useTrades();

  const tradesOptions = tradeCategoryFilters.map((parent) => {
    return {
      label: <span>{parent.label}</span>,
      title: parent.label,
      options: trades
        .filter((trade) => trade.tradeCategoryId._id === parent.value)
        .map((child) => {
          return {
            label: <span>{child.name}</span>,
            value: child._id,
          };
        }),
    };
  });

  return (
    <SelectComponent
      label="Trades"
      name="bidTrades"
      placeholder="Select Trade"
      field={{
        options: tradesOptions,
        mode: 'tags',
        value,
        onChange,
      }}
    />
  );
}
