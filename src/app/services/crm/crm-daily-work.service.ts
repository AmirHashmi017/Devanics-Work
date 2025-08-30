import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { HttpService } from '../base.service';
import {
  ICrmDailyWork,
  ICrmDailyWorkParsedData,
  IDailyWorkPriorty,
  IDailyWorkStatus,
} from '@/app/interfaces/crm/crm-daily-work.interface';

export type ICrmDailyWorkCreate = {
  work: string;
  deadline: string;
  note: string;
  email: string;
  phone: string;
  status: string;
  priority: string;
};

export type ICrmDailyWorkUpdate = {
  _id: string;
  work: string;
  deadline: string;
  note: string;
  email: string;
  phone: string;
  status: string;
  priority: string;
};

type CreateDailyWorkStatus = {
  name: string;
  color: string;
};

type CreateDailyWorkPriority = {
  name: string;
  color: string;
};

class CrmDailyWorkService extends HttpService {
  private prefix = 'api/crm/daily-work';

  httpCreateDailyWork = (
    data: ICrmDailyWorkCreate
  ): Promise<IResponseInterface<ICrmDailyWork>> =>
    this.post(`${this.prefix}/lead/create`, data);

  httpGetDailyWorkByDate = (
    date: string
  ): Promise<IResponseInterface<ICrmDailyWork[]>> =>
    this.get(`${this.prefix}/leads/${date}`);

  httpUpdatedailyLead = (
    id: string,
    data: Partial<Omit<ICrmDailyWork, '_id'>>
  ): Promise<IResponseInterface<ICrmDailyWork>> =>
    this.put(`${this.prefix}/lead/${id}`, data);

  httpDeleteDailyWorkLead = (
    _id: string
  ): Promise<IResponseInterface<ICrmDailyWork>> =>
    this.delete(`${this.prefix}/lead/${_id}`);

  httpUploadAndParseCSVFile = (
    data: FormData
  ): Promise<IResponseInterface<ICrmDailyWorkParsedData[]>> =>
    this.post(`${this.prefix}/lead/parse`, data);

  httpInsertManyLeads = (
    data: ICrmDailyWorkParsedData[]
  ): Promise<IResponseInterface<ICrmDailyWork[]>> =>
    this.post(`${this.prefix}/lead/saveMany`, data);

  // Status
  httpCreateDailyWorkStatus = (
    data: CreateDailyWorkStatus
  ): Promise<IResponseInterface<IDailyWorkStatus>> =>
    this.post(`${this.prefix}/status`, data);

  httpGetAllDailyWorkStatus = (): Promise<
    IResponseInterface<IDailyWorkStatus[]>
  > => this.get(`${this.prefix}/status/all`);

  httpUpdateDailyWorkStatus = (
    data: CreateDailyWorkStatus & {
      _id: string;
    }
  ): Promise<IResponseInterface<IDailyWorkStatus>> =>
    this.put(`${this.prefix}/status`, data);

  httpDeleteDailyWorkStatus = (
    _id: string
  ): Promise<IResponseInterface<IDailyWorkStatus>> =>
    this.delete(`${this.prefix}/status/${_id}`);

  // Priority
  httpGetAllDailyWorkPriority = (): Promise<
    IResponseInterface<IDailyWorkPriorty[]>
  > => this.get(`${this.prefix}/priority/all`);

  httpCreateDailyWorkPriority = (
    data: CreateDailyWorkPriority
  ): Promise<IResponseInterface<IDailyWorkPriorty>> =>
    this.post(`${this.prefix}/priority`, data);

  httpUpdateDailyWorkPriority = (
    data: CreateDailyWorkPriority & {
      _id: string;
    }
  ): Promise<IResponseInterface<IDailyWorkPriorty>> =>
    this.put(`${this.prefix}/priority`, data);

  httpDeleteDailyWorkPriority = (
    _id: string
  ): Promise<IResponseInterface<IDailyWorkPriorty>> =>
    this.delete(`${this.prefix}/priority/${_id}`);
}

export default new CrmDailyWorkService();
