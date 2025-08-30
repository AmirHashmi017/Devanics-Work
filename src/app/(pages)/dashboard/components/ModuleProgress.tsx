import SenaryHeading from '@/app/component/headings/senaryHeading';
import { Progress } from 'antd';

type ModuleProgressProps = {
  color: string;
  progress: number;
  title: string;
  value: number;
};

export function ModuleProgress({
  color,
  progress,
  title,
  value,
}: ModuleProgressProps) {
  return (
    <div className="grid grid-cols-5 gap-8">
      <div className="xl:col-span-3 col-span-2">
        <Progress
          strokeColor={color}
          size={[-1, 15]}
          percent={+progress.toFixed(0)}
          rootClassName="!text-white"
        />
      </div>
      <div className="flex space-x-2 col-span-2 xl:col-span-1">
        <span
          style={{
            backgroundColor: color,
          }}
          className="px-3 flex items-center py-2 rounded-md text-2xl"
        ></span>

        <SenaryHeading
          title={title}
          className="text-schestiPrimaryBlack font-normal text-sm"
        />
      </div>

      <SenaryHeading
        title={value.toString()}
        className="text-base font-semibold"
      />
    </div>
  );
}
