import { IFinancialAsset } from '@/app/interfaces/financial/financial-asset.interface';

export function getCashonBankFromAssets(assets: IFinancialAsset[]) {
  return assets.filter((asset) => asset.assetType === 'Cash on Bank');
}
