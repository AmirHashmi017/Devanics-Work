import _ from 'lodash';
import { useTrades } from 'src/hooks/useTrades';
import { IGetUserDetail } from 'src/services/user.service';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';

type Props = {
  data: IGetUserDetail;
};
export function ViewUserTrades({ data }: Props) {
  const { tradeCategoryFilters, tradesQuery, trades } = useTrades();

  function getSelectedTradesByParent(parentId: string) {
    const tradesByParent = trades
      .filter((trade) => trade.tradeCategoryId._id === parentId)
      .map((t) => t._id);
    return _.intersection(tradesByParent, data.selectedTrades);
  }
  return (
    <div>
      {tradesQuery.isLoading ? (
        <Skeleton />
      ) : (
        tradeCategoryFilters.map((parent, index) => {
          return (
            <div key={index}>
              <h2 id={`accordion-flush-heading-${index}`} className="mb-2">
                <button
                  type="button"
                  className="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3 bg-white"
                  data-accordion-target={`#accordion-flush-body-${index}`}
                  aria-expanded={'true'}
                  aria-controls={`accordion-flush-body-${index}`}
                >
                  <h6 className={`text-gray-700 font-semibold `}>
                    {parent.label}
                    <span className={`text-gray-500 ms-3 font-normal`}>
                      {getSelectedTradesByParent(parent.value).length > 0
                        ? `${
                            getSelectedTradesByParent(parent.value).length
                          } selected`
                        : ''}
                    </span>
                  </h6>
                  <img
                    src={'/assets/icons/chevron-up.svg'}
                    width={20}
                    height={20}
                    alt="chevron-up"
                  />
                </button>
              </h2>
              <div
                id={`accordion-flush-body-${index}`}
                className={`block space-x-2 space-y-2 `}
                aria-labelledby={`accordion-flush-heading-${index} `}
              >
                {trades
                  .filter((trade) => trade.tradeCategoryId._id === parent.value)
                  .map((child) => {
                    return data.selectedTrades?.includes(child._id) ? (
                      <button
                        key={child._id}
                        className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 border rounded-full px-4 py-1 text-sm font-medium hover:text-gray-700 hover:bg-white cursor-pointer bg-[#E6F2F8] text-[#667085] "
                      >
                        {child.name}
                        <CloseOutlined className="ml-2 font-bold text-lg" />
                      </button>
                    ) : (
                      <button
                        key={child._id}
                        className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 bg-white border rounded-full px-4 py-1 text-sm font-medium text-gray-700 cursor-pointer hover:bg-[#E6F2F8] hover:text-[#667085] "
                      >
                        {child.name}
                        <PlusOutlined className="ml-2 font-bold text-lg" />
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
