import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { HttpService } from '../base.service';
import { IFinancialToolAssetAnalytics } from '@/app/interfaces/financial/financial-tools.interface';

class FinancialToolsService extends HttpService {
  private readonly prefix: string = 'api/financial/tools';

  httpGetReceivableAndCompleted = (
    year: string
  ): Promise<
    IResponseInterface<{
      aiaCompleted: number[];
      aiaReceivable: number[];
      standardCompleted: number[];
      standardReceivable: number[];
    }>
  > => this.get(`${this.prefix}/receivable-completed?year=${year}`);

  httpGetAssetAnalytics = (
    year: string
  ): Promise<IResponseInterface<IFinancialToolAssetAnalytics[]>> =>
    this.get(`${this.prefix}/asset-analytics?year=${year}`);

  httpGetExpenseAnalytics = (
    year: string
  ): Promise<
    IResponseInterface<{
      paid: number[];
      unpaid: number[];
    }>
  > => this.get(`${this.prefix}/expense-analytics?year=${year}`);
}

export default new FinancialToolsService();
