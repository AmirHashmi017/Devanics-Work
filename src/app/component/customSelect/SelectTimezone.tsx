import { Timezone } from '@/app/utils/timezone.utils';
import { SelectComponent } from './Select.component';
import { type SelectProps } from 'antd';

type Props = {
  hasError?: boolean;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  name?: string;
} & SelectProps;
export function SelectTimezone({
  errorMessage,
  hasError,
  label = 'Select Timezone',
  name = 'timezone',
  placeholder,
  ...remainingProps
}: Props) {
  return (
    <SelectComponent
      label={label}
      name={name}
      errorMessage={errorMessage}
      hasError={hasError}
      placeholder={placeholder}
      field={{
        options: Timezone.timezones,
        // .map((tz) => ({ ...tz, label: tz.altName, }))
        className: 'my-2',
        ...remainingProps,
      }}
    />
  );
}
