import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { HttpService } from '../base.service';
import {
  ContractPartyType,
  ICrmContract,
} from '@/app/interfaces/crm/crm-contract.interface';

export type CreateContractData = Omit<
  ICrmContract,
  '_id' | 'createdAt' | 'updatedAt' | 'user' | 'companyPdf' | 'userPdf'
>;

export type UpdateContractData = CreateContractData & {};
class CrmContractService extends HttpService {
  private endPoint = 'api/crm/contract';

  httpCreateContract = (
    data: CreateContractData
  ): Promise<IResponseInterface<ICrmContract>> =>
    this.post(this.endPoint, data);

  httpUpdateContract = (
    id: string,
    data: UpdateContractData
  ): Promise<IResponseInterface<ICrmContract>> =>
    this.put(`${this.endPoint}/${id}`, data);

  httpFindContractById = (
    id: string
  ): Promise<IResponseInterface<ICrmContract>> =>
    this.get(`${this.endPoint}/${id}`);

  httpDeleteContractById = (
    id: string
  ): Promise<IResponseInterface<ICrmContract>> =>
    this.delete(`${this.endPoint}/${id}`);

  httpSendContract = (
    id: string,
    receipts: ContractPartyType[]
  ): Promise<IResponseInterface<ICrmContract>> =>
    this.post(`${this.endPoint}/send/${id}`, { receipts });

  httpSignContract = (
    id: string,
    receipt: ContractPartyType,
    signedFileUrl: string
  ): Promise<IResponseInterface<ICrmContract>> =>
    this.post(`${this.endPoint}/sign/${id}`, { receipt, signedFileUrl });

  httpSenderUpdateTools = (
    id: string,
    tools: ContractPartyType[]
  ): Promise<IResponseInterface<ICrmContract>> =>
    this.post(`${this.endPoint}/sender-tools/${id}`, { tools });

  httpGetCompanyContracts = (): Promise<IResponseInterface<ICrmContract[]>> =>
    this.get(`${this.endPoint}/all`);
}

export default new CrmContractService();
