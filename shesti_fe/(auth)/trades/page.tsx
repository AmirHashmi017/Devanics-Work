'use client';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

// module imports
import AuthNavbar from '@/app/(pages)/(auth)/authNavbar';
import { tertiaryHeading } from '@/globals/tailwindvariables';
import PrimaryHeading from '@/app/component/headings/primary';
import Button from '@/app/component/customButton/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addSelectedTrades } from '@/redux/authSlices/auth.thunk';
import _, { isEmpty } from 'lodash';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { useTrades } from '@/app/hooks/useTrades';
import { Skeleton } from 'antd';
import Image from 'next/image';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { usePricing } from '../usePricing';

const Trades = () => {
  const router = useRouterHook();
  const dispatch: any = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);
  const { user: userData } = auth;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCollapse, setActiveCollapse] = useState<number | null>(null);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const { tradeCategoryFilters, tradesQuery, trades } = useTrades();
  const pricingHook = usePricing();

  const toggleCollapse = (index: number) => {
    if (activeCollapse === index) {
      setActiveCollapse(null);
    } else {
      setActiveCollapse(index);
    }
  };

  const submitHandler = () => {
    setIsLoading(true);
    if (isEmpty(selectedTrades)) {
      if (pricingHook.getValueFromStorage()) {
        router.push('/payment');
      } else {
        router.push('/plans');
      }
    } else {
      const payload = {
        userId: userData?.user?._id,
        selectedTrades,
      };
      dispatch(addSelectedTrades(payload))
        .unwrap()
        .then(() => {
          router.push('/verification');
          setIsLoading(false);
        })
        .catch((err: any) => {
          console.log('err', err);
          setIsLoading(false);
        });
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

  function getSelectedTradesByParent(parentId: string) {
    const tradesByParent = trades
      .filter((trade) => trade.tradeCategoryId._id === parentId)
      .map((t) => t._id);
    return _.intersection(tradesByParent, selectedTrades);
  }

  return (
    <>
      <AuthNavbar />
      <div className="h-[calc(100vh-100px)] mt-2 grid place-items-center">
        <div className="w-full max-w-xl ">
          <h2 className={twMerge(`${tertiaryHeading} mb-2`)}>Trades</h2>
          <div className="w-full h-1 bg-mistyWhite"></div>
          <div className="mt-6 bg-white rounded-lg shadow-tertiaryMystery p-10">
            <PrimaryHeading
              title="Select Trades"
              className="text-center mb-12"
            />
            <div
              id="accordion-flush"
              data-accordion="collapse"
              data-active-classes="bg-white text-gray-900 dark:text-white"
              data-inactive-classes="text-gray-500 dark:text-gray-400"
            >
              {tradesQuery.isLoading ? (
                <Skeleton />
              ) : (
                tradeCategoryFilters.map((parent, index) => {
                  return (
                    <div key={index}>
                      <h2
                        id={`accordion-flush-heading-${index}`}
                        className="mb-2"
                      >
                        <button
                          type="button"
                          className="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3 bg-white"
                          data-accordion-target={`#accordion-flush-body-${index}`}
                          aria-expanded={
                            activeCollapse === index ? 'true' : 'false'
                          }
                          aria-controls={`accordion-flush-body-${index}`}
                          onClick={() => toggleCollapse(index)}
                        >
                          <h6
                            className={`text-gray-700 ${activeCollapse === index ? 'font-semibold' : ' font-normal'}`}
                          >
                            {parent.label}
                            <span className={`text-gray-500 ms-3 font-normal`}>
                              {getSelectedTradesByParent(parent.value).length >
                              0
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
                            (trade) =>
                              trade.tradeCategoryId._id === parent.value
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
            </div>
          </div>
          <Button
            isLoading={isLoading}
            onClick={submitHandler}
            text="Next"
            className={`w-full my-3 ${isLoading ? 'disabled' : ''}`}
            type="submit"
          />
        </div>
      </div>
    </>
  );
};

export default Trades;
