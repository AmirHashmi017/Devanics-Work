import { Field, useField } from 'formik';
import { Input } from 'antd';
import { twMerge } from 'tailwind-merge';
import './style.css';
import clsx from 'clsx';
const SimpleInput = (props: any) => {
  const {
    label,
    prefix,
    value,
    maxLength,
    inputStyle = '',
    labelStyle,
    placeholder,
    name,
    disabled,
    ...rest
  } = props;

  const [, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  return (
    <div>
      {label && (
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
      )}

      <Field name={name} id={name}>
        {({ form: { setFieldValue } }: { _: any; form: any }) => {
          return (
            <Input
              id={name}
              prefix={prefix}
              disabled={disabled}
              onChange={(e) => setFieldValue(name, +e.target.value)}
              className={twMerge(
                clsx(
                  `border ${hasError ? 'border-red-500' : 'border-gray-200'} ${
                    disabled ? 'disable_custom_class !text-black' : ''
                  } !w-full !rounded-lg focus:border-blue-500 !px-3.5 !py-2.5 !mt-1.5 ${
                    inputStyle && inputStyle
                  }`
                )
              )}
              maxLength={maxLength}
              {...rest}
              placeholder={placeholder}
              value={value}
            />
          );
        }}
      </Field>
      {/* <ErrorMessage name={name} component={ErrorMsg} /> */}
    </div>
  );
};

export default SimpleInput;
