import React from 'react';
import Input from '../CustomInput';
import PasswordField from '../PasswordInput';
import Select from '../customSelect/index';
import Textarea from '../customTextarea/Index';
import DatePicker from '../CustomDatePicker';
// import Datepicker from './CustomDatePiPickercker/Index';
// import Textarea from './CustomTextArea/Index';
// import Checkbox from "./Checkbox";
// import PasswordInput from './passwordInput/index';
const FormikController = (props: any) => {
  const { control, ...rest } = props;
  switch (control) {
    case 'input':
      return <Input {...rest} />;
    case 'select':
      return <Select {...rest} />;
    // case "checkbox":
    //   return <Checkbox {...rest} />;
    case 'password':
      return <PasswordField {...rest} />;
    case 'textarea':
      return <Textarea {...rest} />;

    // case "radio":
    //   return <Radio {...rest} />;
    case 'date':
      return <DatePicker {...rest} />;
    default:
      return null;
  }
};

export default FormikController;
