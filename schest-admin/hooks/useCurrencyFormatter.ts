import { useUser } from './useUser';

export const USCurrencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function CurrencyFormat(
  amount: number,
  locale: string = 'en-US',
  code: string = 'USD'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
  }).format(amount);
}

export type CurrencyType = {
  locale: string;
  code: string;
  symbol: string;
  date: Date;
};

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
