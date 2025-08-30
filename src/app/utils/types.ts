export type voidFc = () => void;
export type resetVoidFc = { resetForm: voidFc };

export type CurrencyType = {
  locale: string;
  code: string;
  symbol: string;
  date: Date;
};
