export interface IAdManagement {
  clientName: string;
  duration: number;
  expiryDate: string;
  imageURL: string;
  startDate: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type ICreateAd = Omit<IAdManagement, '_id' | 'createdAt' | 'updatedAt'>;
