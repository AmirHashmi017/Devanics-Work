import { Button } from 'antd';
import { FormikProps, useFormik } from 'formik';
import React, { useState, useRef } from 'react';
import CSVReader from 'react-csv-reader';
import { EmailNotificationData } from 'src/services/email-notifiication.service';
import { getFirstColumnOfData, removeEmptyRow } from 'src/utils/csv.utils';
import * as Yup from 'yup';

const EmailValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address'), // Validates email format
});

type Props = {
  values: string[];
  title: string;
  onRemove: (index: number) => void;
  onAdd: (email: string) => void;
  onAddMultiple: (emails: string[]) => void;
};

const EmailInput = ({
  values,
  title,
  onAdd,
  onRemove,
  onAddMultiple,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emailFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: EmailValidationSchema,
    onSubmit(values) {
      onAdd(values.email);
      emailFormik.resetForm();
    },
  });

  const handleRemoveEmail = (index: number) => {
    onRemove(index);
  };

  return (
    <div className="flex items-center bg-white justify-between space-x-2 px-3 py-2 border border-gray-300 rounded-md focus-within:border-blue-500">
      {/* Label */}
      <div>
        <span className="text-schestiPrimary font-medium">{title}</span>
      </div>

      {/* Email Tags */}
      <div className="flex gap-2 flex-1 rounded p-2 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {values.map((email, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full border cursor-pointer border-gray-300"
            >
              <span className="text-sm">{email}</span>
              <button
                className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none cursor-pointer"
                onClick={() => handleRemoveEmail(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add email..."
          className="flex-grow focus:outline-none text-sm px-2 py-1"
          value={emailFormik.values.email}
          name="email"
          onChange={emailFormik.handleChange}
          onBlur={emailFormik.handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              emailFormik.handleSubmit();
            }
          }}
        />
      </div>

      {/* Upload CSV */}
      <Button
        type="link"
        onClick={() => {
          fileInputRef.current?.click();
        }}
        className="text-blue-500 hover:underline ml-auto cursor-pointer"
      >
        Upload CSV
      </Button>
      <CSVReader
        ref={fileInputRef}
        cssInputClass="hidden"
        onFileLoaded={(data: Array<Array<string>>) => {
          const first = getFirstColumnOfData(data);
          const removeEmpty = removeEmptyRow(first);
          const emails = removeEmpty.filter((email) =>
            /\S+@\S+\.\S+/.test(email)
          );

          onAddMultiple(emails);
        }}
      />
    </div>
  );
};

export default EmailInput;
