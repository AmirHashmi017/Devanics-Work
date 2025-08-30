import { useTrades } from '@/app/hooks/useTrades';
import { SelectComponent } from './Select.component';

type Props = {
  mode: 'multiple' | 'tags' | undefined;
  value?: string[] | string;
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
  hasError?: boolean;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  name?: string;
};
export function SelectTrades({
  mode,
  value,
  errorMessage = '',
  hasError = false,
  label = 'Select Trades',
  onBlur,
  onChange,
  placeholder = 'Select Trade',
  name = 'trades',
}: Props) {
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
      label={label}
      name={name}
      placeholder={placeholder}
      field={{
        options: tradesOptions,
        mode: mode,
        value: value,
        onChange,
        onBlur,
      }}
      hasError={hasError}
      errorMessage={errorMessage}
    />
  );
}
