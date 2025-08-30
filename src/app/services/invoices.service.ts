import { IResponseInterface } from '../interfaces/api-response.interface';
import { IInvoice, IInvoiceType } from '../interfaces/invoices.interface';
import { HttpService } from './base.service';

export type CreateInvoiceData = {
  subContractorFirstName: string;
  subContractorLastName: string;
  subContractorPhoneNumber: number;
  subContractorEmail: string;
  subContractorAddress: string;
  invoiceNumber: string;
  projectName: string;
  applicationNumber: string;
  invoiceSubject: string;
  issueDate: string;
  dueDate: string;
  discount: number;
  taxes: number;
  profitAndOverhead: string;
  totalPayable: number;
  invoiceItems: { [key: string]: any }[];
};

class InvoiceService extends HttpService {
  private readonly prefix: string = 'api/invoices';

  httpAddNewInvoice = (
    data: CreateInvoiceData
  ): Promise<IResponseInterface<IInvoiceType>> =>
    this.post(`${this.prefix}/createInvoice`, data);

  httpGetAllSubcontractorInvoices = (): Promise<
    IResponseInterface<{ invoices: IInvoice[] }>
  > => this.get(`${this.prefix}/getInvoices`);

  httpGetSubcontractorInvoiceById = (
    id: string
  ): Promise<IResponseInterface<{ invoice: IInvoice }>> =>
    this.get(`${this.prefix}/get/${id}`);

  httpUpdateSubcontractorInvoice = (
    data: Partial<IInvoice>,
    id: string
  ): Promise<IResponseInterface<{ invoice: IInvoice }>> =>
    this.post(`${this.prefix}/update-contractor/${id}`, data);

  httpDeleteContractorInvoice = (
    clientId: string
  ): Promise<IResponseInterface<{ invoice: IInvoice }>> =>
    this.delete(`${this.prefix}/contractor/${clientId}`);
}

export const invoiceService = new InvoiceService();
