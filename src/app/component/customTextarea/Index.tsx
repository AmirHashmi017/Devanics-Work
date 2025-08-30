import React from 'react';
import { Input } from 'antd';
import { ErrorMessage, useField } from 'formik';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import Errormsg from '../errorMessage';
// import Errormsg from '../errorMessage';

const Textarea = ({
  placeholder,
  label,
  defaultValue,
  inputStyle,
  ...props
}: any) => {
  const { TextArea } = Input;

  const [field, meta] = useField(props.name);
  const hasError = meta.touched && meta.error;
  return (
    <div>
      <label className="text-sm" htmlFor={props.id || props.name}>
        {label}
      </label>
      <TextArea
        defaultValue={defaultValue}
        className={twMerge(
          clsx(
            `border ${
              hasError ? 'border-red-500' : 'border-gray-400'
            } !w-full !rounded-lg focus:border-blue-500 !px-3.5 !py-2.5 mt-2 w-full  ${
              inputStyle && inputStyle
            }`
          )
        )}
        rows={5}
        placeholder={placeholder}
        {...field}
        {...props}
      />
      <ErrorMessage name={props.name} component={Errormsg} />
    </div>
  );
};

export default Textarea;
