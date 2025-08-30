import TertiaryHeading from '@/app/component/headings/tertiary';

export function TotalLiabilities() {
  return (
    <div className="flex justify-end border p-3 rounded space-x-10">
      <TertiaryHeading
        title="Total Liabilities"
        className=" font-medium text-base"
      />
      <TertiaryHeading title="$45,873.12" className=" text-base" />
    </div>
  );
}
