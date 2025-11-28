import { Select, type SelectProps } from 'antd';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type Props = {
  label: string;
  labelStyle?: ClassValue;
  name: string;
  placeholder?: string;
  hasError?: boolean;
  field?: SelectProps;
  errorMessage?: string;
};

export function SelectComponent({
  label,
  labelStyle,
  name,
  placeholder,
  field,
  errorMessage = '',
  hasError,
}: Props) {
  return (
    <div>
      <label
        className={twMerge(
          clsx(
            'text-graphiteGray text-sm font-medium leading-6 capitalize',
            labelStyle
          )
        )}
        htmlFor={name}
      >
        {label}
      </label>

      {/* <Field name={name} id={name}>
      {({ field }: { field: any }) => ( */}
      <Select
        id={name}
        style={{ border: 0 }}
        size="large"
        placeholder={placeholder}
        {...field}
        className={twMerge(
          clsx(
            ` p-0 h-full border ${
              hasError ? 'border-red-500' : 'border-gray-400'
            } !w-full !rounded-lg focus:border-blue-500 !mt-1.5 ${field?.className}`
          )
        )}
        status={hasError ? 'error' : undefined}
      />
      {errorMessage ? (
        <p className="text-red-500 text-xs">{errorMessage}</p>
      ) : null}
    </div>
  );
}
