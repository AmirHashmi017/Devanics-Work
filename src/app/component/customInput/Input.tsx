import { Input, type InputRef, type InputProps } from 'antd';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type Props = {
  label: string;
  labelStyle?: ClassValue;
  label2?: string | React.ReactNode;
  label2Style?: ClassValue;
  name: string;
  prefix?: React.ReactNode;
  placeholder?: string;
  maxLength?: number;
  inputStyle?: ClassValue;
  hasError?: boolean;
  field?: InputProps & React.RefAttributes<InputRef>;
  type: string;
  suffix?: any;
  errorMessage?: string;
  step?: string;
};

export function InputComponent({
  label,
  label2,
  label2Style,
  labelStyle,
  name,
  type,
  prefix,
  placeholder,
  maxLength,
  inputStyle,
  field,
  hasError,
  errorMessage = '',
  ...rest
}: Props) {
  return (
    <div>
      <label
        className={twMerge(
          clsx(
            `text-graphiteGray ${
              label2 ? 'flex justify-between' : 'block'
            } text-sm font-medium leading-6 capitalize`,
            labelStyle
          )
        )}
        htmlFor={name}
      >
        {label}{' '}
        {typeof label2 === 'string' ? (
          <span
            className={twMerge(clsx('text-right text-[#98A2B3]', label2Style))}
          >
            {label2}
          </span>
        ) : (
          label2
        )}
      </label>

      {/* <Field name={name} id={name}>
      {({ field }: { field: any }) => ( */}
      <Input
        id={name}
        type={type}
        prefix={prefix}
        min="0"
        className={twMerge(
          clsx(
            `border ${
              hasError ? 'border-red-500' : 'border-gray-200'
            } !w-full !rounded-lg focus:border-blue-500 !px-3.5 !py-2.5 !mt-1.5 ${
              inputStyle && inputStyle
            }`
          )
        )}
        maxLength={maxLength}
        {...rest}
        placeholder={placeholder}
        status={hasError ? 'error' : undefined}
        {...field}
      />
      {errorMessage ? (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      ) : null}
      {/* //   )} */}
      {/* // </Field> */}
      {/* <ErrorMessage name={name} component={ErrorMsg} /> */}
    </div>
  );
}
