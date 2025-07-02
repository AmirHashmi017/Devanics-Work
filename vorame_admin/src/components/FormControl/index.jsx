import DatePicker from "./DatePicker";
import Input from "./Input";
import Textarea from "./Textarea";
import Select from "./Select";
import Time from "./Time";

const FormControl = (props) => {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "textarea":
      return <Textarea {...rest} />;
    case 'select':
      return <Select {...rest} />;
    case "date":
      return <DatePicker {...rest} />;
    case "time":
      return <Time {...rest} />;
    // case 'simpleInput':
    //   return <SimpleInput {...rest} />;
    // case 'multiSelect':
    //   return <CustomMultiSelect {...rest} />;
    // case 'tags':
    //   return <CustomTagsInput {...rest} />;
    // case "checkbox":
    //   return <Checkbox {...rest} />;
    // // case "radio":
    // //   return <Radio {...rest} />;
    // case 'password':
    //   return <PasswordField {...rest} />;
    // case "time":
    //   return <CustomTimePicker {...rest} />;
    // case "range":
    //   return <CustomRangeInput {...rest} />;
    default:
      return null;
  }
};

export default FormControl;
