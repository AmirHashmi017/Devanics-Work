import React from 'react';
import { ErrorMessage, useField } from 'formik';
import clsx from 'clsx';
import { Input } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { twMerge } from 'tailwind-merge';
import Errormsg from '../errorMessage';
// import { InputStyleContainer } from "./Style";

const PasswordField = (props: any) => {
  const { placeholder, name, label, ...rest } = props;

  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div>
      <label
        className={
          'text-graphiteGray text-sm font-medium leading-6 capitalize mb-1 inline-block'
        }
        htmlFor={name}
      >
        {label}
      </label>
      {/* <Field name={name} id={name}>
        {({ field }: { field: any }) => ( */}
      <Input.Password
        className={twMerge(
          clsx(
            `border ${
              hasError ? 'border-red-500' : 'border-gray-200'
            } !w-full !rounded-lg focus:border-blue-500 !px-3.5 !py-2.5 `
          )
        )}
        {...rest}
        placeholder={placeholder}
        {...field}
        iconRender={(visible) =>
          visible ? (
            <span className="paswordIconLabel">
              <EyeInvisibleOutlined className="text-base" />
            </span>
          ) : (
            <span className="paswordIconLabel">
              <EyeOutlined className="text-base" />
            </span>
          )
        }
      />
      {/* )}
      </Field> */}
      <ErrorMessage name={name} component={Errormsg} />
    </div>
  );
};

export default PasswordField;
