import { HttpService } from '../base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IFinancialAsset } from '@/app/interfaces/financial/financial-asset.interface';

export type ICreateFinancialAsset = Omit<
  IFinancialAsset,
  '_id' | 'createdAt' | 'updatedAt' | 'user'
>;

class FinancialAssetService extends HttpService {
  private readonly prefix = 'api/financial/assets';

  httpCreateAsset = (
    data: ICreateFinancialAsset
  ): Promise<IResponseInterface<IFinancialAsset>> =>
    this.post(`${this.prefix}/create`, data);

  httpGetAllAssets = (
    page: number,
    limit: number = 9
  ): Promise<
    IResponseInterface<{
      assets: IFinancialAsset[];
      count: number;
    }>
  > => this.get(`${this.prefix}/all?page=${page}&limit=${limit}`);

  httpDeleteAsset = (
    AssetId: string
  ): Promise<IResponseInterface<IFinancialAsset>> =>
    this.delete(`${this.prefix}/delete/${AssetId}`);

  httpUpdateAsset = (
    data: ICreateFinancialAsset,
    AssetId: string
  ): Promise<IResponseInterface<IFinancialAsset>> =>
    this.put(`${this.prefix}/update/${AssetId}`, data);
}

export default new FinancialAssetService();
