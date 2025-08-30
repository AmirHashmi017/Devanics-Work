import { CurrencyType } from '@/app/utils/types';
import { FileInterface } from '../file.interface';
import { IUserInterface } from '../user.interface';

export interface IFinancialAsset {
  _id: string;
  name: string;
  costCode: number;
  assetType:
    | 'Cash on Bank'
    | 'Contract Receivable'
    | 'Startup Inventory'
    | 'Vehicles'
    | 'Lands'
    | 'Equipments'
    | 'Buildings'
    | 'Vehicles  Accumulated Depreciation';
  assetDate: string;
  invoiceNo: string;
  totalPrice: number;
  project: string;
  note: string;
  salesTax: number;
  countryTax: number;
  paymentMethod: string;
  reference: string;
  repeat: string;
  file: FileInterface;
  user: string | IUserInterface;
  currency?: CurrencyType;
  createdAt: string;
  updatedAt: string;
}
