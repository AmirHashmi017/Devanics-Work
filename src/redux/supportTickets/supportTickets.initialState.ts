interface ISupportTicket {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: any;
}

const initialSupportTicketsState: ISupportTicket = {
  loading: false,
  error: null,
  message: null,
  data: null,
  statusCode: null,
};

export default initialSupportTicketsState;
