import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';

export interface IClientInvoiceState {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: IAIAInvoice[];
}

const initialClientInvoiceState: IClientInvoiceState = {
  loading: false,
  error: null,
  message: null,
  data: [],
  statusCode: null,
};

export default initialClientInvoiceState;
