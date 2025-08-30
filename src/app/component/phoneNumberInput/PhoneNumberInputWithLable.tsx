import clsx from 'clsx';
import PhoneInput, {
  type Props as PhoneInputProps,
} from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { twMerge } from 'tailwind-merge';

type Props = {
  label: string;
  hasError?: boolean;
  labelStyle?: string;
  errorMessage?: string;
  name?: string;
  placeholder?: string;
};
export function PhoneNumberInputWithLable({
  errorMessage = '',
  labelStyle = '',
  ...props
}: PhoneInputProps<Props>) {
  return (
    <div>
      <label
        className={twMerge(
          clsx(
            `text-graphiteGray text-sm font-medium leading-6 capitalize`,
            labelStyle && labelStyle
          )
        )}
      >
        {props.label}
      </label>
      <PhoneInput
        className={`custom-phone-input ant-input css-dev-only-do-not-override-2rgkd4 border border-gray-300 hover:border-blue-500 !w-full !rounded-lg focus:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 !px-3.5 !py-2.5 !mt-1.5 css-dev-only-do-not-override-2rgkd4
            space-x-2 ${props.hasError ? 'border-red-500' : ''}`}
        international
        defaultCountry="US"
        countryCallingCodeEditable={false}
        {...props}
      />
      {errorMessage ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}
