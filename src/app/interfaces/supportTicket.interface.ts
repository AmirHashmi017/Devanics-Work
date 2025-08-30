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

export type ITicketMessage = {
  user: string;
  ticketId: string;
  message: string;
  sender: string;
  isFile: boolean;
  fileExtension: string;
  fileUrl: string;
  fileName: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};
