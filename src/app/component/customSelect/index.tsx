import React from 'react';
import { ErrorMessage, Field, useField } from 'formik';
import type { FormikValues } from 'formik';
import { Select } from 'antd';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Errormsg from '../errorMessage';

// const defaultOptions = [
//   { value: 'option 1', label: 'Option 1' },
//   { value: 'option 2', label: 'Option 2' },
//   { value: 'option 3', label: 'Option 3' },
// ];

const SelectComp = (props: any) => {
  const {
    name,
    label,
    labelStyle,
    options = [],
    selectStyle,
    className,
    labelButton,
    labelAction,
    placeholder,
    isLoading,
    handleChange,
  } = props;

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

  const filterOption = (
    input: string,
    option?: { label: string; value: string; children: string }
  ) =>
    (`${option?.children}` || '').toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      <div className="flex space-x-5 justify-between items-center mb-1">
        {label && (
          <label
            htmlFor={name}
            className={twMerge(
              clsx(
                'text-graphiteGray text-sm font-medium leading-6 capitalize ',
                labelStyle
              )
            )}
          >
            {label}
          </label>
        )}
        {labelButton ? labelAction() : null}
      </div>

      <div className={twMerge(clsx('mt-1', className))}>
        <Field name={name} id={name} component="select">
          {({ form: { setFieldValue } }: FormikValues) => {
            return (
              <Select
                className={twMerge(
                  clsx(
                    'w-full h-10',
                    hasError ? ' customSelectError' : 'customSelect',
                    selectStyle && selectStyle
                  )
                )}
                id={name}
                value={field.value ? field.value : undefined}
                showSearch
                optionFilterProp="children"
                filterOption={filterOption}
                loading={isLoading}
                placeholder={placeholder}
                onChange={(val) => {
                  setFieldValue(name, val);
                  if (handleChange) {
                    handleChange(val);
                  }
                }}
              >
                {OptionsArr}
              </Select>
            );
          }}
        </Field>
        <ErrorMessage name={name} component={Errormsg} />
      </div>
    </div>
  );
};

export default SelectComp;
