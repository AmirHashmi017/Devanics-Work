import { useField } from 'formik';
import { Input } from 'antd';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
const InputField = (props: any) => {
  const {
    label,
    prefix,
    maxLength,
    inputStyle = '!mt-1.5',
    labelStyle,
    placeholder,
    name,
    ...rest
  } = props;
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  return (
    <div>
      <label
        className={twMerge(
          clsx(
            `${labelStyle} text-graphiteGray text-sm font-medium leading-6 capitalize`
          )
        )}
        htmlFor={name}
      >
        {label}
      </label>

      {/* <Field name={name} id={name}>
        {({ field }: { field: any }) => ( */}
      <Input
        id={name}
        prefix={prefix}
        className={twMerge(
          clsx(
            `border ${
              hasError ? 'border-red-500' : 'border-gray-400'
            } !w-full !rounded-lg focus:border-blue-500 !px-3.5 !py-2.5 ${
              inputStyle && inputStyle
            }`
          )
        )}
        maxLength={maxLength}
        {...rest}
        placeholder={placeholder}
        {...field}
      />
      {/* //   )} */}
      {/* // </Field> */}
      {/* <ErrorMessage name={name} component={ErrorMsg} /> */}
    </div>
  );
};

export default InputField;
