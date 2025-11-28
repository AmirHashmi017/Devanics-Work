import React from 'react';
import { Field, useField } from 'formik';
import type { FormikValues } from 'formik';
import { DatePicker, Select } from 'antd';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

const defaultOptions = [
  { value: 'option 1', label: 'Option 1' },
  { value: 'option 2', label: 'Option 2' },
  { value: 'option 3', label: 'Option 3' },
];

const CustomDate = (props: any) => {
  const { name, label, labelStyle, options = defaultOptions, ...rest } = props;

  const OptionsArr = options?.map(
    (option: { value: string; label: string }) => {
      return (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      );
    }
  );

  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className={twMerge(
            clsx(
              `${labelStyle} text-graphiteGray text-sm font-medium leading-6 capitalize mb-1`
            )
          )}
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        <Field id={name} {...field}>
          {({ form: { setFieldValue }, field: { value } }: FormikValues) => {
            return (
              <DatePicker
                className={`w-full h-10 ${
                  hasError ? ' customSelectError' : 'customSelect'
                }`}
                onChange={(_, value) => setFieldValue(name, value)}
                value={field.value ? dayjs(field.value) : undefined}
                {...rest}
              />
            );
          }}
        </Field>
      </div>
      {/* <ErrorMessage name={name} component={ErrorMsg} /> */}
    </div>
  );
};

export default CustomDate;
