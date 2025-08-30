import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { HttpService } from '../base.service';
import { IInvoice } from '@/app/interfaces/invoices.interface';
import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';
import { IFinancialExpense } from '@/app/interfaces/financial/financial-expense.interface';
import { IFinancialAsset } from '@/app/interfaces/financial/financial-asset.interface';

class FinancialStatementService extends HttpService {
  private readonly prefix: string = 'api/financial/statement';

  httpGetAllFinancialStatements = (
    start: Date,
    end: Date
  ): Promise<
    IResponseInterface<{
      standardInvoices: IInvoice[];
      aiainvoices: IAIAInvoice[];
      expenses: IFinancialExpense[];
      assets: IFinancialAsset[];
    }>
  > => this.get(`${this.prefix}/?start=${start}&end=${end}`);
}

export default new FinancialStatementService();
