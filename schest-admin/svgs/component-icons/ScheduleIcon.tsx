import Icon from '@ant-design/icons';
import type { GetProps } from 'antd';

type IconComponentProps = GetProps<typeof Icon>;

const ScheduleSvg = () => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="currentColor">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M16 10.25C19.174 10.25 21.75 12.826 21.75 16C21.75 19.174 19.174 21.75 16 21.75C12.826 21.75 10.25 19.174 10.25 16C10.25 12.826 12.826 10.25 16 10.25ZM15.25 13.5V16C15.25 16.414 15.586 16.75 16 16.75H18.5C18.914 16.75 19.25 16.414 19.25 16C19.25 15.586 18.914 15.25 18.5 15.25H16.75V13.5C16.75 13.086 16.414 12.75 16 12.75C15.586 12.75 15.25 13.086 15.25 13.5Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.25 1.5V1C5.25 0.586 5.586 0.25 6 0.25C6.414 0.25 6.75 0.586 6.75 1V1.5H5.25Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.25 1.5V1C15.25 0.586 15.586 0.25 16 0.25C16.414 0.25 16.75 0.586 16.75 1V1.5H15.25Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.467 21H3C2.271 21 1.571 20.71 1.055 20.195C0.54 19.679 0.25 18.979 0.25 18.25V7.5H21.75V12.465C20.561 10.536 18.43 9.25 16 9.25C12.275 9.25 9.25 12.275 9.25 16C9.25 17.981 10.106 19.765 11.467 21ZM0.25 6V4.25C0.25 3.521 0.54 2.821 1.055 2.305C1.571 1.79 2.271 1.5 3 1.5H5.25V3.5C5.25 3.914 5.586 4.25 6 4.25C6.414 4.25 6.75 3.914 6.75 3.5V1.5H15.25V3.5C15.25 3.914 15.586 4.25 16 4.25C16.414 4.25 16.75 3.914 16.75 3.5V1.5H19C19.729 1.5 20.429 1.79 20.945 2.305C21.46 2.821 21.75 3.521 21.75 4.25V6H0.25Z"
    />
  </svg>
);

export const ScheduleIcon = (props: IconComponentProps) => {
  return <Icon component={ScheduleSvg} {...props} />;
};
