import { SelectComponent } from '@/app/component/customSelect/Select.component';
import QuinaryHeading from '@/app/component/headings/quinary';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { Checkbox, Divider, Skeleton } from 'antd';
import { useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { ITrade } from '@/app/interfaces/trade.interface';
import type { FormikProps } from 'formik';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { isArrayString } from '@/app/utils/typescript.utils';
import { useTrades } from '@/app/hooks/useTrades';

type Props = {
  children?: React.ReactNode;
  formik: FormikProps<IBidManagement>;
};
export function PostProjectTrades({ formik, children }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAll, setSelectAll] = useState(false);
  const { trades, tradeCategoryFilters, tradesQuery } = useTrades();
  const [checkedParent, setCheckedParent] = useState<string[]>([]);

  function pickOnlyIds(trades: ITrade[]) {
    return trades.map((trade) => trade._id);
  }

  function selectAllTradesAndCategories(trades: ITrade[]) {
    const newTrades = pickOnlyIds(trades);
    formik.setFieldValue('selectedTrades', newTrades);
    setCheckedParent(tradeCategoryFilters.map((trade) => trade.value));
  }

  function deSelectAllTradesAndCategories() {
    formik.setFieldValue('selectedTrades', []);
    setCheckedParent([]);
  }

  function selectSubCategories(parentId: string) {
    const selectedTrades = trades.filter(
      (trade) => trade.tradeCategoryId._id === parentId
    );
    const ids = pickOnlyIds(selectedTrades);
    formik.setFieldValue('selectedTrades', [
      ...formik.values.selectedTrades,
      ...ids,
    ]);
    setCheckedParent([...checkedParent, parentId]);
  }

  function deSelectSubCategories(parentId: string) {
    const selectedTrades = trades.filter(
      (trade) => trade.tradeCategoryId._id !== parentId
    );
    const ids = pickOnlyIds(selectedTrades);
    // remove ids from formik.values.selectedTrades
    formik.setFieldValue(
      'selectedTrades',
      formik.values.selectedTrades.filter((trade) => {
        return typeof trade === 'string'
          ? ids.includes(trade)
          : ids.includes(trade._id);
      })
    );
    setCheckedParent(checkedParent.filter((parent) => parent !== parentId));
  }

  function toggleCategory(tradeCategoryId: string) {
    const selectedTrades = formik.values.selectedTrades;
    if (isArrayString(selectedTrades)) {
      const index = selectedTrades.indexOf(tradeCategoryId);
      if (index === -1) {
        formik.setFieldValue('selectedTrades', [
          ...selectedTrades,
          tradeCategoryId,
        ]);
      } else {
        formik.setFieldValue(
          'selectedTrades',
          selectedTrades.filter((trade) => trade !== tradeCategoryId)
        );
      }
      return;
    } else {
      const foundTrade = selectedTrades.find(
        (trade) => trade._id === tradeCategoryId
      );
      if (foundTrade) {
        formik.setFieldValue(
          'selectedTrades',
          selectedTrades.filter((trade) => trade._id !== tradeCategoryId)
        );
      } else {
        formik.setFieldValue('selectedTrades', [
          ...selectedTrades,
          trades.find((trade) => trade._id === tradeCategoryId),
        ]);
      }
    }
  }

  if (tradesQuery.isLoading) {
    return <Skeleton />;
  }

  function filterTradesByParent(id: string, trades: ITrade[]) {
    return trades.filter((trade) => trade.tradeCategoryId._id === id);
  }

  // box-shadow: 0px 4px 30px 0px #2E2D740D;

  return (
    <div className=" bg-white shadow-[0_4px_30px_0px_#2E2D740D] rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <TertiaryHeading
            title="Trades"
            className="text-[20px] leading-[30px]"
          />
          <Checkbox
            checked={selectedAll}
            onChange={(e) => {
              setSelectAll(e.target.checked);
              if (e.target.checked) {
                selectAllTradesAndCategories(trades);
              } else {
                deSelectAllTradesAndCategories();
              }
            }}
          >
            <QuinaryHeading title="Select All" className="text-[#98A2B3]" />
          </Checkbox>
        </div>
        <div>
          <SelectComponent
            label=""
            placeholder="Choose Trade"
            name="type"
            field={{
              className: '!w-44',
              dropdownStyle: { width: 300 },
              options: tradeCategoryFilters,
              allowClear: true,
              value: selectedCategory?.length ? selectedCategory : undefined,
              showSearch: true,
              onChange(value) {
                setSelectedCategory(value);
              },
              size: 'middle',
            }}
          />
        </div>
      </div>

      <div className="mt-5">
        {tradeCategoryFilters
          .filter((trade) => {
            if (!selectedCategory) {
              return trade;
            }
            return trade.value === selectedCategory;
          })
          .map((trade) => {
            return (
              <div key={trade.value}>
                <div className="flex items-center space-x-3 mt-3">
                  <TertiaryHeading
                    title={trade.label}
                    className="text-[16px] leading-[30px] text-[#344054] font-medium"
                  />
                  <Checkbox
                    key={trade.value}
                    onChange={() => {
                      if (checkedParent.includes(trade.value)) {
                        deSelectSubCategories(trade.value);
                      } else {
                        selectSubCategories(trade.value);
                      }
                    }}
                    checked={checkedParent.includes(trade.value)}
                  >
                    <QuinaryHeading
                      title="All Categories"
                      className="text-[#98A2B3]"
                    />
                  </Checkbox>
                </div>
                <Divider className="mt-1" />

                <div className="flex flex-wrap gap-2 mt-3">
                  {filterTradesByParent(trade.value, trades).map((child) => {
                    return isArrayString(formik.values.selectedTrades) &&
                      formik.values.selectedTrades.includes(child._id) ? (
                      <button
                        key={child._id}
                        className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 border rounded-full px-4 py-1 text-sm font-medium hover:text-gray-700 hover:bg-white cursor-pointer bg-[#E6F2F8] text-[#667085] "
                        onClick={() => toggleCategory(child._id)}
                      >
                        {child.name}
                        <CloseOutlined className="ml-2 font-bold text-lg" />
                      </button>
                    ) : (
                      <button
                        key={child._id}
                        className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 bg-white border rounded-full px-4 py-1 text-sm font-medium text-gray-700 cursor-pointer hover:bg-[#E6F2F8] hover:text-[#667085] "
                        onClick={() => toggleCategory(child._id)}
                      >
                        {child.name}
                        <PlusOutlined className="ml-2 font-bold text-lg" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {children}
    </div>
  );
}
{
  /* // <button key={service.name} className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 bg-white border rounded-full px-4 py-1 text-sm font-medium text-gray-700 cursor-pointer hover:bg-[#F4EBFF] hover:text-[#667085] "
                                   
                                // >
                                //     {service.name}
                                //     <PlusOutlined className="ml-2 font-bold text-lg" />
                                // </button> */
}
