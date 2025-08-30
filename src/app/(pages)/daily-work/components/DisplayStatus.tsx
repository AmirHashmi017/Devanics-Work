import { IDailyWorkStatus } from '@/app/interfaces/crm/crm-daily-work.interface';
import { hexToRgba } from '@/app/utils/colors.utils';

type Props = {
  item: IDailyWorkStatus;
} & React.ComponentProps<'div'>;
export function DisplayDailyWorkStatus({ item, ...props }: Props) {
  return (
    <div
      style={{
        backgroundColor: hexToRgba(item.color, 0.1),
        color: item.color,
      }}
      className="text-sm flex items-center space-x-2 cursor-pointer leading-5 rounded-md px-3 py-2"
      {...props}
    >
      <span
        style={{
          backgroundColor: item.color,
        }}
        className="py-3 px-0.5 rounded-full"
      ></span>
      <span>{item.name}</span>
    </div>
  );
}
