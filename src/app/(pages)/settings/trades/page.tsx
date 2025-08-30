'use client';
import { withAuth } from '@/app/hoc/withAuth';
import { useTrades } from '@/app/hooks/useTrades';
import { useUser } from '@/app/hooks/useUser';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import _, { isEmpty } from 'lodash';
import Image from 'next/image';
import SettingSidebar from '../verticleBar';
import PrimaryHeading from '@/app/component/headings/primary';
import { useEffect, useMemo, useState } from 'react';
import CustomButton from '@/app/component/customButton/button';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addSelectedTrades } from '@/redux/authSlices/auth.thunk';

function TradesPage() {
  const { tradeCategoryFilters, tradesQuery, trades } = useTrades();
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCollapse, setActiveCollapse] = useState<number | null>(null);
  const dispatch: any = useDispatch();

  const authUser: any = useUser();
  useEffect(() => {
    if (authUser && authUser.selectedTrades) {
      setSelectedTrades(
        authUser.selectedTrades
        // []
      );
    }
  }, [authUser]);

  function getSelectedTradesByParent(parentId: string) {
    const tradesByParent = trades
      .filter((trade) => trade.tradeCategoryId._id === parentId)
      .map((t) => t._id);
    return _.intersection(tradesByParent, selectedTrades);
  }

  // if selectedTrades has same values as authUser.selectedTrades then disable save button
  // use lodash intersection to compare the two arrays
  // if the length of the intersection is greater than 0 then save button is enabled
  const canSave = useMemo(() => {
    if (
      !authUser ||
      !authUser.selectedTrades ||
      authUser.selectedTrades.length === 0
    ) {
      return false;
    }
    return _.intersection(selectedTrades, authUser.selectedTrades).length > 0;
  }, [authUser, selectedTrades]);

  const handleSave = () => {
    setIsLoading(true);
    if (isEmpty(selectedTrades)) {
      toast.error('Please select at least one trade');
      setIsLoading(false);
      return;
    } else {
      const payload = {
        userId: authUser?._id,
        selectedTrades,
      };
      dispatch(addSelectedTrades(payload))
        .unwrap()
        .then(() => {
          toast.success('Trades saved successfully');
          setIsLoading(false);
        })
        .catch((err: any) => {
          console.log('err', err);
          setIsLoading(false);
        });
    }
  };
  const toggleCollapse = (index: number) => {
    if (activeCollapse === index) {
      setActiveCollapse(null);
    } else {
      setActiveCollapse(index);
    }
  };

  function toggleCategory(tradeCategoryId: string) {
    if (selectedTrades.includes(tradeCategoryId)) {
      setSelectedTrades(
        selectedTrades.filter((item) => item !== tradeCategoryId)
      );
    } else {
      setSelectedTrades([...selectedTrades, tradeCategoryId]);
    }
  }

  return (
    <SettingSidebar>
      <div className="mt-6 mb-[39px] mx-4 p-5 space-y-2 w-full rounded-xl bg-white shadow-xl">
        <PrimaryHeading title="Trades" className="text-center mb-4" />

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
                    aria-expanded={activeCollapse === index ? 'true' : 'false'}
                    aria-controls={`accordion-flush-body-${index}`}
                    onClick={() => toggleCollapse(index)}
                  >
                    <h6
                      className={`text-gray-700 ${activeCollapse === index ? 'font-semibold' : ' font-normal'}`}
                    >
                      {parent.label}
                      <span className={`text-gray-500 ms-3 font-normal`}>
                        {getSelectedTradesByParent(parent.value).length > 0
                          ? `${getSelectedTradesByParent(parent.value).length} selected`
                          : ''}
                      </span>
                    </h6>
                    <Image
                      src={'/chevron-up.svg'}
                      width={20}
                      height={20}
                      alt="chevron-up"
                    />
                  </button>
                </h2>
                <div
                  id={`accordion-flush-body-${index}`}
                  className={`${
                    activeCollapse === index
                      ? 'block space-x-2 space-y-2 '
                      : 'hidden'
                  }`}
                  aria-labelledby={`accordion-flush-heading-${index} `}
                >
                  {trades
                    .filter(
                      (trade) => trade.tradeCategoryId._id === parent.value
                    )
                    .map((child) => {
                      return selectedTrades.includes(child._id) ? (
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
          })
        )}

        <div className="flex justify-end">
          <CustomButton
            text="Save"
            className={`!w-fit ${!canSave ? 'disabled' : ''}`}
            disabled={!canSave}
            isLoading={isLoading}
            onClick={handleSave}
          />
        </div>
      </div>
    </SettingSidebar>
  );
}

export default withAuth(TradesPage);
