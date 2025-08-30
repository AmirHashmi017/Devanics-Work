import { IResponseInterface } from '../interfaces/api-response.interface';
import { G7State, IAIAInvoice } from '../interfaces/client-invoice.interface';
import { FileInterface } from '../interfaces/file.interface';
import { HttpService } from './base.service';

class ClientInvoiceService extends HttpService {
  private readonly prefix: string = 'api/client-invoices';

  httpCreateInitialInvoice = (data: {
    client: string;
    architect: string;
    invoiceName: string;
  }): Promise<IResponseInterface<{ invoice: IAIAInvoice }>> =>
    this.post(`${this.prefix}/create`, data);

  httpUpdateParentInvoice = (
    id: string,
    data: G7State
  ): Promise<IResponseInterface<{ invoice: IAIAInvoice }>> =>
    this.post(`${this.prefix}/update/${id}`, data);

  httpUploadInvoiceDocuments = (
    id: string,
    data: {
      otherFiles: FileInterface[];
      salesFiles: FileInterface[];
      materialsFiles: FileInterface[];
      federalPaperFiles: FileInterface[];
      lienWaiverFiles: FileInterface[];
    }
  ): Promise<IResponseInterface<IAIAInvoice>> =>
    this.post(`${this.prefix}/upload/${id}`, data);

  httpGetParentInvoiceById = (
    id: string
  ): Promise<IResponseInterface<{ invoice: IAIAInvoice }>> =>
    this.get(`${this.prefix}/invoice/${id}`);

  httpCreateNewInvoicePhase = (
    id: string,
    data: G7State
  ): Promise<IResponseInterface<{ invoice: IAIAInvoice }>> =>
    this.post(`${this.prefix}/createPhase/${id}`, data);

  httpGetAllInvoices = (): Promise<
    IResponseInterface<{ invoices: IAIAInvoice[] }>
  > => this.get(`${this.prefix}/getInvoices`);

  httpGetAllInvoicesWithChildren = (): Promise<
    IResponseInterface<{ invoices: IAIAInvoice[] }>
  > => this.get(`${this.prefix}/all`);

  httpGetInvoicePhases = (
    invoiceId: string
  ): Promise<IResponseInterface<{ invoices: IAIAInvoice[] }>> =>
    this.get(`${this.prefix}/getPhases/${invoiceId}`);

  httpDeleteClientInvoiceAndPhases = (
    invoiceId: string
  ): Promise<IResponseInterface<{ invoice: IAIAInvoice }>> =>
    this.delete(`${this.prefix}/${invoiceId}`);
}

export const clientInvoiceService = new ClientInvoiceService();
