import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { HttpService } from '../base.service';
import {
  CommonCrmType,
  CrmModuleType,
  CrmSubcontractorParsedType,
  CrmType,
  ICrmContractorModule,
  ICrmPartnerModule,
  ICrmSubcontractorModule,
} from '@/app/interfaces/crm/crm.interface';

type CreateCrmItemType = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  companyName: string;
  phone: string;
  secondAddress?: string;
  module: 'clients' | 'partners' | 'vendors' | 'architects' | 'contractors';
};

type CreateCrmSubcontractorType = Omit<
  ICrmSubcontractorModule,
  '_id' | 'createdAt' | 'updatedAt' | 'associatedCompany'
>;
type CreateCrmPartnerType = Omit<
  ICrmPartnerModule,
  '_id' | 'createdAt' | 'updatedAt' | 'associatedCompany'
>;

type CreateCrmContractorType = Omit<
  ICrmContractorModule,
  '_id' | 'createdAt' | 'updatedAt' | 'associatedCompany'
>;

type QueryParams = {
  module: CrmModuleType;
};

type CreateCrmItem =
  | CreateCrmSubcontractorType
  | CreateCrmItemType
  | CreateCrmPartnerType
  | CreateCrmContractorType;

class CrmService extends HttpService {
  private endPoint = 'api/crm';

  httpCreate = (data: CreateCrmItem): Promise<IResponseInterface<CrmType>> =>
    this.post(this.endPoint, data);

  httpCreateMany = (
    data: (CommonCrmType | CrmSubcontractorParsedType)[],
    module: CrmModuleType
  ): Promise<
    IResponseInterface<{
      duplicates: (CommonCrmType | CrmSubcontractorParsedType)[];
      items: CrmType[];
    }>
  > => this.post(`${this.endPoint}/createMany?module=${module}`, data);

  httpGetItems = (query: QueryParams): Promise<IResponseInterface<CrmType[]>> =>
    this.get(`${this.endPoint}/all?module=${query.module}`);

  httpGetItemById = (id: string): Promise<IResponseInterface<CrmType>> =>
    this.get(`${this.endPoint}/${id}`);

  httpfindByIdAndUpdate = (
    id: string,
    data: CreateCrmItem
  ): Promise<IResponseInterface<CrmType>> =>
    this.put(`${this.endPoint}/${id}`, data);

  httpfindByIdAndUpdateStatus = (
    id: string,
    data: {
      status: boolean;
    }
  ): Promise<IResponseInterface<CrmType>> =>
    this.put(`${this.endPoint}/status/${id}`, data);

  httpfindByIdAndDelete = (id: string): Promise<IResponseInterface<CrmType>> =>
    this.delete(`${this.endPoint}/${id}`);

  httpParseCsvFile = (
    formData: FormData,
    module: CrmModuleType
  ): Promise<
    IResponseInterface<(CommonCrmType | CrmSubcontractorParsedType)[]>
  > => this.post(`${this.endPoint}/parse-csv?module=${module}`, formData);

  httpSendSMS = (data: {
    client: string;
    architect: string;
    others: string[];
  }): Promise<IResponseInterface<any>> =>
    this.post(`${this.endPoint}/send-sms`, data);
}

const crmService = new CrmService();

export default crmService;
