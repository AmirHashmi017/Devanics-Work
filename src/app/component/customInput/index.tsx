import { ErrorMessage, useField } from 'formik';
// import ErrorMsg from '../errorMessage';
import { Input } from 'antd';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import Errormsg from '../errorMessage';
const InputField = (props: any) => {
  const {
    label,
    prefix,
    maxLength,
    inputStyle = '',
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
      <Input
        id={name}
        prefix={prefix}
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
      {/* //   )} */}
      {/* // </Field> */}
      <ErrorMessage name={name} component={Errormsg} />
    </div>
  );
};

export default InputField;
