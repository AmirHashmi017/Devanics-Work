import SenaryHeading from '@/app/component/headings/senaryHeading';

type Props = {
  color: string;
  title: string;
};
export function ColorCard({ color, title }: Props) {
  return (
    <div className="p-2 bg-white rounded-md border border-gray-300  flex items-center space-x-2">
      <span className="p-3 rounded" style={{ backgroundColor: color }}>
        {' '}
      </span>
      <SenaryHeading
        title={title}
        className="text-schestiLightBlack text-sm font-semibold"
      />
    </div>
  );
}
