import { useState } from 'react';
import { useQuery } from 'react-query';
import { ITrade } from '../interfaces/trade.interface';
import { AxiosError } from 'axios';
import { tradeService } from '../services/trade.service';
import { toast } from 'react-toastify';
import { IResponseInterface } from '../interfaces/api-response.interface';
import _ from 'lodash';

export function useTrades() {
  const [trades, setTrades] = useState<ITrade[]>([]);

  const tradesQuery = useQuery<
    IResponseInterface<{ trades: ITrade[] }>,
    AxiosError<{ message: string }>
  >(
    ['trades'],
    async () => {
      return tradeService.httpGetAllTrades();
    },
    {
      onSuccess(res) {
        if (res.data && res.data.trades) {
          setTrades(res.data.trades);
        }
      },
      onError(err) {
        toast.error(err.response?.data.message);
      },
      // refetchOnWindowFocus: false,
      //1 hour in milliseconds
      // staleTime: 1000 * 60 * 60,
    }
  );

  const tradeCategoryFilters = _.uniqBy(
    trades.map((trade) => ({
      label: trade.tradeCategoryId.name,
      value: trade.tradeCategoryId._id,
    })),
    'value'
  );

  return {
    trades,
    tradeCategoryFilters,
    setTrades,
    tradesQuery,
  };
}
