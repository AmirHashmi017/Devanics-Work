import { type TextAreaProps } from 'antd/es/input/TextArea';
import { Input } from 'antd';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const { TextArea } = Input;
type Props = {
  label: string;
  labelStyle?: ClassValue;
  label2?: string;
  label2Style?: ClassValue;
  name: string;
  placeholder?: string;
  maxLength?: number;
  inputStyle?: ClassValue;
  hasError?: boolean;
  field?: TextAreaProps;
  errorMessage?: string;
};

export function TextAreaComponent({
  label,
  label2,
  label2Style,
  labelStyle,
  name,
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
        {label2 && (
          <span
            className={twMerge(clsx('text-right text-[#98A2B3]', label2Style))}
          >
            {label2}
          </span>
        )}
      </label>

      {/* <Field name={name} id={name}>
      {({ field }: { field: any }) => ( */}
      <TextArea
        id={name}
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
