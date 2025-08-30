import { IInvoice } from '@/app/interfaces/invoices.interface';

interface IInvoiceState {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: IInvoice[];
}

const initialInvoiceState: IInvoiceState = {
  loading: false,
  error: null,
  message: null,
  data: [],
  statusCode: null,
};

export default initialInvoiceState;
