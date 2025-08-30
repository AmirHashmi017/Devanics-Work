import Icon from '@ant-design/icons';
import type { GetProps } from 'antd';

type IconComponentProps = GetProps<typeof Icon>;

const NetworkingSvg = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#474747"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.0001 7.16C17.9401 7.15 17.8701 7.15 17.8101 7.16C16.4301 7.11 15.3301 5.98 15.3301 4.58C15.3301 3.15 16.4801 2 17.9101 2C19.3401 2 20.4901 3.16 20.4901 4.58C20.4801 5.98 19.3801 7.11 18.0001 7.16Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16.9699 14.4402C18.3399 14.6702 19.8499 14.4302 20.9099 13.7202C22.3199 12.7802 22.3199 11.2402 20.9099 10.3002C19.8399 9.59016 18.3099 9.35016 16.9399 9.59016"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.99994 14.4402C5.62994 14.6702 4.11994 14.4302 3.05994 13.7202C1.64994 12.7802 1.64994 11.2402 3.05994 10.3002C4.12994 9.59016 5.65994 9.35016 7.02994 9.59016"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.0001 14.6307C11.9401 14.6207 11.8701 14.6207 11.8101 14.6307C10.4301 14.5807 9.33008 13.4507 9.33008 12.0507C9.33008 10.6207 10.4801 9.4707 11.9101 9.4707C13.3401 9.4707 14.4901 10.6307 14.4901 12.0507C14.4801 13.4507 13.3801 14.5907 12.0001 14.6307Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.09021 17.7813C7.68021 18.7213 7.68021 20.2613 9.09021 21.2013C10.6902 22.2713 13.3102 22.2713 14.9102 21.2013C16.3202 20.2613 16.3202 18.7213 14.9102 17.7813C13.3202 16.7213 10.6902 16.7213 9.09021 17.7813Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const NetworkingIcon = (props: IconComponentProps) => {
  return <Icon component={NetworkingSvg} {...props} />;
};
