'use client';
import React from 'react';
import Input from '../customInput';
import PasswordField from '../passwordInput';
import Select from '../customSelect/index';
import Textarea from '../customTextarea/Index';
import SimpleInput from '../customInput/simple';
import CustomInputSelect from '../customInputSelect';

const FormikController = (props: any) => {
  const { control, ...rest } = props;
  switch (control) {
    case 'input':
      return <Input {...rest} />;
    case 'simpleInput':
      return <SimpleInput {...rest} />;
    case 'select':
      return <Select {...rest} />;
    case 'inputselect':
      return <CustomInputSelect {...rest} />;
    // case "checkbox":
    //   return <Checkbox {...rest} />;
    case 'password':
      return <PasswordField {...rest} />;
    case 'textarea':
      return <Textarea {...rest} />;

    // case "radio":
    //   return <Radio {...rest} />;
    // case "date":
    //   return <Datepicker {...rest} />;
    default:
      return null;
  }
};

export default FormikController;
