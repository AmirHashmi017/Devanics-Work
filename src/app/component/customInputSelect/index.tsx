import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, Button } from 'antd';
import type { InputRef } from 'antd';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { Field, useField } from 'formik';
import type { FormikValues } from 'formik';

const CustomInputSelect: React.FC = (props: any) => {
  const {
    name,
    label,
    labelStyle,
    options,
    placeholder,
    selectStyle,
    className,
    disabled,
    setCustomState = () => {},
    onItemAdd = () => {},
    onItemAddloading = false,
  } = props;

  const [items, setItems] =
    useState<{ label: string; value: string }[]>(options);
  const [newOption, setNewOption] = useState('');
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    setItems(options);
  }, [options]);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewOption(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setItems([{ label: newOption, value: newOption }, ...items]);
    setNewOption('');
    onItemAdd(newOption);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (`${option?.label}` || '').toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className={twMerge(
            clsx(
              'text-graphiteGray text-sm font-medium leading-6 capitalize mb-1',
              labelStyle
            )
          )}
        >
          {label}
        </label>
      )}
      <div className={twMerge(clsx('mt-1', className))}>
        <Field name={name} id={name} component="select">
          {({ form: { setFieldValue } }: FormikValues) => {
            return (
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={filterOption}
                placeholder={placeholder}
                className={twMerge(
                  clsx(
                    'w-full h-10',
                    hasError ? ' customSelectError' : 'customSelect',
                    disabled ? 'disabled' : '',
                    selectStyle && selectStyle
                  )
                )}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <Input
                        placeholder="Enter item"
                        ref={inputRef}
                        value={newOption}
                        onChange={(e) => {
                          onNameChange(e), setFieldValue(name, e.target.value);
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={addItem}
                        disabled={newOption === ''}
                        loading={onItemAddloading}
                      >
                        Add New
                      </Button>
                    </Space>
                  </>
                )}
                id={name}
                value={field.value}
                onChange={(val) => {
                  setCustomState(val);
                  setFieldValue(name, val);
                }}
                options={items.map(
                  (item: { label: string; value: string }) => ({
                    label: item.label,
                    value: item.value,
                  })
                )}
              />
            );
          }}
        </Field>
      </div>
    </div>
  );
};

export default CustomInputSelect;
