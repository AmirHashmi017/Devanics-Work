import TertiaryHeading from '@/app/component/headings/tertiary';

export function TotalIndirectExpense() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end border p-3 rounded space-x-10">
        <TertiaryHeading
          title="Total Indirect Expense"
          className=" font-medium text-base"
        />
        <TertiaryHeading title="$45,873.12" className=" text-base" />
      </div>

      <div className="flex justify-end border p-3 rounded space-x-10">
        <TertiaryHeading
          title="Income from Operations"
          className=" text-base"
        />
        <TertiaryHeading title="$45,873.12" className=" text-base" />
      </div>
    </div>
  );
}
