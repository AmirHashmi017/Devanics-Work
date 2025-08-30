import { IDailyWorkPriorty } from '@/app/interfaces/crm/crm-daily-work.interface';

type Props = {
  item: IDailyWorkPriorty;
} & React.ComponentProps<'div'>;
export function DisplayPriority({ item, ...props }: Props) {
  return (
    <div
      style={{
        border: `1px solid ${item.color}`,
        color: item.color,
      }}
      className="text-sm flex items-center space-x-2 leading-5 rounded-full cursor-pointer px-4 py-1"
      {...props}
    >
      <span
        className="p-1 rounded-full"
        style={{
          backgroundColor: item.color,
        }}
      ></span>{' '}
      <span>{item.name}</span>
    </div>
  );
}
