import TertiaryHeading from '@/app/component/headings/tertiary';

export function TotalEquity() {
  return (
    <div className="flex justify-end border p-3 rounded space-x-10">
      <TertiaryHeading
        title="Total Equity/Capital"
        className=" font-medium text-base"
      />
      <TertiaryHeading title="$45,873.12" className=" text-base" />
    </div>
  );
}
