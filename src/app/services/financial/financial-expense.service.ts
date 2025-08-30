import { IFinancialExpense } from '@/app/interfaces/financial/financial-expense.interface';
import { HttpService } from '../base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';

export type ICreateFinancialExpense = Omit<
  IFinancialExpense,
  '_id' | 'createdAt' | 'updatedAt' | 'user'
>;

export type IUpdateFinancialExpense = Partial<ICreateFinancialExpense>;

class FinancialExpenseService extends HttpService {
  private readonly prefix = 'api/financial/expense';

  httpCreateExpense = (
    data: ICreateFinancialExpense
  ): Promise<IResponseInterface<IFinancialExpense>> =>
    this.post(`${this.prefix}/create`, data);

  httpGetAllExpenses = (
    page: number,
    limit: number = 9
  ): Promise<
    IResponseInterface<{
      expenses: IFinancialExpense[];
      count: number;
    }>
  > => this.get(`${this.prefix}/all?page=${page}&limit=${limit}`);

  httpDeleteExpense = (
    expenseId: string
  ): Promise<IResponseInterface<IFinancialExpense>> =>
    this.delete(`${this.prefix}/delete/${expenseId}`);

  httpUpdateExpense = (
    data: IUpdateFinancialExpense,
    expenseId: string
  ): Promise<IResponseInterface<IFinancialExpense>> =>
    this.put(`${this.prefix}/update/${expenseId}`, data);
}

export default new FinancialExpenseService();
