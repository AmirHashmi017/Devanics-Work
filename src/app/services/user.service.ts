// Importing base class
import { HttpService } from '@/app/services/base.service';
import {
  IClient,
  IPartner,
  ICreateClient,
  IDashboardStats,
} from '@/app/interfaces/companyInterfaces/companyClient.interface';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { String } from 'aws-sdk/clients/acm';
import { IUserInterface } from '../interfaces/user.interface';
// import { IUpdateCompanyDetail } from '../interfaces/companyInterfaces/updateCompany.interface';

class UserService extends HttpService {
  private readonly companyPrefix: string = 'api/company';
  private readonly userPrefix: string = 'api/user';
  private readonly partnerPrefix: string = 'api/partner';

  httpUpdateCompanyDetail = (
    data: any
  ): Promise<IResponseInterface<{ user: IUserInterface }>> =>
    this.post(`${this.userPrefix}/updateCompanyDetail`, data);

  httpAddNewEmployee = (data: any): Promise<IResponseInterface<any>> =>
    this.post(`${this.userPrefix}/newEmployee`, data);

  httpUpdateEmployee = (
    data: any,
    id: string
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.userPrefix}/updateEmployee/${id}`, data);

  httpBlockEmployee = (id: string): Promise<IResponseInterface<any>> =>
    this.post(`${this.userPrefix}/block`, id);

  httpUnBlockEmployee = (id: string): Promise<IResponseInterface<any>> =>
    this.post(`${this.userPrefix}/unBlock`, id);

  httpGetCompanyDetail = (): Promise<IResponseInterface> =>
    this.get(`${this.userPrefix}/companyDetail`);

  httpGetCompanyInfo = (id: string): Promise<IResponseInterface> =>
    this.get(`${this.userPrefix}/companyDetail/${id}`);

  httpGetUsers = (
    page: number,
    limit: number = 9,
    queryRoles: String
  ): Promise<IResponseInterface<any>> =>
    this.get(
      `${this.userPrefix}/users?page=${page}&limit=${limit}&queryRoles=${queryRoles}`
    );

  httpGetAdminUsers = (
    page: number,
    limit: number = 9,
    queryRoles: String
  ): Promise<IResponseInterface<any>> =>
    this.get(
      `${this.userPrefix}/admin/users?page=${page}&limit=${limit}&queryRoles=${queryRoles}`
    );

  // company client services
  httpGetCompanyClients = (
    page: number,
    limit: number = 9
  ): Promise<IResponseInterface> =>
    this.get(`${this.companyPrefix}/allClients?page=${page}&limit=${limit}`);

  httpUploadCrmClientsCsvAndParse = (
    data: FormData
  ): Promise<IResponseInterface<IClient[]>> =>
    this.post(`${this.companyPrefix}/parse-data`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  httpGetAllCompanyClients = (): Promise<
    IResponseInterface<{ clients: IClient[] }>
  > => this.get(`${this.companyPrefix}/allClients`);

  httpDeleteClient = (clientId: string): Promise<IResponseInterface> =>
    this.post(`${this.companyPrefix}/deleteClient/${clientId}`);

  httpChangeClientStatus = (clientDetail: {
    clientId: string;
    status: boolean;
  }): Promise<IResponseInterface> =>
    this.post(
      `${this.companyPrefix}/changeClientStatus/${clientDetail.clientId}`,
      { status: clientDetail.status }
    );

  httpDeleteUser = (
    userId: string
  ): Promise<IResponseInterface<IUserInterface>> =>
    this.delete(`${this.userPrefix}/delete/${userId}`);

  httpAddNewClient = (data: IClient): Promise<IResponseInterface<any>> =>
    this.post(`${this.companyPrefix}/newClient`, data);

  httpFindCompanyClient = (
    id: string
  ): Promise<IResponseInterface<{ client: IClient }>> =>
    this.get(`${this.companyPrefix}/client/${id}`);

  httpUpdateClient = (
    data: ICreateClient,
    clientId: string | string[]
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.companyPrefix}/updateClient/${clientId}`, data);

  // company partner service

  httpGetCompanyPartners = (
    page: number,
    limit: number = 9
  ): Promise<IResponseInterface> =>
    this.get(`${this.partnerPrefix}/allPartners?page=${page}&limit=${limit}`);

  httpAddNewPartner = (
    data: IPartner
  ): Promise<IResponseInterface<{ client: IPartner }>> =>
    this.post(`${this.partnerPrefix}/newPartner`, data);

  httpUpdatePartner = (
    data: IPartner,
    partnerId: string | string[]
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.partnerPrefix}/updatePartner/${partnerId}`, data);

  updateSocialProfile = (
    id: string | string[],
    body: { socialName: string; socialAvatar?: string }
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.userPrefix}/updateSocialProfile/${id}`, body);

  httpDeletePartner = (partnerId: string): Promise<IResponseInterface> =>
    this.post(`${this.partnerPrefix}/deletePartner/${partnerId}`);

  httpIsBlocked = (): Promise<IResponseInterface<any>> =>
    this.get(`${this.userPrefix}/isBlocked`);

  httpUploadCrmPartnersCsvAndParse = (
    data: FormData
  ): Promise<IResponseInterface<IClient[]>> =>
    this.post(`${this.partnerPrefix}/parse-data`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  httpFindCompanyPartnerDetail = (
    id: string
  ): Promise<IResponseInterface<{ partner: IPartner }>> =>
    this.get(`${this.partnerPrefix}/partner/${id}`);

  httpDashbaordStatics = (): Promise<IResponseInterface<IDashboardStats>> =>
    this.get(`${this.userPrefix}/dashboardStats`);

  httpUpdateCurrency = (
    data: IUserInterface['currency']
  ): Promise<IResponseInterface<IUserInterface>> =>
    this.put(`${this.userPrefix}/currency`, data);
}

export const userService = new UserService();
