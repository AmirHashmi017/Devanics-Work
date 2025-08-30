import { CurrencyFormat } from '../utils/format';
import { CurrencyType } from '../utils/types';
import { useUser } from './useUser';

type Props = {
  currency?: CurrencyType;
};

export function useCurrencyFormatter(props?: Props) {
  const { currency } = props || {};

  const authUser = useUser();
  return {
    format: (
      amount: number,
      locale = authUser?.currency?.locale,
      code = authUser?.currency.code
    ) => {
      return CurrencyFormat(
        amount,
        currency?.locale || locale,
        currency?.code || code
      );
    },
    currency: currency
      ? currency
      : authUser
        ? authUser.currency
        : {
            locale: 'en-US',
            code: 'USD',
            symbol: '$',
          },
  };
}
