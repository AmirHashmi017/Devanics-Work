import Icon from '@ant-design/icons';
import type { GetProps } from 'antd';

type IconComponentProps = GetProps<typeof Icon>;

const DailyWorkSVG = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="transparent"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.1098 11.1504H7.45981C6.82981 11.1504 6.31982 11.6603 6.31982 12.2903V17.4103H10.1098V11.1504V11.1504Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.7611 6.59961H11.2411C10.6111 6.59961 10.1011 7.10962 10.1011 7.73962V17.3997H13.8911V7.73962C13.8911 7.10962 13.3911 6.59961 12.7611 6.59961Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5479 12.8496H13.8979V17.3997H17.688V13.9896C17.678 13.3596 17.1679 12.8496 16.5479 12.8496Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DailyWorkIcon = (props: IconComponentProps) => {
  return <Icon component={DailyWorkSVG} {...props} />;
};
