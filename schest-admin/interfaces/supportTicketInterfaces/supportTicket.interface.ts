export type ITicketFile = {
  name: string;
  fileType: string;
  url: string;
  size: number;
};

export interface ISupportTicket {
  _id?: string;
  title: string;
  status?: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  file?: ITicketFile;
}
