import { IResponseInterface } from '../interfaces/api-response.interface';
import { IRFI } from '../interfaces/rfi.interface';
import { HttpService } from './base.service';

export type CreateRFIData = {
  projectId: string;
  description: string;
  type: 'private' | 'public';
  file?: {
    url: string;
    extension: string;
    type: string;
    name: string;
  };
};

export type ReplyRFIData = {
  projectId: string;
  description: string;
  type: 'private' | 'public';
  responseTo: string;
  file?: {
    url: string;
    extension: string;
    type: string;
    name: string;
  };
};

export type UpdateRFIData = {
  rfiId?: string;
  projectId: string;
  description: string;
  type: 'private' | 'public';
  responseTo: string;
  file?: {
    url: string;
    extension: string;
    type: string;
    name: string;
  };
};

class RfiService extends HttpService {
  private endPoint = 'api/bids';

  httpCreateRFI = (
    data: CreateRFIData
  ): Promise<
    IResponseInterface<{
      createdRFI: IRFI;
    }>
  > => this.post(`${this.endPoint}/create-rfi`, data);

  httpReplyRFI = (
    data: ReplyRFIData
  ): Promise<
    IResponseInterface<{
      createdRFI: IRFI;
    }>
  > => this.post(`${this.endPoint}/reply-rfi`, data);

  httpUpdateRFI = (
    data: UpdateRFIData
  ): Promise<
    IResponseInterface<{
      updatedRFI: IRFI;
    }>
  > => this.put(`${this.endPoint}/update-rfi`, data);

  httpGetAllProjectRFIs = (
    projectId: string
  ): Promise<
    IResponseInterface<{
      rfis: IRFI[];
    }>
  > => this.get(`${this.endPoint}/all-rfi/?projectId=${projectId}`);
}

export const rfiService = new RfiService();
