export interface ITrade {
  _id: string;
  user: string;
  tradeCategoryId: ITradeCategory;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITradeCategory {
  _id: string;
  user: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
